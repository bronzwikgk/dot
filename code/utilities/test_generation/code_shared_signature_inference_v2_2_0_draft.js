/**
 * @entity signature_inference_utility
 * @meta project: shared_v2 | file_name: shared_v2/code/utilities/code_shared_signature_inference_v2_2_0_draft.js | version: 2.2.0 | status: draft | author: ox-alpha
 * @objective infer parameter types, return type and behavioural archetype for inspected functions using jsdoc tags, default values and naming conventions.
 * @purpose_and_problem_statement javascript has no runtime types so generated tests need a best effort signature; guessing must be deterministic and explainable through a confidence field.
 * @usage const enriched = infer_signatures(inventory.functions);
 * @timing second stage of the validate and test pipeline after code inspection.
 * @scope_boundaries in_scope: jsdoc tag parsing, name based type heuristics, archetype classification. out_of_scope: runtime probing, type checking, execution.
 * @dependencies none.
 * @keywords signature, inference, types, archetype, heuristic
 * @invariants every returned record carries confidence one of jsdoc, heuristic, unknown; identical input always yields identical output.
 * @changelog - 2026-08-24: 2.2.0: initial draft
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.an_utility_signature_inference = api;
})(typeof self !== "undefined" ? self : globalThis, function () {

  var PARAM_TYPE_RULES = [
    { pattern: /^(items?|entries|rows|values|tokens|words|collection|records|list|array|arr|args)$/, type: "array<any>" },
    { pattern: /^(n|count|total|index|i|j|k|size|limit|length|decimals?|precision|seed|depth|position|offset)$/, type: "number" },
    { pattern: /^(value|text|string|str|word|input|raw|content|name|key|label|message|sentence|source|target)$/, type: "string" },
    { pattern: /^(options|config|opts|settings|params|record|entity|item|data|obj|object)$/, type: "object" },
    { pattern: /(fn|func|function|callback|cb|mapper|predicate|compare|reducer|transform)$/, type: "function" },
    { pattern: /^(is|has|should|can|use|flag|enabled?)$/, type: "boolean" },
    { pattern: /count$|total$|index$|size$|sum$|mean$|weight[s]?$/, type: "number" }
  ];

  var RETURN_NAME_RULES = [
    { pattern: /^(is|has|can|should)_/, type: "boolean" },
    { pattern: /^(tokenize|split|parse_list|extract)/, type: "array<any>" },
    { pattern: /_(count|total|index|sum|mean|size)$/, type: "number" },
    { pattern: /^(get|build|make|create|format|escape|normalize|join)/, type: "string" }
  ];

  function parse_jsdoc_tags(jsdoc_text) {
    var tags = { params: {}, returns: null };
    if (!jsdoc_text) return tags;
    var lines = jsdoc_text.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var param_match = lines[i].match(/@param\s+\{([^}]+)\}\s+\[?([A-Za-z_$][\w$]*)/);
      if (param_match) {
        tags.params[param_match[2]] = normalize_type_token(param_match[1]);
        continue;
      }
      var return_match = lines[i].match(/@(returns?|return)\s+\{([^}]+)\}/);
      if (return_match) {
        tags.returns = normalize_type_token(return_match[2]);
      }
    }
    return tags;
  }

  function normalize_type_token(raw_type) {
    var token = raw_type.trim().toLowerCase();
    if (token.indexOf("|") !== -1) {
      var parts = token.split("|").map(function (p) { return p.trim(); });
      if (parts.indexOf("null") !== -1 || parts.indexOf("undefined") !== -1) {
        parts = parts.filter(function (p) { return p !== "null" && p !== "undefined"; });
      }
      token = parts[0];
    }
    if (token === "[]") return "array<any>";
    if (token.indexOf("array") === 0 || token.indexOf("]") === token.length - 1 && token.indexOf("[") !== -1) return "array<any>";
    if (token === "str") return "string";
    if (token === "int" || token === "float" || token === "double" || token === "num") return "number";
    if (token === "bool") return "boolean";
    if (token === "func" || token === "callback") return "function";
    if (token === "any" || token === "*") return "any";
    return token;
  }

  var TOKEN_TYPE_MAP = [
    { pattern: /^(fn|func|callback|cb|mapper|predicate|compare|reducer|transform|handler|factory)$/, type: "function" },
    { pattern: /^(items|entries|rows|values|tokens|words|collections?|records|lists?|arrays?|arrs?|args|elements)$/, type: "array<any>" },
    { pattern: /^(options|configs?|opts|settings|params|records?|entity|item|data|obj|object|payload|context|ctx)$/, type: "object" },
    { pattern: /^(n|count|total|index|i|j|k|size|limit|length|decimals?|precision|seed|depth|position|offset|std|sd|variance|num|number|integer|weight|weights|sum|mean)$/, type: "number" },
    { pattern: /^(value|text|string|str|word|input|raw|content|name|key|label|message|sentence|source|target)$/, type: "string" },
    { pattern: /^(is|has|should|can|use|flag|enabled)$/, type: "boolean" }
  ];

  function split_identifier(name) {
    return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase().split("_").filter(Boolean);
  }

  function guess_param_type(param_name) {
    var lowered = param_name.toLowerCase();
    for (var r = 0; r < PARAM_TYPE_RULES.length; r++) {
      if (PARAM_TYPE_RULES[r].pattern.test(lowered)) return PARAM_TYPE_RULES[r].type;
    }
    var tokens = split_identifier(param_name);
    for (var t = tokens.length - 1; t >= 0; t--) {
      for (var m = 0; m < TOKEN_TYPE_MAP.length; m++) {
        if (TOKEN_TYPE_MAP[m].pattern.test(tokens[t])) return TOKEN_TYPE_MAP[m].type;
      }
    }
    if (/s$/.test(lowered)) return "array<any>";
    return "any";
  }

  function guess_return_type(fn_name) {
    var lowered = fn_name.toLowerCase();
    for (var i = 0; i < RETURN_NAME_RULES.length; i++) {
      if (RETURN_NAME_RULES[i].pattern.test(lowered)) return RETURN_NAME_RULES[i].type;
    }
    return "unknown";
  }

  function infer_return_from_source(fn_record) {
    var source = fn_record.source || "";
    if (/\breturn\s+(true|false)\s*;?/.test(source)) return "boolean";
    if (/\breturn\s+[-+]?\d+(\.\d+)?\s*;?/.test(source)) return "number";
    if (/\breturn\s+["'`]/.test(source)) return "string";
    if (/\breturn\s+\[/.test(source)) return "array<any>";
    if (/\breturn\s+\{/.test(source)) return "object";
    if (/\breturn\s+.*\.(map|filter|slice|concat|split)\s*\(/.test(source)) return "array<any>";
    if (/\breturn\s+.*\.(join|trim|replace|toLowerCase|toUpperCase)\s*\(/.test(source)) return "string";
    if (/\breturn\s+.*\.(length|size)\b/.test(source)) return "number";
    if (/\breturn\s+.*(===|!==|>=|<=|>|<|&&|\|\|)\s*/.test(source)) return "boolean";
    return "unknown";
  }

  function classify_archetype(name, param_types, return_type) {
    var has_callback = param_types.indexOf("function") !== -1;
    var first = param_types[0] || "none";
    if (/^(is|has|can|should)_/.test(name)) return "predicate";
    if (first === "none") return "nullary_producer";
    if (has_callback) return "callback_pipeline";
    if (first === "string") {
      if (return_type === "array<any>") return "string_tokenize";
      return "string_transform";
    }
    if (first === "array<any>" || first.indexOf("array<") === 0) {
      if (return_type === "number") return "aggregation";
      return "array_transform";
    }
    if (first === "object") return "record_transform";
    var all_numeric = param_types.length > 0 && param_types.every(function (t) { return t === "number"; });
    if (all_numeric) return param_types.length === 1 ? "numeric_unary" : "numeric_nary";
    return "generic";
  }

  function infer_signature(fn_record) {
    var jsdoc = parse_jsdoc_tags(fn_record.jsdoc);
    var param_types = [];
    var confidence = jsdoc.returns || Object.keys(jsdoc.params).length > 0 ? "jsdoc" : "heuristic";

    for (var i = 0; i < fn_record.params.length; i++) {
      var declared = jsdoc.params[fn_record.params[i].name];
      if (declared) {
        param_types.push(declared);
      } else if (fn_record.params[i].has_default) {
        param_types.push(default_literal_to_type(fn_record.params[i].default_literal));
      } else {
        param_types.push(guess_param_type(fn_record.params[i].name));
      }
    }

    var source_return = infer_return_from_source(fn_record);
    var return_type = jsdoc.returns || (source_return !== "unknown" ? source_return : guess_return_type(fn_record.name));
    if (!jsdoc.returns && return_type === "unknown") confidence = "unknown";

    var enriched = {};
    for (var key in fn_record) enriched[key] = fn_record[key];
    enriched.param_types = param_types;
    enriched.return_type = return_type;
    enriched.archetype = classify_archetype(fn_record.name, param_types, return_type);
    enriched.confidence = confidence;
    return enriched;
  }

  function default_literal_to_type(literal) {
    if (/^-?\d+(\.\d+)?$/.test(literal)) return "number";
    if (literal === "true" || literal === "false") return "boolean";
    if (literal.charAt(0) === "\"" || literal.charAt(0) === "'") return "string";
    if (literal.charAt(0) === "[") return "array<any>";
    if (literal.charAt(0) === "{") return "object";
    return "any";
  }

  function infer_signatures(fn_records) {
    return (fn_records || []).filter(function (f) {
      return f.kind === "function" || f.kind === "method" || f.kind === "constructor";
    }).map(infer_signature);
  }

  return {
    infer_signature: infer_signature,
    infer_signatures: infer_signatures,
    classify_archetype: classify_archetype,
    normalize_type_token: normalize_type_token,
    infer_return_from_source: infer_return_from_source
  };
});

