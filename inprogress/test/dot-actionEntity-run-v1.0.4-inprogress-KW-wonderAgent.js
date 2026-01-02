/*
Overview: Execute the ActionEntity example with immediate TTL timers from the test harness.
Purpose: Provide a deterministic runner that stubs asynchronous waits and imports the modular plugin entry point.
Audience: Automated tests and humans validating the bundled CRUD scenario.
Problem Addressed: Without this runner, the default timers sleep for 300s and block test completion.
Use Cases: Regression smoke validation, CI readiness, and manual verification of CLI output.
Features: Immediate TTL overrides, modular import orchestration, and simple error handling.
Benefits: Reliable, repeatable test runs that finish quickly.
User Stories: As a tester I can launch AuthorityEntity flows with TTL stubs from ../inprogress/test.
User Flow: Runner sets fast timers, imports actionEntity_v4.js, and surfaces any initialization errors.
System Components: Depends on Node ESM imports (`path`, `url`, and the plugin entry file).
Edge Cases: Ensures `import` errors or runtime failures bubble up via console logs and exit codes.
Test Cases: Should run the entire sample without delays and complete with exit code 0.
Configuration:
- version: v1.0.4
- status: inprogress
- agent: KW-wonderAgent
Schema:
- type: object
- properties:
  - globalThis: object
  - import: function
  - pathToFileURL: function
*/

import path from 'path';
import { pathToFileURL } from 'url';

globalThis.setTimeout = function (fn) {
  fn();
  return { ref: function () {}, unref: function () {} };
};

const runner = async function () {
  const target = path.resolve(
    '..',
    '..',
    'shunya',
    'src',
    'plugins',
    'actionEntity',
    'actionEntity_v4.js'
  );
  const targetUrl = pathToFileURL(target).href;

  try {
    await import(targetUrl);
  } catch (error) {
    console.error('Runner encountered an error', error);
    process.exit(1);
  }
};

runner().catch((error) => {
  console.error('Unexpected runner failure', error);
  process.exit(1);
});
