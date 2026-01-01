/*
Overview: Executes the entity operations demo so we can report on cache, CRUD, and storage behaviors driven by the sample configs.
Purpose: Provide a test script that runs inside the mandated `inprogress/test` directory and appends a brief result log.
Audience: Engineers verifying the new demo module functions before promoting it to production.
Problem Addressed: Ensures the entity ops module remains testable via a reproducible script with evidence in the test directory.
Use Cases: Run the script during development to confirm JSON/JSONL/CSV/folder operations and RBAC/validation flows are healthy.
Features: Imports the demo class, runs the suite, writes a run marker to `ehh-entity-ops.log`, and surfaces errors if they occur.
Benefits: Easy to execute, keeps logs near the test assets, and obeys the workspace requirement to run tests inside `inprogress/test`.
User Stories: As a QA lead I can re-run this script to validate the demo after any config change.
User Flow: Launch with `node ehh-entity-ops.test.mjs`, observe output and the appended log entry.
System Components: The test harness, the entity ops demo module, and the log file.
Edge Cases: Accumulates repeated runs because log appenders keep entries; handles errors by exiting the process with failure.
Test Cases: Executes the demo suite that covers JSON, JSONL, CSV, cache, and folder CRUD operations.
Configuration: Node script resolves the demo module under `../../shunya/ehh` and writes `ehh-entity-ops.log` beside the test file.
Schema: The test simply orchestrates the demo so it inherits the user register/session schema checks defined by the configs.
*/

import { appendFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EntityOpsDemo } from '../../shunya/ehh/ehh-entity-ops-v1.0.0-inprogress-WA-Alpha wonderAgent.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const markerPath = resolve(__dirname, 'ehh-entity-ops.log');

async function runTest() {
    const demo = new EntityOpsDemo();
    await demo.runSuite();
    const entry = new Date().toISOString() + ' - entity ops test run';
    await appendFile(markerPath, entry + '\n', 'utf8');
}

runTest().catch(function (error) {
    console.error('Entity ops test failed', error);
    process.exit(1);
});