export class SignatureInferencer {
  constructor(config = {}) {
    this.config = config || {};
  }

  inferSignature(fnRecord) {
    return globalThis.an_utility_signature_inference.infer_signature(fnRecord);
  }

  inferSignatures(fnRecords) {
    return globalThis.an_utility_signature_inference.infer_signatures(fnRecords);
  }

  classifyArchetype(name, paramTypes, returnType) {
    return globalThis.an_utility_signature_inference.classify_archetype(name, paramTypes, returnType);
  }

  normalizeTypeToken(rawType) {
    return globalThis.an_utility_signature_inference.normalize_type_token(rawType);
  }

  inferReturnFromSource(fnRecord) {
    return globalThis.an_utility_signature_inference.infer_return_from_source(fnRecord);
  }
}

const defaultInferencer = new SignatureInferencer();

export function infer_signature(fnRecord) { return defaultInferencer.inferSignature(fnRecord); }
export function infer_signatures(fnRecords) { return defaultInferencer.inferSignatures(fnRecords); }
export function classify_archetype(name, paramTypes, returnType) { return defaultInferencer.classifyArchetype(name, paramTypes, returnType); }
export function normalize_type_token(rawType) { return defaultInferencer.normalizeTypeToken(rawType); }
export function infer_return_from_source(fnRecord) { return defaultInferencer.inferReturnFromSource(fnRecord); }
export default SignatureInferencer;
