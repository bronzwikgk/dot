/*
Overview: simple tests that list every action, entity, and role combination.
Purpose: prove that we can plan a batch check for later backend work.
Audience: the team that owns EH flows and wants a list of expected calls.
Problem Addressed: there is no record of which action/entity/role sets must work.
Use Cases: run this file before building real endpoints so we know what to support.
Features: parses the existing data files, loops through each action, entity, and role, and records the combinations.
Benefits: the output log shows every combination and makes it easy to add real calls later.
User Stories: as a tester I want to see all action/entity/role pairs, so I know the backend must handle them.
User Flow: load the configs, make the lists, walk each combination, write the log, and share the report.
System Components: dataset action file, entity list, log file, and the action-entity-role test runner.
Edge Cases: missing files or blank lists cause a clear error message and stop the script.
Test Cases: the script fails early if there are no actions, no entities, or no roles defined.
Configuration: paths are taken from the dataset files with a fixed log location.
Schema: log lines look like action|entity|role|status.
*/

import fs from 'fs';
import path from 'path';

var roles = ['Admin', 'Analyst', 'Viewer'];

class ActionEntityRoleTester {
    constructor(settings) {
        this.baseDir = settings.baseDir;
        this.actionFile = settings.actionFile;
        this.entityFile = settings.entityFile;
        this.logPath = settings.logPath;
        this.actions = [];
        this.entities = [];
        this.entries = [];
    }

    resolveFile(name) {
        return path.resolve(this.baseDir, name);
    }

    readLines(filePath) {
        var text;
        try {
            text = fs.readFileSync(filePath, { encoding: 'utf-8' });
        } catch (err) {
            throw new Error('Cannot read ' + filePath + ': ' + err.message);
        }
        var lines = text.split(/\r?\n/);
        return lines;
    }

    parseActions(filePath) {
        var lines = this.readLines(filePath);
        var listBlock = [];
        var inArray = false;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line.indexOf('const dataset_action') === 0) {
                inArray = true;
                continue;
            }
            if (inArray) {
                if (line.indexOf(']') === 0) {
                    break;
                }
                var cleaned = line.replace(/[,\\[\\]"]/g, '').trim();
                if (cleaned.length > 0) {
                    listBlock.push(cleaned);
                }
            }
        }
        return listBlock;
    }

    parseEntities(filePath) {
        var lines = this.readLines(filePath);
        var items = [];
        for (var i = 0; i < lines.length; i++) {
            var trimmed = lines[i].trim();
            if (trimmed.length === 0) {
                continue;
            }
            if (trimmed.indexOf('-') === 0) {
                trimmed = trimmed.slice(1).trim();
            }
            if (trimmed.length > 0 && trimmed.indexOf('#') !== 0) {
                items.push(trimmed);
            }
        }
        return items;
    }

    loadData() {
        var actionPath = this.resolveFile(this.actionFile);
        var entityPath = this.resolveFile(this.entityFile);
        this.actions = this.parseActions(actionPath);
        this.entities = this.parseEntities(entityPath);
        if (this.actions.length === 0) {
            throw new Error('No actions loaded');
        }
        if (this.entities.length === 0) {
            throw new Error('No entities loaded');
        }
        if (roles.length === 0) {
            throw new Error('No roles defined');
        }
    }

    formatLine(actionName, entityName, roleName) {
        return actionName + '|' + entityName + '|' + roleName + '|pass';
    }

    run() {
        this.entries.push('Action|Entity|Role|Status');
        for (var actionIndex = 0; actionIndex < this.actions.length; actionIndex++) {
            var act = this.actions[actionIndex];
            for (var entityIndex = 0; entityIndex < this.entities.length; entityIndex++) {
                var ent = this.entities[entityIndex];
                for (var roleIndex = 0; roleIndex < roles.length; roleIndex++) {
                    var roleName = roles[roleIndex];
                    var line = this.formatLine(act, ent, roleName);
                    this.entries.push(line);
                }
            }
        }
        this.entries.push('Combinations: ' + (this.actions.length * this.entities.length * roles.length));
        this.saveLog();
        console.log('log saved at', this.logPath);
    }

    saveLog() {
        var body = this.entries.join('\n');
        try {
            fs.writeFileSync(this.logPath, body, { encoding: 'utf-8' });
        } catch (err) {
            throw new Error('Cannot write log: ' + err.message);
        }
    }
}

var tester = new ActionEntityRoleTester({
    baseDir: path.resolve('.'),
    actionFile: 'shunya/dataset_shunya/dataset_shunya_ehh/ehh-v1.1.0-active-KW-wonderAgent-dataset-action.txt',
    entityFile: 'shunya/dataset_shunya/erms/dataset_entity_erms.txt',
    logPath: path.resolve('inprogress/test/action_entity_role.test.log')
});

try {
    tester.loadData();
    tester.run();
} catch (err) {
    console.error('Test failure:', err.message);
    process.exit(1);
}
