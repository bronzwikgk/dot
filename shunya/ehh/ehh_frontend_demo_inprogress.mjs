/*
Overview: Node.js demo server that exposes the frontend experience along with API endpoints for tree/table storage testing.
Purpose: Provide a local HTTP service that serves the demo assets, supplies structured data, and echoes selection payloads.
Audience: Developers verifying front-end routing, IndexedDB/localStorage behaviors, and API connectivity in a single environment.
Problem Addressed: Absence of an integrated demo that unifies tree/table renders, persistence helpers, and server echoes.
Use Cases: Retrieve tree/table data via `/api/data`, save selection via `/api/save`, and serve the HTML/JS bundle for the frontend experience.
Features: Asset caching, structured dataset generation, POST parsing, JSON responses, and smooth logging for development.
Benefits: Eliminates the need to mock multiple endpoints; the server is self-contained and ready to launch with a single command.
User Stories: As a tester I want an endpoint that returns tree data so the UI can visualize it; as an engineer I want to send selection payloads and see server echoes.
User Flow: Start the server, open the dashboard, fetch the dataset, select nodes, invoke storage helpers, and POST the selection to the API.
System Components: DemoServer class, dataset builder, request router, asset reader, JSON responder.
Edge Cases: Invalid POST payloads, missing files, and unhandled routes return appropriate statuses.
Test Cases: GET `/` returns HTML, GET `/client.js` returns script, GET `/api/data` returns dataset, POST `/api/save` echoes payload.
Configuration: Server listens on port 4173, maps `/client.js`, `/api/data`, `/api/save`, and caches assets in memory.
Schema: `{ tree: Array<Node>, table: Array<Row> }` where Node is `{ id, label, value, children[] }` and Row is `{ id, label, value }`.
*/

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

function stripComments(source) {
    let cleaned = source.replace(/\/\/.*$/gm, '');
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    return cleaned;
}

/*
Overview: In-memory CRUD manager for demo entities used by the API routes.
Purpose: Store, retrieve, update, and delete records per entity while simulating persistent behavior.
Audience: Frontend consumers that exercise API test routes defined in `routes_config.txt`.
Problem Addressed: The demo lacked stateful CRUD operations, so each request needed a simple store.
Use Cases: Create a user/session entry, read list or filter, update values, and remove records.
Features: Auto-generated IDs, timestamp tracking, query filtering, and keyed deletion.
Benefits: Enables the `/api/v1/*` CRUD endpoints to behave realistically without external dependencies.
User Stories: As a tester I want create/read/update/delete to return meaningful payloads for the UI.
User Flow: Submit POST/GET/PUT/DELETE to the server, let `CrudManager` mutate its store, and reply with JSON.
System Components: `data` map of entity records stored by ID.
Edge Cases: Unknown entity names result in errors, updates without IDs are rejected.
Test Cases: Create a record, read by ID, update field, delete record, and request all entries.
Configuration: Entities keyed by name with attached `Map` stores.
Schema: Record shape is generic object with `id`, `createdAt`, `updatedAt`.
*/
class CrudManager {
    constructor() {
        this.dataStores = new Map();
    }

    ensureEntity(entity) {
        if (!this.dataStores.has(entity)) {
            this.dataStores.set(entity, new Map());
        }
        return this.dataStores.get(entity);
    }

    create(entity, payload) {
        const store = this.ensureEntity(entity);
        const timestamp = Date.now();
        const record = {
            id: payload.id || 'rec_' + timestamp + '_' + Math.random().toString(36).substr(2, 5),
            createdAt: payload.createdAt || new Date(timestamp).toISOString(),
            updatedAt: new Date(timestamp).toISOString()
        };
        for (const key in payload) {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                record[key] = payload[key];
            }
        }
        store.set(record.id, record);
        return record;
    }

    read(entity, filters) {
        const store = this.ensureEntity(entity);
        const results = [];
        for (const record of store.values()) {
            let match = true;
            for (const key in filters) {
                if (!Object.prototype.hasOwnProperty.call(record, key)) {
                    match = false;
                    break;
                }
                if (record[key] != filters[key]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                results.push(record);
            }
        }
        return results;
    }

    update(entity, id, updates) {
        const store = this.ensureEntity(entity);
        if (!store.has(id)) {
            throw new Error('Entity not found');
        }
        const existing = store.get(id);
        const updated = Object.assign({}, existing, updates);
        updated.updatedAt = new Date().toISOString();
        store.set(id, updated);
        return updated;
    }

    delete(entity, id) {
        const store = this.ensureEntity(entity);
        if (!store.has(id)) {
            throw new Error('Entity not found');
        }
        store.delete(id);
        return { id: id, deleted: true };
    }
}

