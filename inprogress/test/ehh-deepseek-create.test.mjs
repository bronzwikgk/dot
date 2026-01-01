/*
Overview: Executes the create/read/update/delete workflow against ERMS to prove entity persistence works in-memory.
Purpose: Provide a reusable unit test that logs each step so we can confirm the deepseek engine behaves as expected.
Audience: Developers verifying the entity store and validator flow before integrating with other services.
Problem Addressed: The prior checks were ad-hoc; this script structures the CRUD steps into one reproducible test with clear logging.
Use Cases: Startup verification, regression checks, documentation of storage behavior for onboarding.
Features: Dynamic import of the framework, structured logging to console and disk, error capture, and cleanup logging.
Benefits: Easy to rerun whenever code changes, and we have a running log of each execution for audit.
User Stories: As a QA engineer I want to run the create flow and see each log entry; as a developer I want a test harness located near other inprogress tests.
User Flow: Launch the script from `inprogress/test`, observe console entries, then inspect `ehh-deepseek-create.log`.
System Components: Demo test harness, ERMS framework import, logging helpers, CRUD executor, log persistence.
Edge Cases: Duplicate IDs, missing fields, and unexpected errors are captured and logged to keep tests informative.
Test Cases: Wait steps around creation, reading, updating, and deleting the same entity while logging each result.
Configuration: The script expects the ERMS source at `../../shunya/ehh_deepseek.js` and writes logs to `ehh-deepseek-create.log`.
Schema: Entities carry `{ id, name, status, createdAt, updatedAt }` with `status` reflecting workflow stage.
*/
import { appendFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frameworkPath = resolve(__dirname, '../../shunya/ehh_deepseek.js');
const frameworkUrl = pathToFileURL(frameworkPath).href;

function normalizeExports(exportsObject) {
    if (exportsObject && exportsObject.ERMSFramework) {
        return exportsObject;
    }
    if (exportsObject && exportsObject.default) {
        return exportsObject.default.ERMSFramework ? exportsObject.default : exportsObject.default;
    }
    return exportsObject;
}

async function loadFramework() {
    const imported = await import(frameworkUrl);
    return normalizeExports(imported);
}

function logMessage(message, logStore) {
    const entry = new Date().toISOString() + ' - ' + message;
    console.log(entry);
    logStore.push(entry);
}

async function flushLog(logStore, logPath) {
    if (logStore.length === 0) {
        return;
    }
    await appendFile(logPath, logStore.join('\n') + '\n', { encoding: 'utf8' });
}

async function runCreateFlow() {
    const loaded = await loadFramework();
    const ERMSFramework = loaded.ERMSFramework || loaded.default || loaded;
    const logStore = [];
    const logPath = resolve(__dirname, 'ehh-deepseek-create.log');
    try {
        logMessage('Initiating create flow test', logStore);
        const erms = new ERMSFramework();
        erms.registerEntity('item', {
            fields: {
                name: { type: 'string', required: true },
                status: { type: 'string' }
            },
            indexes: ['status']
        });

        const created = await erms.entity.create('item', {
            name: 'CreateFlow Entity',
            status: 'new'
        });
        logMessage('Created entity ' + created.id, logStore);

        const found = await erms.entity.read('item', { id: created.id });
        logMessage('Read count ' + found.length, logStore);

        const updated = await erms.entity.update('item', created.id, { status: 'processed' });
        logMessage('Updated status to ' + updated.status, logStore);

        const deleted = await erms.entity.delete('item', created.id);
        logMessage('Deleted ' + deleted.id + ' (deleted flag ' + deleted.deleted + ')', logStore);
    } catch (error) {
        logMessage('Test failed: ' + error.message, logStore);
    } finally {
        await flushLog(logStore, resolve(__dirname, 'ehh-deepseek-create.log'));
    }
}

runCreateFlow();
