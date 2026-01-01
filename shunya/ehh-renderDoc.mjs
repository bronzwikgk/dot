#!/usr/bin/env node
/*
Overview: Document renderer merges the indexed ehh datasets into a unified project doc.
Purpose: Provide a single Markdown artifact that reflects the topics, datasets, and descriptions defined in the index.
Audience: Project authors, reviewers, and automation workflows consuming the datasets.
Problem Addressed: Removes the manual effort of stitching the index and dataset arrays together.
Use Cases: Automated doc generation, release notes, onboarding references.
Features: Parses the index, loads dataset arrays, and produces ordered sections with bulletized entries.
Benefits: Ensures the rendered document always mirrors the canonical datasets.
User Stories: "As a reviewer, I want one doc that lists every dataset entry and its context."
User Flow: Read index -> gather dataset arrays -> format Markdown -> write output.
System Components: DocumentRenderer class, index parser, dataset loader, Markdown formatter.
Edge Cases: Missing dataset files, malformed arrays, or empty descriptions are handled gracefully.
Test Cases: Running the renderer should produce a file with sections for each index entry and dataset bullets.
Configuration: Uses indexPath, datasetDir, and outputPath parameters for flexibility.
Schema: { entries: Array<{order, title, constName, file, description, items: string[]}> }
*/
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

class DocumentRenderer {
  constructor(options) {
    this.indexPath = options.indexPath;
    this.datasetDir = options.datasetDir;
    this.outputPath = options.outputPath;
  }

  async render() {
    const entries = await this.parseIndex();
    const sections = [];
    for (const entry of entries) {
      const items = await this.loadDataset(entry.file);
      sections.push({ ...entry, items });
    }
    const doc = this.formatDoc(sections);
    await this.writeOutput(doc);
    console.log(`Rendered document saved to ${this.outputPath}`);
  }

  async parseIndex() {
    const contents = await readFile(this.indexPath, 'utf-8');
    const lines = contents.split(/\r?\n/);
    const entries = [];
    let current = null;
    for (const line of lines) {
      const entryMatch = line.match(/^\s*(\d+)\.\s+\*\*([^*]+)\*\*\s+\(([^)]+)\)\s+[\u2013\u2014-]\s+(.+)$/);
      if (entryMatch) {
        current = {
          order: Number(entryMatch[1]),
          title: entryMatch[2].trim(),
          constName: entryMatch[3].trim(),
          description: entryMatch[4].trim(),
          file: ''
        };
        entries.push(current);
        continue;
      }
      if (current) {
        const fileMatch = line.match(/^\s*-\s+File:\s+`([^`]+)`/);
        if (fileMatch) {
          current.file = fileMatch[1];
          continue;
        }
        const descMatch = line.match(/^\s*-\s+Description:\s+(.+)/);
        if (descMatch) {
          current.description = descMatch[1].trim();
        }
      }
    }
    return entries.filter(entry => entry.file);
  }

  async loadDataset(filePath) {
    try {
      const fullPath = join(this.datasetDir, filePath.split('/').pop());
      const contents = await readFile(fullPath, 'utf-8');
      const arrayMatch = contents.match(/const\s+([A-Za-z0-9_]+)\s+=\s+\[([\s\S]*?)\];/);
      if (!arrayMatch) {
        return [];
      }
      const rows = arrayMatch[2]
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.startsWith('"'))
        .map(line => line.replace(/^"/, '').replace(/",?$/, ''));
      return rows;
    } catch (error) {
      console.warn(`Unable to load dataset ${filePath}: ${error.message}`);
      return [];
    }
  }

  formatDoc(sections) {
    const header = ['# EHH Unified Documentation', '', `Generated from ${this.indexPath}`, ''];
    const body = sections.map(entry => {
      const lines = [];
      lines.push(`## ${entry.order}. ${entry.title}`);
      lines.push(`**Dataset**: ${entry.constName}`);
      lines.push(`**File**: ${entry.file}`);
      if (entry.description) {
        lines.push(`**Description**: ${entry.description}`);
      }
      if (entry.items.length) {
        lines.push('');
        lines.push(...entry.items.map(item => `- ${item}`));
      } else {
        lines.push('');
        lines.push('- (no entries)');
      }
      lines.push('');
      return lines.join('\n');
    });
    return header.concat(body).join('\n');
  }

  async writeOutput(content) {
    await writeFile(this.outputPath, content, 'utf-8');
  }
}

const renderer = new DocumentRenderer({
  indexPath: join('shunya', 'dataset_shunya', 'dataset_shunya_ehh', 'projectname-v1.1.0-active-KW-wonderAgent-index.md'),
  datasetDir: join('shunya', 'dataset_shunya', 'dataset_shunya_ehh'),
  outputPath: join('shunya', 'ehh-unified-doc.md')
});

renderer.render().catch(error => {
  console.error('Rendering failed:', error);
  process.exit(1);
});
