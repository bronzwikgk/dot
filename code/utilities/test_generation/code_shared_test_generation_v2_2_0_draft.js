/**
 * @entity test_generation_utility
 * @meta project: shared_v2 | file_name: shared_v2/code/utilities/code_shared_test_generation_v2_2_0_draft.js | version: 2.2.0 | status: draft | author: ox-alpha
 * @objective generate deterministic regression test plans and runnable node test files from inferred signatures using a template bank, a sample data bank and an edge case rule bank.
 * @purpose_and_problem_statement writing tests by hand does not scale across the utility library; generated tests give every pure function a baseline of determinism, immutability, snapshot and edge safety checks without human effort.
 * @usage const plan = generate_test_plan(signatures, templates, samples, { edge_bank_strings: edges }); const file_text = render_test_file(plan, require_path, snapshot_path);
 * @timing third stage of the validate and test pipeline after signature inference.
 * @scope_boundaries in_scope: bank entry parsing, argument matrix construction, rule driven edge sweeps per parameter type, property selection by traits, node:test file rendering for cjs and esm targets. out_of_scope: executing tests, mutating targets, mocking frameworks.
 * @dependencies none.
 * @keywords test, generation, snapshot, regression, harness, edge cases
 * @invariants generation never executes the target module; rendered files are self contained and rerunnable; identical inputs yield identical plans.
 * @changelog - 2026-08-24: 2.2.0: initial draft
 * @changelog - 2026-08-24: 2.2.0: edge case rule layer with dedicated edge bank and single parameter sweep
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_utility_test_generation = api;
})(typeof self !== "undefined" ? self : globalThis, function () {

  var FUNCTION_STUB_SOURCE = "(function stub(value) { return value; })";

  function parse_template_entry(entry_text) {
    var segments = entry_text.split("||").map(function (s) { return s.trim(); });
    var entry = { archetype: null, properties: [] };
    for (var i = 0; i < segments.length; i++) {
      var colon = segments[i].indexOf(":");
      if (colon === -1) continue;
      var key = segments[i].slice(0, colon).trim();
      var value = segments[i].slice(colon + 1).trim();
      if (key === "archetype") entry.archetype = value;
      if (key === "properties") {
        entry.properties = value.split(",").map(function (p) { return p.trim(); });
      }
    }
    return entry;
  }

  function parse_sample_entry(entry_text) {
    var segments = entry_text.split("||").map(function (s) { return s.trim(); });
    var entry = { type: null, values: [] };
    for (var i = 0; i < segments.length; i++) {
      if (i === 0 && segments[i].indexOf("type:") === 0) {
        entry.type = segments[i].slice(5).trim();
        continue;
      }
      if (segments[i] === "") continue;
      entry.values.push({ raw: segments[i], value: safe_json_parse(segments[i]) });
    }
    return entry;
  }

  function safe_json_parse(text) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return text;
    }
  }

  function values_for_type(sample_entries, wanted_type) {
    var exact = sample_entries.filter(function (e) { return e.type === wanted_type; });
    if (exact.length > 0) return exact[0].values;
    if (wanted_type && wanted_type.indexOf("array<") === 0) {
      var arrays = sample_entries.filter(function (e) { return e.type.indexOf("array<") === 0; });
      if (arrays.length > 0) return arrays[0].values;
    }
    var any = sample_entries.filter(function (e) { return e.type === "any"; });
    if (any.length > 0) return any[0].values;
    return [{ raw: "undefined", value: undefined }];
  }

  function build_arg_cases(sig, sample_entries) {
    var per_param = [];    for (var i = 0; i < sig.params.length; i++) {
      var param = sig.params[i];
      if (param.rest) {
        per_param.push(values_for_type(sample_entries, param_types_of(sig)[i] || "any").map(function (v) { return v.raw; }));
      } else if ((param_types_of(sig)[i] || "any") === "function") {
        per_param.push([FUNCTION_STUB_SOURCE]);
      } else {
        per_param.push(values_for_type(sample_entries, param_types_of(sig)[i] || "any").map(function (v) { return v.raw; }));
      }
    }
    if (per_param.length === 0) return [[]];
    per_param = per_param.filter(function (list) { return list.length > 0; });
    if (per_param.length === 0) return [[]];
    if (per_param.length < sig.params.length) {
      while (per_param.length < sig.params.length) per_param.push(["undefined"]);
    }

    var longest = Math.max.apply(null, per_param.map(function (list) { return list.length; }));
    var matrix = [];
    for (var row = 0; row < longest; row++) {
      matrix.push(per_param.map(function (list) { return list[row % list.length]; }));
    }
    var mixed = per_param.map(function (list) { return list[Math.floor(list.length / 2)]; });
    matrix.push(mixed);
    return matrix;
  }

  function build_edge_cases(sig, edge_entries, sample_entries) {
    var types = param_types_of(sig);
    if (sig.params.length === 0) return [[]];
    var middles = [];
    var edge_lists = [];
    for (var i = 0; i < sig.params.length; i++) {
      var param_type = types[i] || "any";
      if (param_type === "function") {
        middles.push(FUNCTION_STUB_SOURCE);
        edge_lists.push([FUNCTION_STUB_SOURCE]);
        continue;
      }
      var sample_values = values_for_type(sample_entries, param_type);
      var mid = sample_values[Math.floor(sample_values.length / 2)] || { raw: "undefined" };
      middles.push(mid.raw);
      var source_bank = edge_entries.length > 0 ? edge_entries : sample_values.map(function (v) { return { type: null, values: [v] }; });
      var edge_values = values_for_type(source_bank, param_type);
      edge_lists.push(edge_values.length > 0 ? edge_values.map(function (v) { return v.raw; }) : [mid.raw]);
    }

    var rows = [edge_lists.map(function (list) { return list[0]; })];
    for (var p = 0; p < sig.params.length; p++) {
      for (var e = 0; e < edge_lists[p].length; e++) {
        var sweep = middles.slice();
        sweep[p] = edge_lists[p][e];
        rows.push(sweep);
      }
    }

    var seen_keys = {};
    var unique_rows = [];
    for (var r = 0; r < rows.length; r++) {
      var key = rows[r].join("\u0001");
      if (seen_keys[key]) continue;
      seen_keys[key] = true;
      unique_rows.push(rows[r]);
    }
    return unique_rows;
  }

  function param_types_of(sig) {
    return sig.param_types || [];
  }

  function allowed_properties(sig, file_flags) {
    var flags = file_flags || {};
    var allowed = ["edge_safety"];
    if (!sig.traits || !sig.traits.maybe_nondeterministic) {
      allowed.push("determinism");
      if (!(sig.traits && sig.traits.has_module_state) && !flags.has_module_state) {
        allowed.push("snapshot");
      }
    }
    allowed.push("immutability");
    return allowed;
  }

  function select_template(templates, archetype) {
    for (var i = 0; i < templates.length; i++) {
      if (templates[i].archetype === archetype) return templates[i];
    }
    for (var j = 0; j < templates.length; j++) {
      if (templates[j].archetype === "generic") return templates[j];
    }
    return { archetype: archetype, properties: ["determinism", "immutability", "snapshot", "edge_safety"] };
  }

  function generate_unit_plan(sig, templates, sample_entries, file_flags, edge_entries) {
    var template = select_template(templates, sig.archetype);
    var matrix_props = template.properties.filter(function (p) {
      return p !== "edge_safety" && allowed_properties(sig, file_flags).indexOf(p) !== -1;
    });
    var arg_cases = build_arg_cases(sig, sample_entries);
    var cases = [];
    for (var i = 0; i < arg_cases.length; i++) {
      for (var p = 0; p < matrix_props.length; p++) {
        cases.push({ kind: matrix_props[p], args: arg_cases[i], note: "argset_" + i });
      }
    }
    if (template.properties.indexOf("edge_safety") !== -1) {
      var edge_rows = build_edge_cases(sig, edge_entries || [], sample_entries);
      for (var e = 0; e < edge_rows.length; e++) {
        cases.push({ kind: "edge_safety", args: edge_rows[e], note: "edge_" + e });
      }
    }
    return {
      name: sig.name,
      container: sig.container,
      kind: sig.kind,
      archetype: sig.archetype,
      confidence: sig.confidence,
      param_types: param_types_of(sig),
      return_type: sig.return_type,
      cases: cases
    };
  }

  function generate_test_plan(signatures, template_bank_strings, sample_bank_strings, options) {
    var opts = options || {};
    var templates = template_bank_strings.map(parse_template_entry);
    var samples = sample_bank_strings.map(parse_sample_entry);
    var edges = (opts.edge_bank_strings || []).map(parse_sample_entry);
    var units = [];
    for (var i = 0; i < signatures.length; i++) {
      var sig = signatures[i];
      if (opts.exported_names && opts.exported_names.length > 0 && opts.exported_names.indexOf(sig.name) === -1) continue;
      if (opts.skip && opts.skip.indexOf(sig.name) !== -1) continue;
      units.push(generate_unit_plan(sig, templates, samples, opts.file_flags, edges));
    }
    return {
      target: opts.target || "unknown",
      module_kind: opts.module_kind || "named_object",
      export_style: opts.export_style || "named_object",
      units: units
    };
  }

  function serialize_result_source() {
    return [
      "function __serialize(value) {",
      "  if (value === undefined) return \"__undefined__\";",
      "  if (typeof value === \"number\" && !Number.isFinite(value)) return \"__\" + String(value) + \"__\";",
      "  if (typeof value === \"function\") return \"__function__\";",
      "  try { return JSON.stringify(value); } catch (error) { return \"__unserializable__\"; }",
      "}"
    ].join("\n");
  }

  function render_attempt_source() {
    return [
      "function __attempt(name, args) {",
      "  try {",
      "    return { threw: false, value: __serialize(__call(name, args)) };",
      "  } catch (error) {",
      "    const label = error && error.constructor ? error.constructor.name : String(error);",
      "    return { threw: true, value: \"__threw__:\" + label + \":\" + ((error && error.message) || \"\") };",
      "  }",
      "}"
    ].join("\n");
  }

  function render_case_body(unit, case_entry, case_index) {
    var call_args = case_entry.args.join(", ");
    var attempt = "__attempt(\"" + unit.name + "\", __args)";
    var setup = "  const __args = [" + call_args + "];";
    if (case_entry.kind === "determinism") {
      return [
        setup,
        "  const first = " + attempt + ";",
        "  const second = " + attempt + ";",
        "  assert.deepStrictEqual(second, first, \"nondeterministic behaviour\");"
      ].join("\n");
    }
    if (case_entry.kind === "snapshot") {
      return [
        setup,
        "  const actual = JSON.stringify(" + attempt + ");",
        "  const stored = __snapshots[\"" + unit.name + "\"] && __snapshots[\"" + unit.name + "\"][" + case_index + "];",
        "  if (__capture || stored === undefined) {",
        "    __snapshots[\"" + unit.name + "\"] = __snapshots[\"" + unit.name + "\"] || {};",
        "    __snapshots[\"" + unit.name + "\"][" + case_index + "] = actual;",
        "    __dirty = true;",
        "  } else {",
        "    assert.strictEqual(actual, stored, \"snapshot mismatch for case " + case_index + "\");",
        "  }"
      ].join("\n");
    }
    if (case_entry.kind === "immutability") {
      return [
        setup,
        "  const before = JSON.stringify(__args);",
        "  const result = " + attempt + ";",
        "  if (result.threw === false) {",
        "    const after = JSON.stringify(__args);",
        "    assert.strictEqual(after, before, \"input arguments were mutated\");",
        "  }"
      ].join("\n");
    }
    return [
      setup,
      "  try {",
      "    __call(\"" + unit.name + "\", __args);",
      "  } catch (error) {",
      "    assert.ok(error instanceof Error, \"threw non Error value: \" + String(error));",
      "  }"
    ].join("\n");
  }

  function render_test_file(plan, require_path, snapshot_path, options) {
    var opts = options || {};
    var is_esm = !!opts.esm;
    var lines = [];
    lines.push("// AUTOGENERATED by pipeline system_validate_and_test_code_shared_v2 for " + plan.target);
    lines.push("// regenerate instead of editing");
    if (is_esm) {
      lines.push("import { test } from \"node:test\";");
      lines.push("import * as assert from \"node:assert\";");
      lines.push("import fs from \"node:fs\";");
      lines.push("import path from \"node:path\";");
      lines.push("import { pathToFileURL, fileURLToPath } from \"node:url\";");
      lines.push("const mod = await import(pathToFileURL(" + JSON.stringify(require_path.replace(/\\/g, "/")) + ").href);");
      lines.push("const SNAPSHOT_DIR = fileURLToPath(new URL(\".\", import.meta.url));");
    } else {
      lines.push("const test = require(\"node:test\");");
      lines.push("const assert = require(\"node:assert\");");
      lines.push("const fs = require(\"node:fs\");");
      lines.push("const path = require(\"node:path\");");
      lines.push("const mod = require(" + JSON.stringify(require_path) + ");");
      lines.push("const SNAPSHOT_DIR = __dirname;");
    }
    lines.push("const SNAPSHOT_PATH = path.join(SNAPSHOT_DIR, " + JSON.stringify(snapshot_path.replace(/\\/g, "/")) + ");");
    lines.push("const __capture = process.env.TESTGEN_CAPTURE === \"1\";");
    lines.push("let __snapshots = {};");
    lines.push("if (fs.existsSync(SNAPSHOT_PATH)) {");
    lines.push("  __snapshots = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, \"utf8\"));");
    lines.push("}");
    lines.push("let __dirty = false;");
    lines.push("");
    lines.push(serialize_result_source());
    lines.push("");
    lines.push(render_attempt_source());
    lines.push("");
    if (plan.export_style === "class") {
      if (is_esm) {
        lines.push("const Ctor = mod.default || mod;");
        lines.push("const instance = new Ctor();");
      } else {
        lines.push("const instance = new mod();");
      }
      lines.push("function __call(name, args) {");
      lines.push("  if (typeof instance[name] !== \"function\") throw new Error(\"missing method \" + name);");
      lines.push("  return instance[name].apply(instance, args);");
      lines.push("}");
    } else if (is_esm) {
      lines.push("function __call(name, args) {");
      lines.push("  const fn = mod[name] || (mod.default && mod.default[name]);");
      lines.push("  if (typeof fn !== \"function\") throw new Error(\"missing export \" + name);");
      lines.push("  return fn.apply(null, args);");
      lines.push("}");
    } else {
      lines.push("function __call(name, args) {");
      lines.push("  if (typeof mod[name] !== \"function\") throw new Error(\"missing export \" + name);");
      lines.push("  return mod[name].apply(null, args);");
      lines.push("}");
    }
    lines.push("");
    lines.push("process.on(\"exit\", function () {");
    lines.push("  if (__dirty) fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(__snapshots, null, 2));");
    lines.push("});");
    lines.push("");
    for (var u = 0; u < plan.units.length; u++) {
      var unit = plan.units[u];
      for (var c = 0; c < unit.cases.length; c++) {
        var entry = unit.cases[c];
        lines.push("test(\"" + unit.name + " [" + entry.kind + "] " + entry.note + "\", () => {");
        lines.push(render_case_body(unit, entry, c));
        lines.push("});");
        lines.push("");
      }
    }
    return lines.join("\n") + "\n";
  }

  return {
    generate_test_plan: generate_test_plan,
    render_test_file: render_test_file,
    parse_template_entry: parse_template_entry,
    parse_sample_entry: parse_sample_entry
  };
});
