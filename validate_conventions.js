#!/usr/bin/env node

/**
 * Validator for dot project conventions
 * Run: node validate_conventions.js [folder]
 * Default: validates current directory
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { execSync } from 'child_process';

const folder = process.argv[2] || '.';
const violations = [];

function checkNaming(filePath, content) {
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        // N1: No camelCase or PascalCase
        if (/[a-z][A-Z]/.test(line) && !line.includes('//')) {
            violations.push({
                file: filePath,
                line: i + 1,
                rule: 'N1',
                message: 'camelCase or PascalCase detected',
                level: 'Error'
            });
        }
        
        // N2: No duplicate names (simple check)
        if (line.includes('const ')) {
            const match = line.match(/const\s+(\w+)/);
            if (match) {
                const name = match[1];
                if (lines.filter(l => l.includes(`const ${name}`)).length > 1) {
                    violations.push({
                        file: filePath,
                        line: i + 1,
                        rule: 'N2',
                        message: `Duplicate name: ${name}`,
                        level: 'Error'
                    });
                }
            }
        }
    });
}

function checkCoding(filePath, content) {
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        // C2: No forEach
        if (line.includes('.forEach')) {
            violations.push({
                file: filePath,
                line: i + 1,
                rule: 'C2',
                message: 'forEach detected',
                level: 'Error'
            });
        }
        
        // C3: No arrow functions
        if (line.includes('=>')) {
            violations.push({
                file: filePath,
                line: i + 1,
                rule: 'C3',
                message: 'Arrow function detected',
                level: 'Error'
            });
        }
        
        // C5: No require
        if (line.includes('require(')) {
            violations.push({
                file: filePath,
                line: i + 1,
                rule: 'C5',
                message: 'require() detected',
                level: 'Error'
            });
        }
    });
}

function checkFileStructure(filePath) {
    const fileName = basename(filePath);
    const dir = filePath.split('/').slice(0, -1).join('/');
    
    // F1: Code should be in code/
    if (extname(filePath) === '.js' && !dir.includes('code')) {
        violations.push({
            file: filePath,
            line: 0,
            rule: 'F1',
            message: 'JS file not in code/ folder',
            level: 'Error'
        });
    }
    
    // F9: No generic names
    if (fileName === 'README.md' || fileName === 'CHANGELOG.md') {
        violations.push({
            file: filePath,
            line: 0,
            rule: 'F9',
            message: 'Generic filename detected',
            level: 'Error'
        });
    }
}

function checkDataset(filePath, content) {
    if (!filePath.endsWith('.dataset')) return;
    
    const lines = content.split('\n');
    let hasTypeNames = false;
    
    lines.forEach((line, i) => {
        // D3: Must have type_names
        if (line.includes('type_names')) {
            hasTypeNames = true;
        }
        
        // D1: No objects in datasets
        if (line.includes('{') && !line.includes('//')) {
            violations.push({
                file: filePath,
                line: i + 1,
                rule: 'D1',
                message: 'Object detected in dataset',
                level: 'Error'
            });
        }
    });
    
    if (!hasTypeNames) {
        violations.push({
            file: filePath,
            line: 0,
            rule: 'D3',
            message: 'Missing type_names array',
            level: 'Error'
        });
    }
}

function checkUI(filePath, content) {
    if (!filePath.endsWith('.html') && !filePath.endsWith('.css')) return;
    
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        // U3: No static values in CSS
        if (filePath.endsWith('.css') && /\d+px/.test(line)) {
            violations.push({
                file: filePath,
                line: i + 1,
                rule: 'U3',
                message: 'Static pixel value detected',
                level: 'Error'
            });
        }
        
        // U5: No div or span
        if (filePath.endsWith('.html') && (line.includes('<div') || line.includes('<span'))) {
            violations.push({
                file: filePath,
                line: i + 1,
                rule: 'U5',
                message: 'Non-semantic tag detected',
                level: 'Error'
            });
        }
    });
}

function processDirectory(dir) {
    const files = readdirSync(dir);
    
    files.forEach(file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            processDirectory(filePath);
        } else if (stat.isFile()) {
            const content = readFileSync(filePath, 'utf8');
            
            checkNaming(filePath, content);
            checkCoding(filePath, content);
            checkFileStructure(filePath);
            checkDataset(filePath, content);
            checkUI(filePath, content);
        }
    });
}

// Run validation
console.log(`Validating conventions in: ${folder}`);
processDirectory(folder);

// Report results
if (violations.length === 0) {
    console.log('✅ No violations found');
} else {
    console.log(`\n❌ Found ${violations.length} violations:\n`);
    
    const errors = violations.filter(v => v.level === 'Error');
    const warnings = violations.filter(v => v.level === 'Warning');
    
    if (errors.length > 0) {
        console.log(`\n🚨 ERRORS (${errors.length}):`);
        errors.forEach(v => {
            console.log(`  ${v.file}:${v.line} [${v.rule}] ${v.message}`);
        });
    }
    
    if (warnings.length > 0) {
        console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
        warnings.forEach(v => {
            console.log(`  ${v.file}:${v.line} [${v.rule}] ${v.message}`);
        });
    }
    
    process.exit(1);
}
