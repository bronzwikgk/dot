/**
 * @entity code_inspector_utility
 * @meta project: shared_v2 | file_name: shared_v2/code/utilities/code_shared_code_inspector_v2_2_0_draft.js | version: 2.2.0 | status: draft | author: ox-alpha
 * @objective statically inspect javascript source text and inventory every declared function with parameters, source slice, jsdoc block and structural traits.
 * @purpose_and_problem_statement test generation needs a trusted map of what a file declares; executing unknown code is unsafe so the map is built by reading text only.
 * @usage const inventory = inspect_source_auto(source_text);
 * @timing first stage of the validate and test pipeline before signature inference.
 * @scope_boundaries in_scope: acorn ast parsing when vendored or installed covering all modern syntax, line-oriented fallback parser for convention formatted sources, classes, factories, module exports, esm exports, jsdoc capture. out_of_scope: typescript syntax, jsx, execution of the inspected code.
 * @dependencies optional: vendor/acorn.js or npm acorn (falls back to legacy line parser).
 * @keywords inspect, parse, ast, functions, static analysis, inventory
 * @invariants every function declaration and class method appears in the inventory; auto backend output shape is identical across backends; the inspected source is never evaluated.
 * @changelog - 2026-08-24: 2.2.0: initial draft
 * @changelog - 2026-08-24: 2.2.0: added acorn backed inspect_source_ast and inspect_source_auto with identical inventory shape
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_utility_code_inspector = api;
})(typeof self !== "undefined" ? self : globalThis, function () {

  var METHOD_KEYWORDS = "if for while switch catch function return".split(" ");

  function count_char(text, ch) {
    var total = 0;
    for (var i = 0; i < text.length; i++) {
      if (text[i] === ch) total += 1;
    }
    return total;
  }

  function line_depths(lines) {
    var depths = [];
    var depth = 0;
    for (var i = 0; i < lines.length; i++) {
      depths.push(depth);
      depth += count_char(lines[i], "{") - count_char(lines[i], "}");
    }
    return depths;
  }

  function split_top_level(text, separator) {
    var parts = [];
    var current = "";
    var depth = 0;
    var quote = null;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (quote) {
        current += ch;
        if (ch === quote && text[i - 1] !== "\\") quote = null;
        continue;
      }
      if (ch === "\"" || ch === "'" || ch === "`") {
        quote = ch;
        current += ch;
        continue;
      }
      if (ch === "(" || ch === "[" || ch === "{") depth += 1;
      if (ch === ")" || ch === "]" || ch === "}") depth -= 1;
      if (ch === separator && depth === 0) {
        parts.push(current);
        current = "";
        continue;
      }
      current += ch;
    }
    if (current.trim() !== "") parts.push(current);
    return parts.map(function (p) { return p.trim(); }).filter(function (p) { return p !== ""; });
  }

  function parse_params(param_text) {
    if (!param_text || param_text.trim() === "") return [];
    return split_top_level(param_text, ",").map(function (part) {
      var rest = part.indexOf("...") === 0;
      var body = rest ? part.slice(3) : part;
      var eq = split_top_level(body, "=");
      return {
        name: eq[0].trim(),
        has_default: eq.length > 1,
        default_literal: eq.length > 1 ? eq.slice(1).join("=").trim() : null,
        rest: rest
      };
    });
  }

  function find_slice_end(lines, start_line) {
    var depth = 0;
    for (var i = start_line; i < lines.length; i++) {
      depth += count_char(lines[i], "{") - count_char(lines[i], "}");
      if (i === start_line && depth <= 0 && lines[i].indexOf("{") !== -1) return i;
      if (i > start_line && depth <= 0) return i;
    }
    return lines.length - 1;
  }

  function capture_jsdoc(lines, decl_line) {
    var collected = [];
    var i = decl_line - 1;
    while (i >= 0) {
      var trimmed = lines[i].trim();
      if (trimmed === "") return "";
      if (trimmed.indexOf("*/") === trimmed.length - 2 || trimmed === "*/") {
        var j = i;
        while (j >= 0) {
          collected.unshift(lines[j]);
          if (lines[j].trim().indexOf("/**") === 0) return collected.join("\n");
          j -= 1;
        }
        return "";
      }
      return "";
    }
    return "";
  }

  function compute_traits(name, source, depth_at_decl) {
    var body_after_first_line = source.split("\n").slice(1).join("\n");
    return {
      has_conditionals: /\bif\s*\(/.test(source),
      has_loops: /\b(for|while)\s*\(/.test(source),
      has_throws: /\bthrow\b/.test(source),
      is_recursive: new RegExp("\\b" + name + "\\s*\\(").test(body_after_first_line),
      is_async: /\basync\b/.test(source.split("\n")[0]),
      maybe_nondeterministic: /\b(Date\.now|Math\.random|performance\.now)\b|\bnew\s+Date\b/.test(source),
      uses_this: /\bthis\s*\./.test(source),
      declared_at_module_depth: depth_at_decl === 0
    };
  }

  function detect_class_exports(lines) {
    for (var i = 0; i < lines.length; i++) {
      var match = lines[i].match(/^\s*module\.exports\s*=\s*([A-Za-z_$][\w$]*)\s*;?\s*$/);
      if (match) return match[1];
    }
    return null;
  }

  function detect_factory_return_names(lines) {
    var joined = lines.join("\n");
    if (joined.indexOf("(function (root, factory)") === -1 && joined.indexOf("function (root, factory)") === -1) return [];
    var match;
    var pattern = /return\s*\{([^{}]*)\}\s*;/g;
    var last = null;
    while ((match = pattern.exec(joined)) !== null) last = match;
    if (!last) return [];
    return last[1].split(",").map(function (piece) {
      return piece.trim().split(":")[0].trim();
    }).filter(function (piece) {
      return /^[A-Za-z_$][\w$]*$/.test(piece);
    });
  }

  function inspect_source(source_text) {
    var lines = source_text.split("\n");
    var depths = line_depths(lines);
    var functions = [];
    var classes = [];

    var class_ranges = [];
    var exported_classes = [];
    for (var i = 0; i < lines.length; i++) {
      var class_match = lines[i].match(/^\s*((?:export\s+default\s+|export\s+)?)class\s+([A-Za-z_$][\w$]*)/);
      if (class_match && depths[i] === 0) {
        var end = find_slice_end(lines, i);
        class_ranges.push({ name: class_match[2], start: i, end: end });
        classes.push(class_match[2]);
        if (class_match[1]) exported_classes.push(class_match[2]);
      }
    }

    function inside_class(line_index) {
      for (var c = 0; c < class_ranges.length; c++) {
        if (line_index > class_ranges[c].start && line_index < class_ranges[c].end) {
          return class_ranges[c].name;
        }
      }
      return null;
    }

    for (var i = 0; i < lines.length; i++) {
      var container = inside_class(i);
      var fn_match = lines[i].match(/^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{?/);
      var method_match = null;
      if (container) {
        method_match = lines[i].match(/^(\s+)(?:static\s+)?(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/);
      }

      if (fn_match && !container) {
        var name = fn_match[1];
        var decl_depth = depths[i];
        var end_line = find_slice_end(lines, i);
        var source = lines.slice(i, end_line + 1).join("\n");
        functions.push({
          name: name,
          container: "module",
          kind: "function",
          params: parse_params(fn_match[2] || ""),
          jsdoc: capture_jsdoc(lines, i),
          source: source,
          start_line: i + 1,
          end_line: end_line + 1,
          traits: compute_traits(name, source, decl_depth)
        });
      } else if (method_match && METHOD_KEYWORDS.indexOf(method_match[2]) === -1) {
        var m_name = method_match[2];
        var m_end = find_slice_end(lines, i);
        var m_source = lines.slice(i, m_end + 1).join("\n");
        functions.push({
          name: m_name,
          container: container,
          kind: m_name === "constructor" ? "constructor" : "method",
          params: parse_params(method_match[3] || ""),
          jsdoc: capture_jsdoc(lines, i),
          source: m_source,
          start_line: i + 1,
          end_line: m_end + 1,
          traits: compute_traits(m_name, m_source, depths[i])
        });
      }
    }

    var export_class = detect_class_exports(lines);
    var factory_names = detect_factory_return_names(lines);
    var direct_object_match = source_text.match(/module\.exports\s*=\s*\{([^}]*)\}/);

    var export_style = "unknown";
    var exported_names = [];
    if (!export_class && exported_classes.length > 0) export_class = exported_classes[0];
    if (export_class) {
      export_style = "class";
      exported_names = functions.filter(function (f) {
        return f.container === export_class && f.kind === "method" && f.name.indexOf("_") !== 0;
      }).map(function (f) { return f.name; });
    } else if (factory_names.length > 0) {
      export_style = "named_object";
      exported_names = factory_names;
    } else if (direct_object_match) {
      export_style = "named_object";
      exported_names = factory_names.length > 0 ? factory_names : split_top_level(direct_object_match[1], ",").map(function (p) {
        return p.trim().split(":")[0].trim();
      });
    }

    var module_state = false;
    for (var s = 0; s < lines.length; s++) {
      if (/^(let|var)\s+[A-Za-z_$]/.test(lines[s]) && depths[s] === 0) module_state = true;
    }

    return {
      classes: classes,
      export_style: export_style,
      exported_names: exported_names,
      has_module_state: module_state,
      functions: functions
    };
  }

  function load_acorn() {
    if (typeof require === "function") {
      try { return require("./vendor/acorn.js"); } catch (error_vendor) {}
      try { return require("acorn"); } catch (error_npm) {}
    }
    return null;
  }

  function parse_ast(source_text) {
    var acorn = load_acorn();
    if (!acorn) return null;
    var options = { ecmaVersion: "latest", sourceType: "module", allowReturnOutsideFunction: true, onComment: [] };
    var comments = [];
    options.onComment = function (block, text_value, start, end) {
      if (block) comments.push({ start: start, end: end });
    };
    var ast;
    try {
      ast = acorn.parse(source_text, options);
    } catch (error_module) {
      options.sourceType = "script";
      try {
        ast = acorn.parse(source_text, options);
      } catch (error_script) {
        return { error: String(error_module.message || error_module) };
      }
    }
    return { ast: ast, comments: comments, acorn: acorn };
  }

  function walk_nodes(ast) {
    var all = [];
    function visit(node, parent) {
      all.push({ node: node, parent: parent });
      for (var key in node) {
        if (key === "type" || key === "start" || key === "end" || key === "loc" || key === "range") continue;
        var value = node[key];
        if (Array.isArray(value)) {
          for (var i = 0; i < value.length; i++) {
            if (value[i] && typeof value[i].type === "string") visit(value[i], node);
          }
        } else if (value && typeof value === "object" && typeof value.type === "string") {
          visit(value, node);
        }
      }
    }
    visit(ast, null);
    return all;
  }

  function param_record(node, source_text) {
    if (node.type === "Identifier") return { name: node.name, has_default: false, default_literal: null, rest: false };
    if (node.type === "AssignmentPattern") {
      var inner = param_record(node.left, source_text);
      return {
        name: inner.name,
        has_default: true,
        default_literal: source_text.slice(node.right.start, node.right.end),
        rest: false
      };
    }
    if (node.type === "RestElement") {
      var arg = param_record(node.argument, source_text);
      return { name: arg.name, has_default: false, default_literal: null, rest: true };
    }
    return { name: source_text.slice(node.start, node.end), has_default: false, default_literal: null, rest: false };
  }

  function function_label(node, parent) {
    if (node.type === "FunctionDeclaration" && node.id) {
      return { name: node.id.name, kind: "function", explicit: true };
    }
    if (parent && parent.type === "VariableDeclarator" && parent.id.type === "Identifier") {
      return { name: parent.id.name, kind: "function", explicit: true };
    }
    if (parent && parent.type === "Property" && parent.key) {
      return { name: parent.key.name || parent.key.value, kind: "function", explicit: true };
    }
    if (parent && parent.type === "AssignmentExpression" && parent.left.type === "Identifier") {
      return { name: parent.left.name, kind: "function", explicit: true };
    }
    if (parent && parent.type === "MethodDefinition" && parent.key) {
      return { name: parent.key.name || parent.key.value, kind: parent.kind === "constructor" ? "constructor" : "method", explicit: true };
    }
    return null;
  }

  function jsdoc_for(fn_start, comments, source_text) {
    var best = "";
    for (var i = 0; i < comments.length; i++) {
      var comment = comments[i];
      if (comment.end >= fn_start) continue;
      if (source_text.slice(comment.end, fn_start).trim() !== "") continue;
      best = source_text.slice(comment.start, comment.end);
    }
    return best;
  }

  function ast_traits(fn_node, contained) {
    var traits = {
      has_conditionals: false,
      has_loops: false,
      has_throws: false,
      is_recursive: false,
      is_async: !!fn_node.async,
      maybe_nondeterministic: false,
      uses_this: false,
      declared_at_module_depth: false
    };
    var name = fn_node.id ? fn_node.id.name : null;
    for (var i = 0; i < contained.length; i++) {
      var n = contained[i].node;
      var t = n.type;
      if (t === "IfStatement" || t === "ConditionalExpression" || t === "SwitchStatement") traits.has_conditionals = true;
      if (t === "ForStatement" || t === "ForOfStatement" || t === "ForInStatement" || t === "WhileStatement" || t === "DoWhileStatement") traits.has_loops = true;
      if (t === "ThrowStatement") traits.has_throws = true;
      if (t === "ThisExpression") traits.uses_this = true;
      if (name && t === "CallExpression" && n.callee.type === "Identifier" && n.callee.name === name) traits.is_recursive = true;
      if (t === "NewExpression" && n.callee.type === "Identifier" && n.callee.name === "Date") traits.maybe_nondeterministic = true;
      if (t === "MemberExpression" && n.object && n.property) {
        var obj_name = n.object.name;
        var prop_name = n.property.name || n.property.value;
        if (obj_name === "Math" && prop_name === "random") traits.maybe_nondeterministic = true;
        if ((obj_name === "Date" || obj_name === "performance") && prop_name === "now") traits.maybe_nondeterministic = true;
      }
    }
    return traits;
  }

  function inspect_source_ast(source_text) {
    var parsed = parse_ast(source_text);
    if (!parsed || parsed.error) return null;
    var entries = walk_nodes(parsed.ast);

    function contained_in(range_node) {
      return entries.filter(function (e) {
        return e.node.start >= range_node.body.start && e.node.end <= range_node.body.end && e.node !== range_node.body;
      });
    }

    var class_stack = [];
    var functions = [];
    var seen = [];

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var node = entry.node;
      var is_fn = node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression";
      if (!is_fn) {
        if (node.type === "ClassDeclaration" || node.type === "ClassExpression") class_stack.push(node.id ? node.id.name : "(anonymous)");
        continue;
      }

      while (class_stack.length > 1) class_stack.pop();
      var label = function_label(node, entry.parent);
      var inside_class = node.type === "FunctionExpression" && entry.parent && entry.parent.type === "MethodDefinition";
      if (inside_class) {
        var method_key = entry.parent.key.name || entry.parent.key.value;
        var container_name = class_stack[class_stack.length - 1] || "(anonymous)";
        functions.push({
          name: method_key,
          container: container_name,
          kind: entry.parent.kind === "constructor" ? "constructor" : "method",
          params: node.params.map(function (p) { return param_record(p, source_text); }),
          jsdoc: jsdoc_for(node.start, parsed.comments, source_text),
          source: source_text.slice(node.start, node.end),
          start_line: source_text.slice(0, node.start).split("\n").length,
          end_line: source_text.slice(0, node.end).split("\n").length,
          traits: ast_traits(node, contained_in(node))
        });
        seen.push(node);
        continue;
      }

      if (!label) continue;
      var depth_ok = true;
      for (var s = 0; s < seen.length; s++) {
        if (seen[s].start <= node.start && node.end <= seen[s].end) depth_ok = false;
      }
      if (!depth_ok) continue;
      seen.push(node);
      functions.push({
        name: label.name,
        container: find_container(entries, i),
        kind: label.kind,
        params: node.params.map(function (p) { return param_record(p, source_text); }),
        jsdoc: jsdoc_for(node.start, parsed.comments, source_text),
        source: source_text.slice(node.start, node.end),
        start_line: source_text.slice(0, node.start).split("\n").length,
        end_line: source_text.slice(0, node.end).split("\n").length,
        traits: ast_traits(node, contained_in(node))
      });
    }

    var classes = [];
    for (var c = 0; c < entries.length; c++) {
      var cn = entries[c].node;
      if ((cn.type === "ClassDeclaration" || cn.type === "ClassExpression") && cn.id) classes.push(cn.id.name);
    }

    var exports_info = detect_exports_ast(parsed.ast, source_text);
    if (exports_info.export_style === "unknown") {
      var factory_names_fallback = detect_factory_return_names(source_text.split("\n"));
      if (factory_names_fallback.length > 0) {
        exports_info = { export_style: "named_object", names: factory_names_fallback };
      }
    }
    if (exports_info.export_style === "class" && exports_info.names.length === 0) {
      var target_class = exports_info.export_target || (classes.length > 0 ? classes[0] : null);
      if (target_class) {
        exports_info.names = functions.filter(function (f) {
          return f.container === target_class && f.kind === "method" && f.name.indexOf("_") !== 0;
        }).map(function (f) { return f.name; });
      }
    }
    var module_state = false;
    for (var p = 0; p < parsed.ast.body.length; p++) {
      var stmt = parsed.ast.body[p];
      if (stmt.type === "VariableDeclaration" && stmt.kind !== "const") module_state = true;
    }

    return {
      backend: "acorn",
      classes: classes,
      export_style: exports_info.export_style,
      exported_names: exports_info.names,
      has_module_state: module_state,
      functions: functions
    };
  }

  function find_container(entries, index) {
    var node = entries[index].node;
    var container = "module";
    for (var i = 0; i < index; i++) {
      var candidate = entries[i].node;
      var is_scope = candidate.type === "FunctionDeclaration" || candidate.type === "FunctionExpression" || candidate.type === "ArrowFunctionExpression";
      if (is_scope && candidate.start < node.start && node.end <= candidate.end && candidate.id) {
        container = candidate.id.name;
      }
    }
    return container;
  }

  function detect_exports_ast(ast, source_text) {
    var style = "unknown";
    var names = [];
    var export_target = null;
    var program_stmts = ast.body;

    function object_keys(object_node) {
      var keys = [];
      if (!object_node || object_node.type !== "ObjectExpression") return keys;
      for (var i = 0; i < object_node.properties.length; i++) {
        var prop = object_node.properties[i];
        if (prop.type === "Property" && prop.key) keys.push(prop.key.name || prop.key.value);
      }
      return keys;
    }

    function factory_return_names(call_node) {
      var found = [];
      var stack = [call_node];
      while (stack.length > 0) {
        var current = stack.pop();
        if (!current || typeof current !== "object") continue;
        if (current.type === "ReturnStatement" && current.argument && current.argument.type === "ObjectExpression") {
          found = object_keys(current.argument);
          break;
        }
        for (var key in current) {
          if (key === "type" || key === "start" || key === "end") continue;
          var value = current[key];
          if (Array.isArray(value)) {
            for (var v = 0; v < value.length; v++) if (value[v] && typeof value[v].type === "string") stack.push(value[v]);
          } else if (value && typeof value === "object" && typeof value.type === "string") {
            stack.push(value);
          }
        }
      }
      return found;
    }

    for (var i = 0; i < program_stmts.length; i++) {
      var stmt = program_stmts[i];

      if (stmt.type === "ExportDefaultDeclaration") {
        var decl = stmt.declaration;
        if (decl.type === "ClassDeclaration" || decl.type === "ClassExpression") style = "class";
        else if (decl.type === "FunctionDeclaration" || decl.type === "ArrowFunctionExpression") style = "single_function";
        if (decl.id) names.push(decl.id.name);
        continue;
      }
      if (stmt.type === "ExportNamedDeclaration") {
        if (stmt.declaration && (stmt.declaration.type === "ClassDeclaration" || stmt.declaration.type === "ClassExpression")) {
          style = "class";
          if (stmt.declaration.id) {
            names.push(stmt.declaration.id.name);
            export_target = stmt.declaration.id.name;
          }
          continue;
        }
        style = names.length === 0 ? "named_object" : style;
        if (stmt.declaration) {
          if (stmt.declaration.id) names.push(stmt.declaration.id.name);
          if (stmt.declaration.declarations) {
            for (var d = 0; d < stmt.declaration.declarations.length; d++) {
              if (stmt.declaration.declarations[d].id.type === "Identifier") names.push(stmt.declaration.declarations[d].id.name);
            }
          }
        }
        if (stmt.specifiers) {
          for (var sp = 0; sp < stmt.specifiers.length; sp++) names.push(stmt.specifiers[sp].exported.name);
        }
        continue;
      }

      var expr = stmt.type === "ExpressionStatement" ? stmt.expression : null;
      var assign = expr && expr.type === "AssignmentExpression" ? expr : null;
      if (!assign) continue;

      var left = assign.left;
      var is_module_exports = left.type === "MemberExpression" && left.object && left.object.name === "module" && left.property && left.property.name === "exports";
      var is_exports_prop = left.type === "MemberExpression" && left.object && left.object.name === "exports";
      if (!is_module_exports && !is_exports_prop) continue;

      if (is_module_exports) {
        if (assign.right.type === "Identifier") {
          var target_name = assign.right.name;
          var target_is_class = false;
          for (var k = 0; k < program_stmts.length; k++) {
            var s2 = program_stmts[k];
            if (s2.type === "ClassDeclaration" && s2.id && s2.id.name === target_name) target_is_class = true;
          }
          style = target_is_class ? "class" : "single_function";
          if (target_is_class) export_target = target_name;
          names = [];
        } else if (assign.right.type === "ObjectExpression") {
          style = "named_object";
          names = object_keys(assign.right);
        } else if (assign.right.type === "CallExpression") {
          var factory_names_found = factory_return_names(assign.right);
          if (factory_names_found.length > 0) {
            style = "named_object";
            names = factory_names_found;
          }
        }
      } else if (left.property) {
        if (style === "unknown") style = "named_object";
        names.push(left.property.name || left.property.value);
      }
    }
    void source_text;
    return { export_style: style, names: dedupe(names), export_target: export_target };
  }

  function dedupe(list) {
    var out = [];
    for (var i = 0; i < list.length; i++) {
      if (out.indexOf(list[i]) === -1) out.push(list[i]);
    }
    return out;
  }

  function inspect_source_auto(source_text) {
    var ast_result = inspect_source_ast(source_text);
    if (ast_result) return ast_result;
    var legacy = inspect_source(source_text);
    legacy.backend = "legacy";
    return legacy;
  }

  return {
    inspect_source: inspect_source,
    inspect_source_ast: inspect_source_ast,
    inspect_source_auto: inspect_source_auto,
    parse_params: parse_params,
    split_top_level: split_top_level
  };
});

export const inspect_source = globalThis.an_utility_code_inspector.inspect_source;
export const inspect_source_ast = globalThis.an_utility_code_inspector.inspect_source_ast;
export const inspect_source_auto = globalThis.an_utility_code_inspector.inspect_source_auto;
export const parse_params = globalThis.an_utility_code_inspector.parse_params;
export const split_top_level = globalThis.an_utility_code_inspector.split_top_level;
export default globalThis.an_utility_code_inspector;
