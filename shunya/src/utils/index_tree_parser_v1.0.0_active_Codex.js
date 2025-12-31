/**
 * metadata:
 * version: 1.0.0
 * status: active
 * agent: Codex
 *
 * Utility for parsing the ERMS index into a JSON tree.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const INDENT_WIDTH = 4;

class IndexTreeParser {
  constructor(content) {
    this.content = content;
  }

  parse() {
    var lines = this.content.split(/\r?\n/);
    var filtered = [];
    for (var i = 0; i < lines.length; i += 1) {
      var candidate = lines[i];
      if (candidate && candidate.trim().length > 0) {
        filtered.push(candidate);
      }
    }
    var root = { depth: -1, children: [] };
    var stack = [root];

    for (var j = 0; j < filtered.length; j += 1) {
      var line = filtered[j];
      var indentMatch = line.match(/^\s*/);
      var indent = indentMatch ? indentMatch[0].length : 0;
      var depth = Math.floor(indent / INDENT_WIDTH);
      var name = line.replace(/^\s*-\s*/, '').trim();
      var node = { name: name };

      while (stack.length && stack[stack.length - 1].depth >= depth) {
        stack.pop();
      }

      var parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
      var entry = { name: node.name, depth: depth };
      stack.push(entry);
    }

    return root.children;
  }

  static writeFile(inputPath, outputPath) {
    const source = fs.readFileSync(inputPath, 'utf8');
    const parser = new IndexTreeParser(source);
    const tree = parser.parse();
    fs.writeFileSync(outputPath, JSON.stringify(tree, null, 2));
    console.log('Index parsed to ' + outputPath);
    return tree;
  }
}

export default IndexTreeParser;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  var inputArg = process.argv[2];
  var outputArg = process.argv[3];
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const inputPath = inputArg || path.join(__dirname, '..', '..', 'index', 'index_pages_erms.txt');
  const outputPath = outputArg || path.join(__dirname, '..', '..', 'index', 'index_pages_erms.json');
  IndexTreeParser.writeFile(inputPath, outputPath);
}
