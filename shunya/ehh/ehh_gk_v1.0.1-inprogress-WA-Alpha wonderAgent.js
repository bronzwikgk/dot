/*
Overview: Provides versioned gateway configs plus agent instructions for user register/session flows, ensuring every setting remains const.
Purpose: Supply a constant request catalog, response schema, and app settings that downstream code can import without mutation while documenting workspace policies.
Audience: Backend and QA teams wiring the HTTP routes and diagnostics.
Problem Addressed: Previous scripts lacked a versioned config reference that enforces immutability per the agent guidelines.
Use Cases: Import the constants to bootstrap the HTTP routes, compare against test data, or drive documentation—each consumer sees the same request/response/AppConfig values.
Features: Exports `REQUEST_CONFIG`, `RESPONSE_SCHEMA`, `APP_CONFIG`, `instructions`, and shared `EHH_GATEWAY` instance; all configs are defined as const per policy.
Benefits: Prevents accidental mutation, keeps the manifest consistent, and makes the instruction set available alongside the metadata.
User Stories: As an integrator I can update to the next version (`v1.0.1`) whenever a change is needed and read the agent instructions in one place.
User Flow: Import the constants → inspect verbs/roles/validation → reuse the response builder → obey instruction list when editing.
System Components: Const request catalog, const response schema, const app config, versioned export object, and loggable instructions.
Edge Cases: The constructor throws if a route lacks verbs, roles, or entity info while the instruction list warns about new versions.
Test Cases: Tests should assert `REQUEST_CONFIG.routes.length > 0`, ensure each response includes `status/data/message/meta`, and confirm `instructions` mentions versioning.
Configuration: The `AppConfig` defaults point to `json/jsonl` storage adapters, use `x-role` tokens, and include runtime hints.
Schema: Responses include `status`, `data`, `message`, and meta fields per the shared `ResponseConfig`.
*/

const REQUEST_CONFIG = new RequestConfig([
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

const RESPONSE_SCHEMA = new ResponseConfig({
    status: 'number',
    data: 'object',
    message: 'string',
    meta: {
        role: 'string',
        entity: 'string'
    }
});

const APP_CONFIG = new AppConfig({
    runtime: 'node',
    storageAdapters: ['json', 'jsonl'],
    tokenField: 'x-role',
    globalHeaders: { 'x-e2e-gk': 'true' }
});

const instructions = [
    'Import ehh_gk_v1 when wiring user register/session routes.',
    'Treat every config section as a constant object.',
    'Use RequestConfig to look up verbs, RBAC roles, and validation hints before handling requests.',
    'Call buildResponse for consistent response shape (status/data/message/meta).',
    'Set the x-role header per the AppConfig tokenField when making HTTP requests.',
    'Always create a new version file (e.g., v1.0.1) when modifying these configs.',
    'All Agents must welcome only with "yo,!" and keep jobs queue/status updates.',
    'Changelogs must be saved under ./inprogress/log with your exact request text intact.',
    'Semantic versioning and const config enforcement keep the runtime stable.'
];

class EHHGkV1 {
    constructor() {
        this.requestConfig = REQUEST_CONFIG;
        this.responseConfig = RESPONSE_SCHEMA;
        this.appConfig = APP_CONFIG;
    }

    describeRoute(path) {
        const route = this.requestConfig.getRoute(path);
        if (!route) {
            return null;
        }
        return { ...route };
    }

    buildResponse(type, payload, meta) {
        return this.responseConfig.build(type, payload, meta);
    }
}

const EHH_GATEWAY = new EHHGkV1();

export { EHH_GATEWAY, REQUEST_CONFIG, RESPONSE_SCHEMA, APP_CONFIG, instructions };
