/*
Overview: Demonstrates the JSON/JSONL/CSV/storage operations needed by the EH entity ops flow.
Purpose: Keep an executable Node module that can be imported by tests to validate CRUD plus cache/folder behaviors.
Audience: QA and engineers who need a reference implementation before wiring real backends.
Problem Addressed: There was no concrete code backing the entity ops test script; this class provides the necessary operations.
Use Cases: Run the demo to exercise config-driven data paths, observe log entries, and confirm that persistence layers work.
Features: Creates/reads/updates/deletes JSON, manipulates JSONL and CSV, writes cache files, and manages folder artifacts.
Benefits: Provides a consistent foundation for the EH entity ops diagnostics and lets the test harness import a stable API.
User Stories: As a maintainer I can re-run the demo anytime to ensure the flows described in the manifest remain valid.
User Flow: Instantiate the class, call `runSuite`, and observe the generated report plus any console messages.
System Components: File system operations under `inprogress/test`, plus the log created in `inprogress/log`.
Edge Cases: Handles missing directories by creating them and reports errors to the caller.
Test Cases: Each method records a success line so the harness can confirm JSON/JSONL/CSV/cache/folder coverage.
Configuration: Writes to `inprogress/test/ehh_entity_ops_data` and logs to `inprogress/log/ehh-entity-ops-v1.0.1-inprogress-WA-Alpha wonderAgent.log`.
Schema: Log lines follow `OPERATION | STATUS | DETAILS`.
*/

import { appendFile, mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

class EntityOpsDemo {
    constructor() {
        this.dataDir = path.resolve('inprogress', 'test', 'ehh_entity_ops_data');
        this.reportPath = path.resolve('inprogress', 'log', 'ehh-entity-ops-v1.0.1-inprogress-WA-Alpha wonderAgent.log');
        this.logs = [];
    }

    async ensureDataDirectory() {
        await mkdir(this.dataDir, { recursive: true });
    }

    logLine(line) {
        this.logs.push(line);
    }

    async writeReport() {
        await mkdir(path.dirname(this.reportPath), { recursive: true });
        var payload = this.logs.join('\n') + '\n';
        await writeFile(this.reportPath, payload, { encoding: 'utf-8' });
    }

    async performJsonCrud() {
        var filePath = path.join(this.dataDir, 'entity.json');
        var payload = {
            id: 'json_' + Date.now(),
            status: 'created'
        };
        await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');
        this.logLine('JSON | create | ' + payload.id);
        var raw = await readFile(filePath, 'utf-8');
        var parsed = JSON.parse(raw);
        parsed.status = 'processed';
        await writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
        this.logLine('JSON | update | ' + parsed.status);
        await unlink(filePath);
        this.logLine('JSON | delete | ' + payload.id);
    }

    async performJsonlOps() {
        var filePath = path.join(this.dataDir, 'entity.jsonl');
        var lines = [];
        for (var i = 0; i < 3; i++) {
            var entry = { event: 'log_' + i, ts: Date.now() };
            lines.push(JSON.stringify(entry));
        }
        await writeFile(filePath, lines.join('\n'), 'utf-8');
        this.logLine('JSONL | create | rows=' + lines.length);
        var content = await readFile(filePath, 'utf-8');
        var readLines = content.split(/\r?\n/);
        if (readLines.length > 1) {
            this.logLine('JSONL | read | rows=' + readLines.length);
        }
        await unlink(filePath);
        this.logLine('JSONL | delete | file removed');
    }

    async performCsvOps() {
        var filePath = path.join(this.dataDir, 'entity.csv');
        var header = 'id,name,status';
        var rowList = [];
        for (var i = 0; i < 3; i++) {
            rowList.push('c' + i + ',item_' + i + ',active');
        }
        await writeFile(filePath, header + '\n' + rowList.join('\n'), 'utf-8');
        this.logLine('CSV | create | rows=' + rowList.length);
        var raw = await readFile(filePath, 'utf-8');
        var rowCount = raw.split(/\r?\n/).length - 1;
        this.logLine('CSV | read | rows=' + rowCount);
        await unlink(filePath);
        this.logLine('CSV | delete | file removed');
    }

    async performCacheOps() {
        var filePath = path.join(this.dataDir, 'cache.json');
        var cache = {
            created: new Date().toISOString(),
            entries: [1, 2, 3]
        };
        await writeFile(filePath, JSON.stringify(cache), 'utf-8');
        this.logLine('Cache | write | entries=' + cache.entries.length);
        var raw = await readFile(filePath, 'utf-8');
        var restored = JSON.parse(raw);
        this.logLine('Cache | read | ts=' + restored.created);
        await unlink(filePath);
        this.logLine('Cache | delete | cache cleared');
    }

    async performFolderOps() {
        var folderPath = path.join(this.dataDir, 'node_ops');
        await mkdir(folderPath, { recursive: true });
        var filePath = path.join(folderPath, 'notes.txt');
        await writeFile(filePath, 'node demo', 'utf-8');
        this.logLine('Folder | create | ' + folderPath);
        var renamedFolder = folderPath + '_renamed';
        if (existsSync(renamedFolder)) {
            await mkdir(renamedFolder, { recursive: true });
        }
        await rename(folderPath, renamedFolder);
        this.logLine('Folder | rename | ' + renamedFolder);
        var contents = await readdir(renamedFolder);
        this.logLine('Folder | list | count=' + contents.length);
        await unlink(path.join(renamedFolder, 'notes.txt'));
        await rename(renamedFolder, folderPath);
        this.logLine('Folder | cleanup | restored');
    }

    async runSuite() {
        await this.ensureDataDirectory();
        await this.performJsonCrud();
        await this.performJsonlOps();
        await this.performCsvOps();
        await this.performCacheOps();
        await this.performFolderOps();
        await this.writeReport();
    }
}

export { EntityOpsDemo };
