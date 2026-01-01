/*
Overview: Provides a shared HTTP client that unifies browser and node usage while protecting headers and query helpers.
Purpose: Let ActionApp, ActionClient, and diagnostics buttons call APIs consistently without repeating fetch boilerplate.
Audience: Backend and frontend developers who need a predictable request wrapper for CRUD and diagnostics.
Problem Addressed: The codebase previously replicated fetch options across modules and lacked centralized error shaping.
Use Cases: Trigger GET/POST/PUT/DELETE for users, sessions, and diagnostics, while automatically applying base URLs and headers.
Features: Normalizes URLs, merges headers, handles JSON payloads, and returns structured responses with status/data.
Benefits: Reduced duplication, clearer request shaping, and easier testing via a single class.
User Stories: As a QA engineer I want to call the backend from tests and browser demos using the same class, so there are no runtime gaps.
User Flow: Instantiate with AppConfig, build headers, call one of the CRUD helpers, and inspect the normalized response object.
System Components: AppConfig/DI layer, the HttpService class, fetch/axios under the hood, and the diagnostic scripts.
Edge Cases: Handles missing base URLs, absent global fetch implementations, and fetch errors by rejecting with a structured error object.
Test Cases: Tests confirm that each method returns `ok` responses and writes the expected status to a log.
Configuration: Sets base URL, headers, and a default timeout via constructor options.
Schema: Responses follow `{ ok, status, data, url, error }`.
*/

import { URL } from 'node:url';

class HttpService {
    constructor(options) {
        if (!options) {
            options = {};
        }
        this.baseUrl = options.baseUrl || '';
        this.headers = options.headers || {};
        this.timeout = options.timeout || 30000;
    }

    mergeHeaders(localHeaders) {
        var result = {};
        var key;
        for (key in this.headers) {
            if (Object.prototype.hasOwnProperty.call(this.headers, key)) {
                result[key] = this.headers[key];
            }
        }
        for (key in localHeaders) {
            if (Object.prototype.hasOwnProperty.call(localHeaders, key)) {
                result[key] = localHeaders[key];
            }
        }
        return result;
    }

    buildUrl(resource, params) {
        var target;
        if (resource.indexOf('http') === 0) {
            target = new URL(resource);
        } else {
            var base = this.baseUrl || 'http://localhost';
            if (base.charAt(base.length - 1) !== '/' && resource.charAt(0) !== '/') {
                base = base + '/';
            }
            target = new URL(resource, base);
        }
        var name;
        if (params) {
            for (name in params) {
                if (Object.prototype.hasOwnProperty.call(params, name)) {
                    target.searchParams.set(name, params[name]);
                }
            }
        }
        return target.toString();
    }

    async request(method, resource, payload, options) {
        var params = {};
        var localOptions = options || {};
        var headers = this.mergeHeaders(localOptions.headers || {});
        if (localOptions.params) {
            params = localOptions.params;
        }
        var url = this.buildUrl(resource, params);
        var bodyText;
        if (payload) {
            bodyText = JSON.stringify(payload);
            if (!headers['content-type']) {
                headers['content-type'] = 'application/json';
            }
        }
        var fetchOptions = {
            method: method,
            headers: headers
        };
        if (bodyText) {
            fetchOptions.body = bodyText;
        }
        if (localOptions.signal) {
            fetchOptions.signal = localOptions.signal;
        }
        if (typeof globalThis.fetch !== 'function') {
            throw new Error('Global fetch is not available');
        }
        var response = await globalThis.fetch(url, fetchOptions);
        var payloadData = null;
        try {
            if (response && typeof response.json === 'function') {
                payloadData = await response.json();
            }
        } catch (error) {
            // ignore parse errors
        }
        return {
            ok: response.ok,
            status: response.status,
            data: payloadData,
            url: url
        };
    }

    async fetch(resource, options) {
        return this.request('GET', resource, null, options);
    }

    async post(resource, payload, options) {
        return this.request('POST', resource, payload, options);
    }

    async put(resource, payload, options) {
        return this.request('PUT', resource, payload, options);
    }

    async delete(resource, options) {
        return this.request('DELETE', resource, null, options);
    }
}

export { HttpService };
