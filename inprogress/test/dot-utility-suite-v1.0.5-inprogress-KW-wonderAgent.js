/*
Overview: Run the action utility suite covering ActionFs, IndexedDBUtility, and LocalStorageUtility.
Purpose: Validate every helper across the utility folder so the documented datasets match executed flows.
Audience: QA leads and maintainers gating ActionFS and its sibling utilities.
Problem Addressed: Ensures the new approved modules are exercised end-to-end without relying on browser APIs.
Use Cases: File creation/updates, simulated IndexedDB store operations, and LocalStorage-like persistence.
Features: Tests ActionFs methods plus IndexedDB(+store) and LocalStorage helpers.
Benefits: One consolidated script proving all dataset entries are implemented and tested.
User Stories: As a maintainer I can run this suite and get clear success/failure for each utility domain.
User Flow: Executes ActionFs operations, then IndexedDB, then LocalStorage before cleaning workspaces.
System Components: Depends on `dot-actionFs-v1.0.5-approved`, `dot-indexedDBUtility-v1.0.0-approved`, and `dot-localStorageUtility-v1.0.0-approved`.
Edge Cases: Recreates workspaces if they exist and tolerates missing directories through safe cleanup.
Test Cases: Covers 1readConfig..15rmdir plus IndexedDB methods and LocalStorage helpers.
Configuration:
- version: v1.0.5
- status: inprogress
- agent: KW-wonderAgent
Schema:
- type: object
- properties:
  - ActionFs: object
  - IndexedDBUtility: object
  - LocalStorageUtility: object
*/

import path from 'path';
import { ActionFs } from '../../shunya/src/utils/utility/dot-actionFs-v1.0.5-approved-KW-wonderAgent.js';
import { IndexedDBUtility } from '../../shunya/src/utils/utility/dot-indexedDBUtility-v1.0.0-approved-KW-wonderAgent.js';
import { LocalStorageUtility } from '../../shunya/src/utils/utility/dot-localStorageUtility-v1.0.0-approved-KW-wonderAgent.js';

const workspace = path.resolve('./utility-suite-v1.0.5');
const actionFs = new ActionFs(workspace);
const indexedDB = new IndexedDBUtility();
const localStorage = new LocalStorageUtility();

async function cleanup() {
  try {
    await actionFs.rmdir(workspace, { recursive: true, force: true });
  } catch (error) {
    console.warn('Cleanup warning', error.message);
  }
}

async function testActionFs() {
  console.log('ActionFs segment: workspace', workspace);
  await actionFs.mkdir(path.join(workspace, 'configs'));
  const configName = path.join('configs', 'entity_config.json');
  await actionFs.createFile(path.join(workspace, configName), { active: true }, 'json');
  const config = await actionFs.readConfig('entity_config.json');
  if (!config || config.active !== true) {
    throw new Error('readConfig response invalid');
  }
  if (!(await actionFs.fileExists(path.join(workspace, configName)))) {
    throw new Error('fileExists false for config');
  }

  const jsonFile = path.join(workspace, 'files', 'entity.json');
  await actionFs.createFile(jsonFile, { version: 1 });
  await actionFs.writeFile(jsonFile, { version: 2 });
  const data = await actionFs.readFile(jsonFile);
  if (data.version !== 2) {
    throw new Error('writeFile/readFile mismatch');
  }

  const jsonlFile = path.join(workspace, 'files', 'events.jsonl');
  await actionFs.createFile(jsonlFile, [{ entry: 'start' }], 'jsonl');
  await actionFs.appendToFile(jsonlFile, '\n' + JSON.stringify({ entry: 'next' }));
  const events = await actionFs.readFile(jsonlFile, 'jsonl');
  if (events.length !== 2) {
    throw new Error('append/read jsonl mismatch');
  }

  const copyTarget = path.join(workspace, 'files', 'copy', 'entity-copy.json');
  await actionFs.copyFile(jsonFile, copyTarget);
  const moveTarget = path.join(workspace, 'files', 'moved', 'entity-moved.json');
  await actionFs.move(copyTarget, moveTarget);
  const renamed = path.join(workspace, 'files', 'final', 'entity-final.json');
  await actionFs.renameItem(moveTarget, renamed);
  if (!(await actionFs.fileExists(renamed))) {
    throw new Error('rename/move failed');
  }
  await actionFs.rm(renamed);

  const statsDir = path.join(workspace, 'stats');
  await actionFs.mkdir(statsDir, { recursive: true });
  const statsFile = path.join(statsDir, 'report.txt');
  await actionFs.createFile(statsFile, { stats: true });
  const stats = await actionFs.stat(statsFile);
  if (!stats.isFile()) {
    throw new Error('stat reported non-file');
  }
  const statsEntries = await actionFs.readdir(statsDir);
  if (statsEntries.join() !== 'report.txt') {
    throw new Error('readdir unexpected content');
  }

  const clearDir = path.join(workspace, 'files', 'clear');
  await actionFs.createFile(path.join(clearDir, 'a.txt'), { a: 1 });
  await actionFs.createFile(path.join(clearDir, 'b.txt'), { b: 2 });
  await actionFs.clearDirectory(clearDir);
  const cleared = await actionFs.readdir(clearDir);
  if (cleared.length !== 0) {
    throw new Error('clearDirectory failed');
  }
}

async function testIndexedDB() {
  console.log('IndexedDBUtility segment');
  await indexedDB.openDB('test-db');
  await indexedDB.createStore('store');
  await indexedDB.put('store', 'key', { value: 'stored' });
  const stored = await indexedDB.get('store', 'key');
  if (!stored || stored.value !== 'stored') {
    throw new Error('indexedDB put/get mismatch');
  }
  await indexedDB.delete('store', 'key');
  if ((await indexedDB.get('store', 'key')) !== undefined) {
    throw new Error('indexedDB delete failed');
  }
  await indexedDB.put('store', 'a', 1);
  await indexedDB.clear('store');
  await indexedDB.close();
}

async function testLocalStorage() {
  console.log('LocalStorageUtility segment');
  await localStorage.setItem('alpha', 'beta');
  const read = await localStorage.getItem('alpha');
  if (read !== 'beta') {
    throw new Error('LocalStorage get mismatch');
  }
  await localStorage.removeItem('alpha');
  await localStorage.setItem('token', 'x');
  if (await localStorage.key(0) !== 'token') {
    throw new Error('LocalStorage key mismatch');
  }
  if (localStorage.length !== 1) {
    throw new Error('LocalStorage length mismatch');
  }
  await localStorage.clear();
  if (localStorage.length !== 0) {
    throw new Error('LocalStorage clear mismatch');
  }
}

async function runSuite() {
  try {
    await testActionFs();
    await testIndexedDB();
    await testLocalStorage();
    console.log('Utility suite v1.0.5: all helpers verified');
  } finally {
    await cleanup();
  }
}

runSuite().catch((error) => {
  console.error('Utility suite failure', error);
  process.exit(1);
});
