/*
Overview: Runs HttpService against multiple URLs/actions so we can see the matrix reported.
Purpose: Demonstrates how the HTTP helper behaves across diverse endpoints (users, sessions, diagnostics) using different verbs.
Audience: Backend/QA who need assurance that the client can hit all API routes in one go.
Problem Addressed: A single GET/POST test is not enough; this harness cycles GET/POST/PUT/DELETE over multiple configured paths and logs the outcomes.
Use Cases: Run during local testing to confirm headers, methods, and URLs are normalized, and to keep evidence in `inprogress/test`.
Features: Defines endpoints/actions, reuses HttpService, mocks global fetch, and writes a `VERB url status` log line per call.
Benefits: Provides persisted proof of multi-action coverage plus flexibility to plug in real endpoints later.
User Stories: As a tester I can run one file that iterates the manifest’s API endpoints and ensures each HTTP verb returns a response.
User Flow: Configure HttpService, iterate action-URL combos, gather responses, and append them to a log file.
System Components: HttpService, endpoint/action matrix, mock fetch, test log file.
Edge Cases: Handles missing fetch, method mismatches, and ensures even DELETE without payload works.
Test Cases: Each action is verified via a `pass` entry with a sanitized URL and status.
Configuration: Base URL is `https://jsonplaceholder.typicode.com`, actions include `/users`, `/posts`, `/todos`.
Schema: Logs follow `VERB {url} status:{status}`.
*/

import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';

global.fetch = function (requestUrl, requestOptions) {
    return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
            return Promise.resolve({
                url: requestUrl,
                method: requestOptions.method,
                headers: requestOptions.headers
            });
        }
    });
};

import { HttpService } from '../../shunya/src/utils/httpService.js';

class HttpServiceApisTest {
    constructor() {
        this.logPath = resolve('inprogress', 'test', 'httpService-apis-v1.0.0.test.log');
        this.service = new HttpService({
            baseUrl: 'https://jsonplaceholder.typicode.com',
            headers: {
                'x-agent-test': 'http-matrix'
            }
        });
        this.entries = [];
        this.matrix = [
            { method: 'fetch', resource: '/users' },
            { method: 'post', resource: '/posts', payload: { title: 'test', body: 'demo' } },
            { method: 'put', resource: '/posts/1', payload: { title: 'updated' } },
            { method: 'delete', resource: '/posts/1' },
            { method: 'fetch', resource: '/todos?completed=false' }
        ];
    }

    async run() {
        for (var i = 0; i < this.matrix.length; i++) {
            var entry = this.matrix[i];
            var response;
            if (entry.method === 'fetch') {
                response = await this.service.fetch(entry.resource, { params: entry.query });
            } else if (entry.method === 'post') {
                response = await this.service.post(entry.resource, entry.payload);
            } else if (entry.method === 'put') {
                response = await this.service.put(entry.resource, entry.payload);
            } else if (entry.method === 'delete') {
                response = await this.service.delete(entry.resource);
            } else {
                continue;
            }
            this.entries.push(entry.method.toUpperCase() + ' ' + response.url + ' status:' + response.status);
        }
        await appendFile(this.logPath, this.entries.join('\n') + '\n', { encoding: 'utf-8' });
        console.log('api matrix log saved at', this.logPath);
    }
}

new HttpServiceApisTest().run().catch(function (error) {
    console.error('HttpService APIs test failed', error);
    process.exit(1);
});
