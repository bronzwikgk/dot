/*
Overview: Provide a reusable filesystem adapter for ActionEntity storage helpers.
Purpose: Offer consistent read/write semantics and format-aware serialization for JSON, CSV, and JSONL files.
Audience: Plugin authors and runtime agents that need deterministic storage behavior.
Problem Addressed: Avoid ad-hoc filesystem handling and re-implementations across entity workflows.
Use Cases: Initialize storage files, persist entity records, and read schema-defined collections.
Features: Format-aware serialization, folder and file handling for JSON, JSONL, and simple CSV parsing logic.
Benefits: Reduces duplication, enforces consistency, and centralizes error logging.
User Stories: As a plugin author I can store entity payloads without re-implementing serialization helpers.
User Flow: The agent requests a file operation, ActionFs prepares directories, and serialized data is read or written.
System Components: Depends on Node fs.promises and path helpers.
Edge Cases: Handles missing directories, empty datasets, and unsupported formats gracefully.
Test Cases: Read/write round trips for each supported format and existence verification after cleanup.
Configuration:
- version: v1.0.5
- status: approved
- agent: KW-wonderAgent
Schema:
- type: object
- properties:
  - fs: object
  - path: object
*/

import fs from 'fs/promises';
import path from 'path';


const ACTIONFS_METHODS = [
  '1readConfig',
  '2fileExists',
  '3createFile',
  '4readFile',
  '5writeFile',
  '6appendToFile',
  '7copyFile',
  '8move',
  '9renameItem',
  '10clearDirectory',
  '11mkdir',
  '12readdir',
  '13stat',
  '14rm',
  '15rmdir'
];

const DATASET_ACTIONFS_METHODS_IMPLEMENTED = [
  '1readConfig',
  '2fileExists',
  '3createFile',
  '4readFile',
  '5writeFile',
  '6appendToFile',
  '7copyFile',
  '8move',
  '9renameItem',
  '10clearDirectory',
  '11mkdir',
  '12readdir',
  '13stat',
  '14rm',
  '15rmdir'
];

const DATASET_ACTIONFS_METHODS_TESTED = [
  '1readConfig',
  '2fileExists',
  '3createFile',
  '4readFile',
  '5writeFile',
  '6appendToFile',
  '7copyFile',
  '8move',
  '9renameItem',
  '10clearDirectory',
  '11mkdir',
  '12readdir',
  '13stat',
  '14rm',
  '15rmdir'
];

const DATASET_ACTIONFS_METHODS_PROPOSED = [
  '1readConfig',
  '2fileExists',
  '3createFile',
  '4readFile',
  '5writeFile',
  '6appendToFile',
  '7copyFile',
  '8move',
  '9renameItem',
  '10clearDirectory',
  '11mkdir',
  '12readdir',
  '13stat',
  '14rm',
  '15rmdir'
];

const DATASET_ACTIONFS_METHODS_ROADMAP = [
  '16watchFile',
  '17streamRead',
  '18batchWrite',
  '19transaction',
  '20symlink'
];

class ActionFs {
  constructor(basePath) {
    this.basePath = basePath || './data';
    this.fs = fs;
    this.path = path;
  }