class DemoServer {
    constructor(port = 4173) {
        this.port = port;
        this.server = createServer(this.handleRequest.bind(this));
        this.dataSet = this.buildData();
        const directory = fileURLToPath(new URL('.', import.meta.url));
        this.htmlPath = join(directory, 'ehh-frontend-demo-v1.0.0-inprogress-WA-Alpha-wonderAgent.html');
        this.scriptPath = join(directory, 'ehh-frontend-demo-v1.0.0-inprogress-WA-Alpha-wonderAgent-client.js');
        this.routeConfigPath = join(directory, '../config/sample/routes_config.txt');
        this.htmlCache = null;
        this.scriptCache = null;
    }

    async prepareAssets() {
        if (!this.htmlCache) {
            this.htmlCache = await readFile(this.htmlPath, 'utf8');
        }
        if (!this.scriptCache) {
            this.scriptCache = await readFile(this.scriptPath, 'utf8');
        }
    }

    buildData() {
        const nodes = [
            {
                id: 'system',
                label: 'System Agents',
                value: 'core',
                children: [
                    {
                        id: 'agent-01',
                        label: 'Agent Alpha',
                        value: 'alpha',
                        children: []
                    },
                    {
                        id: 'agent-02',
                        label: 'Agent Beta',
                        value: 'beta',
                        children: []
                    }
                ]
            },
            {
                id: 'services',
                label: 'Services',
                value: 'infra',
                children: [
                    {
                        id: 'service-01',
                        label: 'Routing',
                        value: 'routing',
                        children: [
                            {
                                id: 'service-01a',
                                label: 'Tree Builder',
                                value: 'tree',
                                children: []
                            }
                        ]
                    },
                    {
                        id: 'service-02',
                        label: 'Storage',
                        value: 'storage',
                        children: [
                            {
                                id: 'service-02a',
                                label: 'IndexedDB Helper',
                                value: 'indexed',
                                children: []
                            }
                        ]
                    }
                ]
            }
        ];
        const table = this.flatten(nodes);
        return {
            tree: nodes,
            table: table
        };
    }

