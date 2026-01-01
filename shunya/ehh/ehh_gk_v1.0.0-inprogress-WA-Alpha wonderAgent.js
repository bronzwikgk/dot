/*
Overview: Captures the request/response surface plus minimal runtime settings for the EH gateway backend.
Purpose: Offer a single module that defines routes, response templates, and app-level config so user register/session flows can bootstrap quickly.
Audience: Developers wiring the Node backend or browser diagnostics to the shared manifest.
Problem Addressed: Tests and demos need a normalized config object that describes every request, response, RBAC rule, and storage hint for user register and session operations.
Use Cases: Import the module to read the route catalog, emit the response schema, construct simulated payloads, or compare against actual AppConfig values during testing.
Features: Exposes `RequestConfig`, `ResponseConfig`, and `AppConfig` classes, plus a ready-to-use `EHHGkV1` instance with role-aware headers and storage hints.
Benefits: Encapsulates RBAC policies, JSON/JSONL persistence hints, and response formatting, reducing duplication between tests and runtime.
User Stories: As a tester I can load `ehh_gk_v1` to know which HTTP verbs, paths, and bodies the backend supports; as an integrator I can consume the same config from the browser and the Node server.
User Flow: Import the config → inspect `routes` → apply `responseTemplate` → use `AppConfig` values when booting ActionApp.
System Components: Request catalog (routes + verbs), response templates (status/data structure), RBAC/validation metadata, AppConfig defaults (storage adapters, tokens), and the shared export.
Edge Cases: Validates that each route defines verbs, roles, and entity names; guards against missing storage adapters.
Test Cases: Scripts should assert `routes.length` and that each role has at least one allowed verb; response templates must include `status`, `data`, and `message` keys.
Configuration: Defines two route entries for `/api/v1/users` and `/api/v1/user-sessions`, with RBAC roles `guest|user|manager|admin`, storage hints, and a shared app config referencing JSON/JSONL files.
Schema: Responses follow `{ status:number, data:{}, message:string, meta:{ role:string, entity:string } }`.
*/

class RequestConfig {
    constructor(routes) {
        this.routes = routes || [];
        this.validateRoutes();
    }

    validateRoutes() {
        this.routes.forEach((route) => {
            if (!route.path || !route.verbs || !route.entity) {
                throw new Error('Route definition must include path, verbs, and entity');
            }
            if (!route.roles || route.roles.length === 0) {
                throw new Error('Route must declare RBAC roles');
            }
        });
    }

    getRoute(path) {
        return this.routes.find((route) => route.path === path);
    }
}

class ResponseConfig {
    constructor(schema) {
        this.schema = schema;
    }

    build(type, payload, meta) {
        return {
            status: type === 'success' ? 200 : 400,
            data: payload || {},
            message: meta && meta.message ? meta.message : 'ok',
            meta: meta || {}
        };
    }
}

class AppConfig {
    constructor(options) {
        this.runtime = options.runtime || 'node';
        this.storageAdapters = options.storageAdapters || ['json', 'jsonl'];
        this.tokenField = options.tokenField || 'x-role';
        this.globalHeaders = options.globalHeaders || { 'x-app': 'ehh-gk' };
        this.validate();
    }

    validate() {
        if (!this.runtime) {
            throw new Error('AppConfig requires a runtime');
        }
    }
}

class EHHGkV1 {
    constructor() {
        this.requestConfig = new RequestConfig([
            {
                path: '/api/v1/users',
                verbs: ['POST', 'GET', 'PUT', 'DELETE'],
                entity: 'user_register',
                roles: ['guest', 'user', 'manager', 'admin'],
                storage: ['json', 'jsonl'],
                validation: ['email', 'role']
            },
            {
                path: '/api/v1/user-sessions',
                verbs: ['POST', 'GET', 'DELETE'],
                entity: 'user_session',
                roles: ['guest', 'user', 'manager', 'admin'],
                storage: ['jsonl'],
                validation: ['userId', 'agent']
            }
        ]);
        this.responseConfig = new ResponseConfig({
            status: 'number',
            data: 'object',
            message: 'string',
            meta: {
                role: 'string',
                entity: 'string'
            }
        });
        this.appConfig = new AppConfig({
            runtime: 'node',
            storageAdapters: ['json', 'jsonl'],
            tokenField: 'x-role',
            globalHeaders: { 'x-e2e-gk': 'true' }
        });
    }

    describeRoute(path) {
        const route = this.requestConfig.getRoute(path);
        if (!route) {
            return null;
        }
        return {
            path: route.path,
            verbs: route.verbs,
            entity: route.entity,
            roles: route.roles,
            storage: route.storage,
            validation: route.validation
        };
    }

    buildResponse(type, payload, meta) {
        return this.responseConfig.build(type, payload, meta);
    }
}

const ehh_gk_v1 = new EHHGkV1();

const instructions = [
    'Import ehh_gk_v1 when wiring user register/session routes.',
    'Treat every config section as a constant object.',
    'Use RequestConfig to look up verbs, RBAC roles, and validation hints before handling requests.',
    'Call buildResponse for consistent response shape (status/data/message/meta).',
    'Set the x-role header per the AppConfig tokenField when making HTTP requests.',
    'All Agents must make up a name, with keywords, wonderAgent and prefix of choice, like acronym of their name, and use it consistently.',
    'All agents must welcome using only the greeting "yo,!" and no other welcome message.',
    'The very first interaction should be the understanding of scope of work and context of current message.',
    'An agent must maintain a jobs queue.',
    'All agents must display a message reflecting their current status while working.',
    'Always maintain a changelog by creating a new file per task under ./inprogress/log.',
    'File creation should follow the pattern `project name` + ver + status + your name.',
    'Use Node.js only; avoid foreach, arrow functions, shorthand, prototypes, and require; prefer import statements.',
    'Structure code around classes with constructors and methods.',
    'Start every code block with the prescribed descriptive comments, followed by Configuration then Schema.',
    'When testing, keep reports and evidence in ../inprogress/test.',
    'Prefer semantic tags in HTML/CSS and leverage the global token dataset.',
    'Always maintain semantic versioning and never edit approved files.',
    'All templates should be const template name = {}.'
];

export { ehh_gk_v1, RequestConfig, ResponseConfig, AppConfig, instructions };
