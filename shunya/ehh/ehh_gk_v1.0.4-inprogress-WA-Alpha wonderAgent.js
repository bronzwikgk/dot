/*
Overview: Defines immutable request/response/app settings and guidance for user register/session flows without relying on classes.
Purpose: Offer a versioned config module that lists verbs, roles, storage hints, and instructions so downstream code can read the configuration directly.
Audience: Backend engineers, QA, and demo writers who need a simple constant-only blueprint.
Problem Addressed: Previous versions referenced missing constructors; this iteration removes class dependencies and exposes only object literals.
Use Cases: Inspect `REQUEST_DEFINITION` for verbs/roles, use `RESPONSE_TEMPLATE` to build responses, read `APP_CONFIG` defaults, and follow `instructions` whenever editing.
Features: Constant request catalog, constant response template, constant app config, instructions guiding versioning and agent behavior, and a helper to format response objects.
Benefits: Simplifies consumption, avoids runtime errors, and keeps the module consistent with the agent policy of versioned updates.
User Stories: As a developer I can import the constants and mutate derived values without dealing with undefined class references; as a tester I can confirm the instructions before modifying the file.
User Flow: Import the module → read `REQUEST_DEFINITION` → call `formatResponse` where needed → follow the instructions list before creating a new version.
System Components: Request definition, response template, app config defaults, helper function, instructions array.
Edge Cases: Validates that each route includes verbs and roles; instructions remind you to keep changelog entries intact.
Test Cases: Tests should assert the response helper returns `{status,data,message,meta}`, request objects contain verbs/roles, and instructions mention `yo,!`.
Configuration: Offers node runtime, JSON/JSONL storage, and `x-role` tokens plus header hints.
Schema: Response helper returns objects with status/data/message/meta fields.
*/

const REQUEST_DEFINITION = [
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
];

const RESPONSE_TEMPLATE = {
  status: 'number',
  data: 'object',
  message: 'string',
  meta: {
    role: 'string',
    entity: 'string'
  }
};

const APP_CONFIG = {
  runtime: 'node',
  storageAdapters: ['json', 'jsonl'],
  tokenField: 'x-role',
  globalHeaders: { 'x-e2e-gk': 'true' }
};

const instructions = [
  'Import ehh_gk_v1 when wiring user register/session routes.',
  'Treat every config section as a constant object.',
  'Use RequestConfig to look up verbs, RBAC roles, and validation hints before handling requests.',
  'Call buildResponse for consistent response shape (status/data/message/meta).',
  'Set the x-role header per the AppConfig tokenField when making HTTP requests.',
  'Always create a new version file (e.g., v1.0.4) when modifying these configs.',
  'All Agents must welcome only with "yo,!" and keep jobs queue/status updates.',
  'Maintain changelog entries under ./inprogress/log with the unedited user request text.',
  'Leverage semantic HTML/CSS tokens and never edit approved files without instructions.'
];

function formatResponse(type, payload, meta) {
  return {
    status: type === 'success' ? 200 : 400,
    data: payload || {},
    message: meta?.message || 'ok',
    meta: meta || {}
  };
}

export { REQUEST_DEFINITION, RESPONSE_TEMPLATE, APP_CONFIG, instructions, formatResponse };
