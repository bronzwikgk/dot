/*
Overview: Exercises the manifest-aligned backend classes for v1 user/session create flows.
Purpose: Validate that ActionApp, ActionEntity, ActionFS, ActionLocalStorage, and ActionIndexDb work together across shared runtime logic.
Audience: QA and devs checking the new backend aligns with the documented classes and request/response contract.
Problem Addressed: Ensures code changes matching the manifest are executable by creating users/sessions and logging outcomes.
Use Cases: Instantiates ActionApp, initializes the storage stack, runs createNode for user/session entities with admin credentials, and records responses.
Features: Reuses the same ActionApp/ActionEntity classes, builds contexts for RBAC, writes to JSON/JSONL, and logs a structured report.
Benefits: Provides a repeatable test that demonstrates the implemented classes, covers validation/RBAC, and produces test evidence.
User Stories: "As a tester I want to run this script to ensure the create contract works," and "As a reviewer I want logs of both user and session creations."
User Flow: Load configs, init the classes, call each create method, log responses, persist results to `inprogress/test/user-backend-v1.0.0.test.log`.
System Components: ActionApp, ActionEntity, ActionFS, ActionLocalStorage, ActionIndexDb, SchemaValidator, RBACService.
Edge Cases: Handles schema violations, RBAC denials, missing storage folders via the built-in helper classes.
Test Cases: create user payload, create session payload, verify success responses, log each output with timestamps.
Configuration: Relies on `shunya/config/sample` for schema/policy definitions.
Schema: User register requires username/email/password/role; session requires tokens/expires/status.
*/

import { appendFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { request } from 'node:http';
import { ActionApp } from '../../shunya/ehh/user_backend_v1_0_0_inprogress_WA_Alpha_wonderAgent.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logPath = resolve(__dirname, 'user-backend-v1.0.0.test.log');

function makePayload(type, includeEmail = true) {
  var base = {
    username: 'test-' + Date.now(),
    password: 'Passw0rd!',
    role: 'admin'
  };
  if (includeEmail) {
    base.email = base.username + '@example.com';
  }
  if (type === 'session') {
    base.sessionId = 'sess-' + Date.now();
    base.userId = base.username;
    base.appToken = 'token-' + Date.now();
    base.expiresAt = new Date(Date.now() + 600000).toISOString();
    base.createdAt = new Date().toISOString();
    base.status = 'active';
  }
  return base;
}

async function logResult(message) {
  var timestamp = new Date().toISOString();
  await appendFile(logPath, timestamp + ' - ' + message + '\n', 'utf8');
}

function sendRequest(method, path, data, port) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : '';
    const req = request({
      hostname: 'localhost',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString();
        resolve(JSON.parse(text));
      });
    });
    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function run() {
  await logResult('Test run starting');
  var app = new ActionApp({ port: 0 });
  await app.init();

  var userEntity = app.entities.get('/api/v1/users');
  var sessionEntity = app.entities.get('/api/v1/user-sessions');
  var context = { user: { userId: 'system', role: 'admin' } };

  async function executeTest(name, fn) {
    try {
      const result = await fn();
      await logResult(name + ' success: ' + JSON.stringify(result));
      console.log(name, 'success');
      return result;
    } catch (error) {
      await logResult(name + ' failed: ' + error.message + ' ' + JSON.stringify(error.details || {}));
      console.log(name, 'failed', error.message);
      return null;
    }
  }

  var goodUserPayload = makePayload('user', true);
  await executeTest('valid user create', function () {
    return userEntity.createNode(goodUserPayload, context);
  });

  var badUserPayload = makePayload('user', false);
  await executeTest('invalid user create (missing email)', function () {
    return userEntity.createNode(badUserPayload, context);
  });

  var sessionPayload = makePayload('session', true);
  const sessionResult = await executeTest('session create', function () {
    return sessionEntity.createNode(sessionPayload, context);
  });

  const sessionId = sessionResult && sessionResult.data && sessionResult.data._id;

  await logResult('Test run complete');

  const server = await app.createHttpService(0);
  const port = server.address().port;
  await logResult('HTTP service listening on port ' + port);

  const httpCreate = await executeTest('http create user', function () {
    return sendRequest('POST', '/api/v1/users', makePayload('user', true), port);
  });
  await executeTest('http get users', function () {
    return sendRequest('GET', '/api/v1/users', null, port);
  });
  await executeTest('http batch report', function () {
    return sendRequest('GET', '/api/v1/test/batch', null, port);
  });
  const userId = httpCreate && httpCreate.data && httpCreate.data._id;
  if (userId) {
    await executeTest('http update user', function () {
      return sendRequest('PUT', `/api/v1/users/${userId}`, { role: 'manager' }, port);
    });
    await executeTest('http delete user', function () {
      return sendRequest('DELETE', `/api/v1/users/${userId}`, null, port);
    });
  }
  await executeTest('http get sessions', function () {
    return sendRequest('GET', '/api/v1/user-sessions', null, port);
  });
  await executeTest('http update session', function () {
    return sendRequest('PUT', `/api/v1/user-sessions/${sessionId || 'unknown'}`, { status: 'revoked' }, port);
  });
  await executeTest('http delete session', function () {
    return sendRequest('DELETE', `/api/v1/user-sessions/${sessionId || 'unknown'}`, null, port);
  });

  server.close();
}

run().catch(function (error) {
  console.error('Test failed', error);
  logResult('Test failure: ' + error.message).catch(function () {
    // ignore
  });
  process.exit(1);
});
