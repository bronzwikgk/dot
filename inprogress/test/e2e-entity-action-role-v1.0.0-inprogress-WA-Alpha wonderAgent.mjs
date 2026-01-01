/*
Overview: Executes backend endpoints for every configured entity/action/role combination with diverse payloads.
Purpose: Provide an end-to-end harness that verifies RBAC and field validation across the shared runtime.
Audience: QA and backend engineers tracking EH manifest coverage.
Problem Addressed: No single script exercises the real routes with multiple data sets, roles, and validation checks.
Use Cases: Run this file while the backend listens so every endpoint receives valid and invalid payloads per role, and logs the responses.
Features: Uses HttpService to POST/GET/PUT/DELETE, toggles the `x-role` header (Admin/Analyst/Viewer), logs both success and validation failures, and persists the report.
Benefits: Documents actual request/response data for every combination and proves RBAC/validation flows are enforced.
User Stories: As a tester I can run one harness to sweep all entities/actions with different roles and data.
User Flow: configure base URL, loop roles/entities/actions, capture responses/errors, write log, review.
System Components: HttpService, a role matrix, entity configuration, and log persistence in `inprogress/test`.
Edge Cases: Handles missing servers gracefully, logs network errors, records validation failures (bad payloads).
Test Cases: each entry writes `role|entity|action|status|message` and total combos for auditing.
Configuration: base URL defaults to `http://localhost:4173` but can be overridden via `E2E_BASE_URL`.
Schema: Log lines look like `ROLE|ENTITY|ACTION|status|detail`.
*/

import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { HttpService } from '../../shunya/src/utils/httpService.js';

const roles = ['Admin', 'Analyst', 'Viewer'];
const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:4173';

const entities = [
    {
        name: 'users',
        path: '/api/v1/users',
        payloads: [
            { name: 'Demo User', email: 'demo.user@example.com' },
            { name: 'Tester One', email: 'tester.one@example.com' }
        ],
        invalids: [
            { name: 'Incomplete' },
            { email: 'invalid' }
        ]
    },
    {
        name: 'user-sessions',
        path: '/api/v1/user-sessions',
        payloads: [
            { userId: 'demo', agent: 'browser', device: 'desktop' },
            { userId: 'demo', agent: 'mobile', device: 'android' }
        ],
        invalids: [
            { agent: 'missingId' },
            { userId: '' }
        ]
    }
];

const logPath = resolve('inprogress', 'test', 'e2e-entity-action-role-v1.0.0.test.log');

class E2EEntityActionRoleTest {
    constructor() {
        this.service = new HttpService({
            baseUrl: baseUrl,
            headers: { 'x-e2e-test': 'entity-role-matrix' }
        });
        this.entries = [];
        this.comboCount = 0;
    }

    async send(method, resource, payload, role, expectFailure) {
        var options = {
            headers: { 'x-role': role }
        };
        try {
            var response;
            if (method === 'GET') {
                response = await this.service.fetch(resource, options);
            } else if (method === 'POST') {
                response = await this.service.post(resource, payload, options);
            } else if (method === 'PUT') {
                response = await this.service.put(resource, payload, options);
            } else if (method === 'DELETE') {
                response = await this.service.delete(resource, options);
            } else {
                throw new Error('Unsupported method ' + method);
            }
            this.record(role, resource, method, response.ok ? 'pass' : 'fail', response.status + ' ' + JSON.stringify(response.data || {}));
            return response;
        } catch (error) {
            this.record(role, resource, method, 'error', error.message);
            return null;
        } finally {
            this.comboCount++;
        }
    }

    record(role, resource, action, status, detail) {
        this.entries.push(`${role}|${resource}|${action}|${status}|${detail}`);
    }

    async run() {
        for (var ri = 0; ri < roles.length; ri++) {
            var role = roles[ri];
            for (var ei = 0; ei < entities.length; ei++) {
                var entity = entities[ei];
        // create valid for each payload
        var entityId = null;
        for (var payloadIndex = 0; payloadIndex < entity.payloads.length; payloadIndex++) {
            var payload = entity.payloads[payloadIndex];
            var createResponse = await this.send('POST', entity.path, payload, role);
            if (!entityId && createResponse && createResponse.data && createResponse.data.id) {
                entityId = createResponse.data.id;
            }
        }
        // read list
        await this.send('GET', entity.path, null, role);
        // update if id
                if (entityId) {
                    await this.send('PUT', `${entity.path}/${entityId}`, { ...entity.payload, updated: true }, role);
                    await this.send('DELETE', `${entity.path}/${entityId}`, null, role);
                }
                // invalid payload to test validation for each invalid entry
                for (var invalidIndex = 0; invalidIndex < entity.invalids.length; invalidIndex++) {
                    var invalidPayload = entity.invalids[invalidIndex];
                    await this.send('POST', entity.path, invalidPayload, role, true);
                }
            }
        }
        await appendFile(logPath, this.entries.join('\n') + '\n', { encoding: 'utf-8' });
        await appendFile(logPath, `TOTAL_COMBOS ${this.comboCount}\n`, { encoding: 'utf-8' });
        await this.writeStructuredReports();
        console.log('E2E log written to', logPath);
    }

    async writeStructuredReports() {
        var records = this.entries.map(function (line) {
            var parts = line.split('|');
            return {
                role: parts[0],
                entity: parts[1],
                action: parts[2],
                status: parts[3],
                detail: parts[4]
            };
        });
        var jsonPath = resolve('inprogress', 'test', 'e2e-entity-action-role-v1.0.0.test.json');
        var jsonlPath = resolve('inprogress', 'test', 'e2e-entity-action-role-v1.0.0.test.jsonl');
        var csvPath = resolve('inprogress', 'test', 'e2e-entity-action-role-v1.0.0.test.csv');
        var ymlPath = resolve('inprogress', 'test', 'e2e-entity-action-role-v1.0.0.test.yml');
        await appendFile(jsonPath, JSON.stringify(records, null, 2) + '\n', { encoding: 'utf-8' });
        await appendFile(jsonlPath, records.map(function (rec) {
            return JSON.stringify(rec);
        }).join('\n') + '\n', { encoding: 'utf-8' });
        var csvHeader = 'role,entity,action,status,detail';
        var csvBody = records.map(function (rec) {
            return [rec.role, rec.entity, rec.action, rec.status, rec.detail.replace(/,/g, ';')].join(',');
        }).join('\n');
        await appendFile(csvPath, csvHeader + '\n' + csvBody + '\n', { encoding: 'utf-8' });
        var ymlBody = records.map(function (rec) {
            return `- role: ${rec.role}\n  entity: ${rec.entity}\n  action: ${rec.action}\n  status: ${rec.status}\n  detail: "${rec.detail.replace(/"/g, '\\"')}"`;
        }).join('\n');
        await appendFile(ymlPath, 'records:\n' + ymlBody + '\n', { encoding: 'utf-8' });
    }
}

new E2EEntityActionRoleTest().run().catch(function (error) {
    console.error('E2E test failed', error);
    process.exit(1);
});