  async readConfig(filename) {
    try {
      const configPath = this.path.join(this.basePath, 'configs', filename);
      const content = await this.fs.readFile(configPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  async fileExists(filePath) {
    try {
      await this.fs.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async createFile(filePath, content, format) {
    if (!format) {
      format = 'json';
    }

    const dirPath = this.path.dirname(filePath);
    await this.fs.mkdir(dirPath, { recursive: true });

    let fileContent = '';
    if (format === 'csv') {
      if (Array.isArray(content) && content.length > 0) {
        const headers = Object.keys(content[0]).join(',');
        const rows = [];
        for (let i = 0; i < content.length; i += 1) {
          const obj = content[i];
          rows.push(Object.values(obj).join(','));
        }
        fileContent = [headers].concat(rows).join('\n');
      } else {
        fileContent = '';
      }
    } else if (format === 'json') {
      fileContent = JSON.stringify(content, null, 2);
    } else if (format === 'jsonl') {
      if (Array.isArray(content)) {
        const lines = [];
        for (let i = 0; i < content.length; i += 1) {
          lines.push(JSON.stringify(content[i]));
        }
        fileContent = lines.join('\n');
      } else {
        fileContent = JSON.stringify(content);
      }
    } else {
      fileContent = String(content);
    }

    await this.fs.writeFile(filePath, fileContent, 'utf8');
    console.log(`Created file: ${filePath}`);
  }

  async readFile(filePath, format) {
    let parsedFormat = format;
    if (!parsedFormat) {
      parsedFormat = 'json';
    }

    try {
      const content = await this.fs.readFile(filePath, 'utf8');
      if (parsedFormat === 'csv') {
        const lines = content.trim().split('\n');
        if (lines.length < 2) {
          return [];
        }

        const headers = lines[0].split(',');
        const records = [];
        for (let i = 1; i < lines.length; i += 1) {
          const line = lines[i].trim();
          if (!line) {
            continue;
          }

          const values = line.split(',');
          const obj = {};
          for (let j = 0; j < headers.length; j += 1) {
            const header = headers[j].trim();
            obj[header] = values[j] ? values[j].trim() : '';
          }
          records.push(obj);
        }
        return records;
      } else if (parsedFormat === 'json') {
        return content ? JSON.parse(content) : [];
      } else if (parsedFormat === 'jsonl') {
        const lines = content.split('\n');
        const results = [];
        for (let i = 0; i < lines.length; i += 1) {
          const line = lines[i].trim();
          if (!line) {
            continue;
          }
          results.push(JSON.parse(line));
        }
        return results;
      }

      return content;
    } catch (error) {
      if (parsedFormat === 'json' || parsedFormat === 'jsonl' || parsedFormat === 'csv') {
        return [];
      }
      return null;
    }
  }

  async writeFile(filePath, data, format) {
    return this.createFile(filePath, data, format);
  }

  async appendToFile(filePath, content, encoding) {
    let resolvedEncoding = encoding;
    if (!resolvedEncoding) {
      resolvedEncoding = 'utf8';
    }
    const dirPath = this.path.dirname(filePath);
    await this.fs.mkdir(dirPath, { recursive: true });
    await this.fs.appendFile(filePath, content, resolvedEncoding);
  }

  async copyFile(source, destination, mode) {
    const destDir = this.path.dirname(destination);
    await this.fs.mkdir(destDir, { recursive: true });
    if (typeof mode === 'number') {
      await this.fs.copyFile(source, destination, mode);
    } else {
      await this.fs.copyFile(source, destination);
    }
  }

  async move(source, destination) {
    const destDir = this.path.dirname(destination);
    await this.fs.mkdir(destDir, { recursive: true });
    await this.fs.rename(source, destination);
  }

  async renameItem(source, destination) {
    await this.move(source, destination);
  }

  async clearDirectory(dirPath) {
    const entries = await this.fs.readdir(dirPath);
    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      const targetPath = this.path.join(dirPath, entry);
      const stats = await this.fs.stat(targetPath);
      if (stats.isDirectory()) {
        await this.fs.rm(targetPath, { recursive: true, force: true });
      } else {
        await this.fs.rm(targetPath, { force: true });
      }
    }
  }

  async mkdir(dirPath, options = { recursive: true }) {
    try {
      await this.fs.mkdir(dirPath, options);
    } catch (error) {
      console.error(`Error creating directory at ${dirPath}:`, error);
      throw error;
    }
  }

  async readdir(dirPath) {
    try {
      return await this.fs.readdir(dirPath);
    } catch (error) {
      console.error(`Error reading directory at ${dirPath}:`, error);
      throw error;
    }
  }

  async stat(itemPath) {
    try {
      return await this.fs.stat(itemPath);
    } catch (error) {
      console.error(`Error getting stats for ${itemPath}:`, error);
      throw error;
    }
  }

  async rm(filePath) {
    try {
      await this.fs.rm(filePath);
    } catch (error) {
      console.error(`Error deleting file at ${filePath}:`, error);
      throw error;
    }
  }

  async rmdir(dirPath, options = { recursive: true }) {
    try {
      await this.fs.rm(dirPath, options);
    } catch (error) {
      console.error(`Error deleting directory at ${dirPath}:`, error);
      throw error;
    }
  }
}

export {
  ActionFs,
  ACTIONFS_METHODS,
  DATASET_ACTIONFS_METHODS_IMPLEMENTED,
  DATASET_ACTIONFS_METHODS_TESTED,
  DATASET_ACTIONFS_METHODS_PROPOSED,
  DATASET_ACTIONFS_METHODS_ROADMAP
};

/*
Test Cases v1.0.5:
  - Runner: ../inprogress/test/dot-actionFS-test-v1.0.5-inprogress-KW-wonderAgent.js
  - Evidence: ../inprogress/test/dot-actionFS-test-v1.0.5-inprogress-KW-wonderAgent-test-evidence.txt
  - Report: ../inprogress/test/dot-actionFS-test-v1.0.5-inprogress-KW-wonderAgent-test-report.md
  - Covered helpers: 1readConfig, 2fileExists, 3createFile, 4readFile, 5writeFile, 6appendToFile, 
    7copyFile, 8move, 9renameItem, 10clearDirectory, 11mkdir, 12readdir, 13stat, 14rm, 15rmdir
  - Workflow: create config/data files, validate readFile/writeFile payloads, append JSONL entry, 
    copy/move/rename/move removals, directory clearing, mkdir/readdir/stat verification, and rm/rmdir cleanup.
  - Outcome: script completes with exit code 0 and logs “ActionFs test v1.0.5: all helpers verified”.
*/
