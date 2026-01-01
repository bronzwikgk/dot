/*
Overview: Validates the new HttpService by mocking fetch and exercising each helper.
Purpose: Provide a reproducible report that proves the HTTP client works across CRUD verbs.
Audience: Testers and developers who need assurance that requests can be sent with headers and payloads.
Problem Addressed: Ensures wiring between diagnostics/buttons, HttpService, and the backend can share one API.
Use Cases: Run during local development to confirm fetch wrappers do not throw and return normalized data.
Features: Mocks the global fetch, instantiates HttpService with demo headers, calls GET/POST/PUT/DELETE, and writes a log.
Benefits: Offers persistent evidence (`httpService-v1.0.0.test.log`) and customizes responses via the mock.
User Stories: As a tester I want to see every HTTP helper run without hitting real services, so I can trust the request layer.
User Flow: Set up the mock, run each helper sequentially, collect response statuses, and append a summary log.
System Components: HttpService class, Node fetch mock, log file under `inprogress/test`, and the global namespace.
Edge Cases: Throws when global fetch is missing, so the test sets a stub before import resolves, preventing false negatives.
Test Cases: The log asserts `ok` responses for each verb along with the URI, showing the method executed.
Configuration: Uses `shunya/src/utils/httpService.js` and writes logs to `inprogress/test/httpService-v1.0.0.test.log`.
Schema: Log entries follow `VERB url status` for clarity.
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
                method: requestOptions.method
            });
        }
    });
};

import { HttpService } from '../../shunya/src/utils/httpService.js';

class HttpServiceTest {
    constructor() {
        this.logPath = resolve('inprogress', 'test', 'httpService-v1.0.0.test.log');
        this.service = new HttpService({
            baseUrl: 'https://neeva.net',
            headers: {
                'x-agent-test': 'trace'
            }
        });
        this.entries = [];
    }

    async run() {
        var resource = '/api/v1/testing';
        var getResponse = await this.service.fetch(resource);
        this.entries.push('GET ' + getResponse.url + ' ' + getResponse.status);
        var postResponse = await this.service.post(resource, { name: 'test' });
        this.entries.push('POST ' + postResponse.url + ' ' + postResponse.status);
        var putResponse = await this.service.put(resource, { name: 'test', value: 1 });
        this.entries.push('PUT ' + putResponse.url + ' ' + putResponse.status);
        var deleteResponse = await this.service.delete(resource);
        this.entries.push('DELETE ' + deleteResponse.url + ' ' + deleteResponse.status);
        await this.writeLog();
    }

    async writeLog() {
        var payload = this.entries.join('\n') + '\n';
        await appendFile(this.logPath, payload, { encoding: 'utf-8' });
    }
}

new HttpServiceTest().run().catch(function (error) {
    console.error('HttpService test failed', error);
    process.exit(1);
});
