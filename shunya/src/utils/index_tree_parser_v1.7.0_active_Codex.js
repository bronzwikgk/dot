/**
 * metadata:
 * version: 1.7.0
 * status: active
 * agent: Codex
 *
 * Overview: Project utility parsing hierarchical index documents into structured JSON trees for entity CRUD planning.
 * Purpose: Keep index parsing logic transparent and easy to extend through descriptive metadata.
 * Audience: Engineers adapting index trees for documentation, UI, or data pipelines.
 * Problem Addressed: Ambiguity around configuration, schema usage, invocation defaults, and multi-output expectations.
 * Use Cases: Translating hierarchical outlines into JSON, TXT, or XML via schema-driven mappings, and running CLI exports.
 * Features: Constructor/method pattern, schema-aware transformation, XML serializer/deserializer, TXT serializer, CLI entry, and actionFS-backed I/O.
 * Benefits: Reliable, schema-compliant outputs with consistent file handling and flexible output-type declarations.
 * User Stories: As a contributor, I can describe exactly which output formats I need using key:value pairs and receive all files in one run.
 * User Flow: Review metadata/config guidance, inspect parsing steps, provide a format map, and launch CLI/export.
 * System Components: Parser class, schema normalizer, XML helpers, TXT serializer, actionFS wrapper, and CLI runner.
 * Edge Cases: Missing children, malformed schema files, non-XML tokens, inputs lacking “index,” or invalid format keys.
 * Test Cases: Execute CLI with format maps that emit JSON, XML, and TXT outputs, plus XML→JSON back-translation.
 * Configuration:
 *   - INDENT_WIDTH: 4 spaces per level
 *   - CLI defaults: `index_pages_erms.txt` -> `index_pages_erms_v1.7.0.json`
 * Schema:
 *   - Refer to `Inprogress/index/index_schema_template_v1.json`
 * Roadmap:
 *   - Expand parser adapters for Markdown, YAML, and XML outlines so structured data from additional formats can generate the same schema-defined trees.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { actionFS } from './actionFS.js';

var INDENT_WIDTH = 4;

class IndexTreeParser {
  constructor(content) {
    this.content = content || '';
  }

  parse(options) {
    var tree = this.buildTree();
    if (options && options.schema) {
      return this.applySchema(tree, options.schema);
    }
    return tree;
  }

  buildTree() {
    var lines = this.content.split(/\r?\n/);
    var filtered = [];
    for (var i = 0; i < lines.length; i += 1) {
      var candidate = lines[i];
      if (candidate && candidate.trim().length > 0) {
        filtered.push(candidate);
      }
    }

    var rootEntry = { node: { children: [] }, depth: -1 };
    var stack = [rootEntry];

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

      var parentEntry = stack[stack.length - 1];
      if (!parentEntry.node.children) {
        parentEntry.node.children = [];
      }
      parentEntry.node.children.push(node);
      stack.push({ node: node, depth: depth });
    }

    return rootEntry.node.children;
  }

  applySchema(tree, schemaDefinition) {
    var normalized = this.normalizeSchema(schemaDefinition);
    return this.transformChildren(tree, normalized);
  }

  normalizeSchema(schemaDefinition) {
    var normalized = {};
    var keys = Object.keys(schemaDefinition);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var blueprint = schemaDefinition[key];
      if (!blueprint) {
        continue;
      }

      var entry = null;
      if (typeof blueprint === 'string') {
        entry = { source: blueprint };
      } else if (typeof blueprint === 'object') {
        entry = {};
        entry.source = blueprint.source || 'name';
        if (blueprint.schema && typeof blueprint.schema === 'object') {
          entry.schema = this.normalizeSchema(blueprint.schema);
        }
        if (blueprint.value !== undefined) {
          entry.value = blueprint.value;
        }
      } else {
        continue;
      }

      normalized[key] = entry;
    }
    return normalized;
  }

  transformChildren(children, schemaDefinition) {
    var results = [];
    for (var i = 0; i < children.length; i += 1) {
      results.push(this.transformNode(children[i], schemaDefinition));
    }
    return results;
  }

  transformNode(node, schemaDefinition) {
    var mapped = {};
    var keys = Object.keys(schemaDefinition);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var blueprint = schemaDefinition[key];
      if (!blueprint || !blueprint.source) {
        continue;
      }

      var source = blueprint.source;
      if (source === 'name') {
        mapped[key] = node.name;
      } else if (source === 'children') {
        var childSchema = blueprint.schema || schemaDefinition;
        var childNodes = node.children || [];
        mapped[key] = this.transformChildren(childNodes, childSchema);
      } else if (source === 'const') {
        mapped[key] = blueprint.value;
      } else {
        mapped[key] = null;
      }
    }
    return mapped;
  }

  static ensureIndexFile(filePath) {
    if (!filePath.toLowerCase().includes('index')) {
      throw new Error('IndexTreeParser works only on files whose names contain "index".');
    }
  }

  static async loadSchema(schemaPath) {
    if (!schemaPath) {
      return null;
    }
    var raw = await actionFS.readFile(schemaPath, 'utf8');
    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      throw new Error('Schema file is not valid JSON: ' + parseError.message);
    }
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Schema must be an object.');
    }
    return parsed;
  }

  static treeToXml(nodes, xmlOptions) {
    var labelKey = 'name';
    if (xmlOptions && xmlOptions.labelKey) {
      labelKey = xmlOptions.labelKey;
    }
    var childrenKey = 'children';
    if (xmlOptions && xmlOptions.childrenKey) {
      childrenKey = xmlOptions.childrenKey;
    }
    var lines = [];
    lines.push('<ul>');
    IndexTreeParser.buildXmlNodes(nodes, 2, labelKey, childrenKey, lines);
    lines.push('</ul>');
    return lines.join('\n');
  }

  static xmlToTree(xmlContent) {
    var tokens = IndexTreeParser.tokenizeXml(xmlContent);
    var root = { children: [] };
    var stack = [root];
    for (var i = 0; i < tokens.length; i += 1) {
      var raw = tokens[i];
      if (!raw) {
        continue;
      }
      var trimmed = raw.trim();
      if (trimmed.length === 0) {
        continue;
      }
      if (trimmed.indexOf('<li') === 0) {
        var node = { name: '', children: [] };
        var parent = stack[stack.length - 1];
        parent.children.push(node);
        stack.push(node);
      } else if (trimmed.indexOf('</li') === 0) {
        if (stack.length > 1) {
          stack.pop();
        }
      } else if (trimmed.indexOf('<ul') === 0 || trimmed.indexOf('</ul') === 0) {
        continue;
      } else if (trimmed.indexOf('<') === 0) {
        continue;
      } else {
        var current = stack[stack.length - 1];
        if (current && current.name.length === 0) {
          current.name = IndexTreeParser.decodeXmlEntities(trimmed);
        }
      }
    }
    return root.children;
  }

  static tokenizeXml(xmlContent) {
    var tokens = [];
    var pattern = /<[^>]+>|[^<]+/g;
    var match = pattern.exec(xmlContent);
    while (match !== null) {
      tokens.push(match[0]);
      match = pattern.exec(xmlContent);
    }
    return tokens;
  }

  static buildXmlNodes(nodes, indent, labelKey, childrenKey, lines) {
    for (var i = 0; i < nodes.length; i += 1) {
      var entry = nodes[i];
      var label = '';
      if (entry && entry[labelKey]) {
        label = entry[labelKey];
      }
      var encoded = IndexTreeParser.encodeXmlEntities(label);
      var childNodes = [];
      if (entry && entry[childrenKey]) {
        childNodes = entry[childrenKey];
      }
      if (childNodes && childNodes.length > 0) {
        lines.push(IndexTreeParser.indent(indent) + '<li>' + encoded);
        lines.push(IndexTreeParser.indent(indent + 2) + '<ul>');
        IndexTreeParser.buildXmlNodes(childNodes, indent + 4, labelKey, childrenKey, lines);
        lines.push(IndexTreeParser.indent(indent + 2) + '</ul>');
        lines.push(IndexTreeParser.indent(indent) + '</li>');
      } else {
        lines.push(IndexTreeParser.indent(indent) + '<li>' + encoded + '</li>');
      }
    }
  }

  static indent(count) {
    var buffer = [];
    for (var i = 0; i < count; i += 1) {
      buffer.push(' ');
    }
    return buffer.join('');
  }

  static encodeXmlEntities(value) {
    var text = '';
    if (value) {
      text = value.toString();
    }
    var encoded = text.replace(/&/g, '&amp;');
    encoded = encoded.replace(/</g, '&lt;');
    encoded = encoded.replace(/>/g, '&gt;');
    return encoded;
  }

  static decodeXmlEntities(value) {
    var text = '';
    if (value) {
      text = value.toString();
    }
    var decoded = text.replace(/&lt;/g, '<');
    decoded = decoded.replace(/&gt;/g, '>');
    decoded = decoded.replace(/&amp;/g, '&');
    return decoded;
  }

  static isXmlFile(filePath) {
    var extension = path.extname(filePath).toLowerCase();
    return extension === '.xml';
  }

  static parseFormatsArgument(formatsArg, defaultPath) {
    var map = {};
    if (!formatsArg || formatsArg.trim().length === 0) {
      map.json = defaultPath;
      return map;
    }
    var entries = formatsArg.split(',');
    for (var i = 0; i < entries.length; i += 1) {
      var fragment = entries[i].trim();
      if (!fragment) {
        continue;
      }
      var separator = null;
      if (fragment.indexOf(':') !== -1) {
        separator = ':';
      } else if (fragment.indexOf('=') !== -1) {
        separator = '=';
      }
      if (separator) {
        var parts = fragment.split(separator);
        var key = parts[0].trim().toLowerCase();
        var value = parts.slice(1).join(separator).trim();
        if (key && value) {
          map[key] = value;
        }
      } else {
        var lower = fragment.toLowerCase();
        map[lower] = defaultPath;
      }
    }
    if (Object.keys(map).length === 0) {
      map.json = defaultPath;
    }
    return map;
  }

  static treeToText(nodes, depth) {
    var lines = IndexTreeParser.treeToTextLines(nodes, depth);
    return lines.join('\n');
  }

  static treeToTextLines(nodes, depth) {
    if (!depth && depth !== 0) {
      depth = 0;
    }
    var lines = [];
    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      if (!node) {
        continue;
      }
      var indentation = IndexTreeParser.indent(depth);
      var label = node.name || '';
      lines.push(indentation + '- ' + label);
      if (node.children && node.children.length > 0) {
        var childLines = IndexTreeParser.treeToTextLines(node.children, depth + 2);
        lines = lines.concat(childLines);
      }
    }
    return lines;
  }

  static async writeFormatOutput(tree, formatKey, outputPath, xmlOptions) {
    var normalizedKey = formatKey.toLowerCase();
    if (normalizedKey === 'json') {
      await actionFS.writeFile(outputPath, JSON.stringify(tree, null, 2), 'utf8');
    } else if (normalizedKey === 'xml') {
      var xmlContent = IndexTreeParser.treeToXml(tree, xmlOptions);
      await actionFS.writeFile(outputPath, xmlContent, 'utf8');
    } else if (normalizedKey === 'txt' || normalizedKey === 'text') {
      var textContent = IndexTreeParser.treeToText(tree, 0);
      await actionFS.writeFile(outputPath, textContent, 'utf8');
    } else {
      throw new Error('Unsupported format key: ' + formatKey);
    }
  }

  static async writeFile(inputPath, outputPath, schemaPath, formatsArg, xmlLabelKey, xmlChildrenKey) {
    IndexTreeParser.ensureIndexFile(inputPath);
    var source = await actionFS.readFile(inputPath, 'utf8');
    var schema = await IndexTreeParser.loadSchema(schemaPath);
    var tree = null;
    var isXmlInput = IndexTreeParser.isXmlFile(inputPath);
    if (isXmlInput) {
      tree = IndexTreeParser.xmlToTree(source);
      if (schema) {
        var helper = new IndexTreeParser('');
        tree = helper.applySchema(tree, schema);
      }
    } else {
      var parser = new IndexTreeParser(source);
      tree = parser.parse({ schema: schema });
    }

    var formatTargets = IndexTreeParser.parseFormatsArgument(formatsArg, outputPath);
    var xmlOptions = { labelKey: xmlLabelKey, childrenKey: xmlChildrenKey };
    var keys = Object.keys(formatTargets);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var targetPath = formatTargets[key];
      await IndexTreeParser.writeFormatOutput(tree, key, targetPath, xmlOptions);
    }
    console.log('Index parsed to formats: ' + keys.join(', '));
    return tree;
  }
}

export default IndexTreeParser;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  var inputArg = process.argv[2];
  var outputArg = process.argv[3];
  var schemaArg = process.argv[4];
  var formatsArg = process.argv[5];
  var xmlLabelArg = process.argv[6];
  var xmlChildrenArg = process.argv[7];
  var __dirname = path.dirname(fileURLToPath(import.meta.url));
  var inputPath = inputArg || path.join(__dirname, '..', '..', 'index', 'index_pages_erms.txt');
  var outputPath = outputArg || path.join(__dirname, '..', '..', 'index', 'index_pages_erms_v1.7.0.json');
  (async function run() {
    await IndexTreeParser.writeFile(inputPath, outputPath, schemaArg, formatsArg, xmlLabelArg, xmlChildrenArg);
  })().catch(function (error) {
    console.error(error);
    process.exit(1);
  });
}