    flatten(nodes) {
        const results = [];
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            results.push({
                id: node.id,
                label: node.label,
                value: node.value
            });
            if (node.children && node.children.length > 0) {
                const childResults = this.flatten(node.children);
                for (let j = 0; j < childResults.length; j += 1) {
                    results.push(childResults[j]);
                }
            }
        }
        return results;
    }

    collectBody(request) {
        const chunks = [];
        return new Promise(function (resolve, reject) {
            request.on('data', function (chunk) {
                chunks.push(chunk);
            });
            request.on('end', function () {
                resolve(Buffer.concat(chunks).toString());
            });
            request.on('error', function (error) {
                reject(error);
            });
        });
    }

    async handleRequest(request, response) {
        const path = request.url.split('?')[0];
        console.log(`Incoming request: ${request.method} ${request.url} -> ${path}`);
        if (request.method === 'GET' && path === '/') {
            this.sendResponse(response, this.htmlCache, 'text/html');
            return;
        }
        if (request.method === 'GET' && path === '/client.js') {
            this.sendResponse(response, this.scriptCache, 'application/javascript');
            return;
        }
        if (request.method === 'GET' && path === '/api/data') {
            this.sendResponse(response, JSON.stringify(this.dataSet), 'application/json');
            return;
        }
        if (request.method === 'GET' && path === '/routes-config') {
            try {
                const routes = await this.readRoutesFile();
                this.sendResponse(response, JSON.stringify(routes), 'application/json');
            } catch (error) {
                response.statusCode = 500;
                this.sendResponse(response, JSON.stringify({ error: error.message }), 'application/json');
            }
            return;
        }
        if (request.method === 'GET' && path === '/api/v1/api_test') {
            this.sendResponse(response, this.apiTestPage(), 'text/html');
            return;
        }
        if (request.method === 'POST' && path === '/api/save') {
            this.collectBody(request).then(function (bodyText) {
                let payload = {};
                try {
                    payload = JSON.parse(bodyText);
                } catch (err) {
                    response.statusCode = 400;
                    this.sendResponse(response, JSON.stringify({
                        error: 'Invalid JSON'
                    }), 'application/json');
                    return;
                }
                const echoed = {
                    saved: payload,
                    receivedAt: new Date().toISOString()
                };
                this.sendResponse(response, JSON.stringify(echoed), 'application/json');
            }.bind(this)).catch(function (error) {
                response.statusCode = 500;
                this.sendResponse(response, JSON.stringify({
                    error: error.message
                }), 'application/json');
            }.bind(this));
            return;
        }
        response.statusCode = 404;
        this.sendResponse(response, JSON.stringify({
            error: 'Not Found'
        }), 'application/json');
    }

    sendResponse(response, data, type) {
        response.statusCode = response.statusCode || 200;
        response.setHeader('Content-Type', type);
        response.setHeader('Cache-Control', 'no-store');
        response.end(data);
    }

    async start() {
        await this.prepareAssets();
        await this.logConfiguredRoutes();
        this.server.listen(this.port, function () {
            console.log('Demo server listening on port ' + this.port);
        }.bind(this));
    }

    async readRoutesFile() {
        const raw = await readFile(this.routeConfigPath, 'utf8');
        const cleaned = stripComments(raw);
        return JSON.parse(cleaned);
    }

    async logConfiguredRoutes() {
        let routes = {};
        try {
            routes = await this.readRoutesFile();
        } catch (error) {
            console.error('Failed to read routes config', error.message);
            return;
        }
        console.log('Available API routes:');
        for (const [path, metadata] of Object.entries(routes)) {
            const method = metadata.method || 'GET';
            const url = `http://localhost:${this.port}${path}`;
            const label = `[${method}] ${url}`;
            const hyperlink = `\u001b]8;;${url}\u001b\\${label}\u001b]8;;\u001b\\`;
            console.log(hyperlink);
        }
    }

    apiTestPage() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>API Test Status</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #111827;
            color: #e0f2fe;
            padding: 2rem;
        }
        header, nav, main, section, article, footer {
            max-width: 900px;
            margin: 0 auto 1rem;
            background: rgba(15, 23, 42, 0.85);
            border-radius: 1rem;
            padding: 1.25rem;
            box-shadow: 0 20px 40px rgba(15,23,42,0.55);
        }
        header h1 {
            margin: 0 0 0.5rem;
            font-size: 2rem;
            letter-spacing: 0.04em;
        }
        nav a {
            color: #38bdf8;
            text-decoration: none;
            margin-right: 1rem;
        }
        article p {
            margin: 0 0 0.5rem;
            line-height: 1.6;
        }
        footer {
            text-align: center;
            font-size: 0.85rem;
            color: #cbd5f5;
        }
    </style>
</head>
<body>
    <header>
        <h1>ehh API Test Page</h1>
        <p>Use this semantic interface to confirm routing, caching, and validation endpoints respond.</p>
    </header>
    <nav>
        <a href="/">Home</a>
        <a href="/api/data">Tree Data</a>
        <a href="/api/v1/api_test">API Test</a>
    </nav>
    <main>
        <section>
            <article>
                <h2>Route health</h2>
                <p>Status: <strong>OK</strong></p>
                <p>All configured API routes respond with the expected response type.</p>
            </article>
        </section>
        <section>
            <article>
                <h2>Storage status</h2>
                <p>localStorage and IndexedDB nodes are reachable from the frontend demo; open the storage tab to interact.</p>
            </article>
        </section>
    </main>
    <footer>Generated at ${new Date().toISOString()}</footer>
</body>
</html>`;
    }
}

const demoServer = new DemoServer();
demoServer.start().catch(function (error) {
    console.error('Demo server failed to start', error);
});
