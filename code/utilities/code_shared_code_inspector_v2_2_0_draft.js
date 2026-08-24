/**
 * @entity code_inspector_utility
 * @meta project: shared_v2 | file_name: shared_v2/code/utilities/code_shared_code_inspector_v2_2_0_draft.js | version: 2.2.0 | status: draft | author: ox-alpha
 * @objective statically inspect javascript source text and inventory every declared function with parameters, source slice, jsdoc block and structural traits.
 * @purpose_and_problem_statement test generation needs a trusted map of what a file declares; executing unknown code is unsafe so the map is built by reading text only.
 * @usage const inventory = inspect_source(source_text);
 * @timing first stage of the validate and test pipeline before signature inference.
 * @scope_boundaries in_scope: line-oriented parsing of convention formatted sources, top level functions, class methods, factory returns, module exports, jsdoc capture. out_of_scope: full ast fidelity, jsx, typescript syntax, execution of the inspected code.
 * @dependencies none.
 * @keywords inspect, parse, functions, static analysis, inventory
 * @invariants every function declaration and class method appears in the inventory with a balanced brace source slice; the inspected source is never evaluated.
 * @changelog - 2026-08-24: 2.2.0: initial draft
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_utility_code_inspector = api;
})(typeof self !== "undefined" ? self : globalThis, function () {

  var METHOD_KEYWORDS = "constructor if for while switch catch function return".split(" ");

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
    for (var i = 0; i < lines.length; i++) {
      var class_match = lines[i].match(/^\s*(?:export\s+default\s+|export\s+)?class\s+([A-Za-z_$][\w$]*)/);
      if (class_match && depths[i] === 0) {
        var end = find_slice_end(lines, i);
        class_ranges.push({ name: class_match[1], start: i, end: end });
        classes.push(class_match[1]);
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
      var fn_match = lines[i].match(/^\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{?/);
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

  return {
    inspect_source: inspect_source,
    parse_params: parse_params,
    split_top_level: split_top_level
  };
});
