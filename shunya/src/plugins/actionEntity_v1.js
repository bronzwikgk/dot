/*
ActionEntity v1.0
=================
Minimal schema-aware entity creator. It receives a standard request payload that
references a `targetName`, looks up the matching entity configuration, validates
the payload against the configured schema, applies metadata/defaults, persists as
specified by the storage definition, and returns the standardized response shape.
- Schema registry driven: reads entity configs keyed by `targetName`.
- LocalStorage/IndexedDB/FS drivers via `ActionLocalStorage` + `ActionIDB` + `ActionFS`.
- Full CRUD (create/read/query/update/delete/deleteAll) for FS-backed entities with schema validation.
- Standardized request/response contract so callers get predictable metadata.
- Flexible persistence (JSON/CSV/JSONL) plus auto header detection and optional CSV headers.
- Metadata enrichment (actor, timestamps) before validation.
- Optional CSV headers via `storage.headers`/`storage.writeHeaders`.
- Simple test harness ensures configs work without touching disk.
*/

import { ActionFS } from "../utils/actionFS.js";
import { ActionIDB } from "../utils/actionIDB.js";
import { ActionLocalStorage } from "../utils/actionLocalStorage.js";
import { ActionValidator } from "../utils/ActionValidator_v2_3.js";
import { ActionEntityRequestSchema_v1 } from "../../schema/actionEntity_request_schema_v1.js";

export const ActionEntityResponseSchema = {
  success: true,
  action: "",
  payload: {
    targetName: "",
    record: {},
    metadata: {}
  },
  meta: {
    persisted: "",
    storagePath: ""
  }
};

export class ActionEntity {
  constructor(entityConfigs = {}, options = {}) {
    this.entityConfigs = entityConfigs || {};
    this.validator = ActionValidator;
    this.requestSchema = ActionEntityRequestSchema_v1;
    this.isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
    this.actionFS = this.isBrowser ? null : new ActionFS(options.basePath || ".");
    this.actionIDB = typeof indexedDB !== "undefined" ? new ActionIDB() : null;
    this.actionLocalStorage =
      typeof window !== "undefined" && window.localStorage ? new ActionLocalStorage("ehh_v104") : null;
    this.memoryRecordLines = [];
    this.formatHandlers = options.formatHandlers || this._createDefaultFormatHandlers();
    this.hooks = this._initializeHookRegistry();
    this.hookIdCounter = 0;
  }

  /*
    Testing guidance & coverage matrix:
    - Use `actionEntity_v1.test.js` to exercise formats (json/csv/jsonl) and real schemas (entity_user_session, entity_user_register).
    - For driver coverage run in node (FS) and browser/devtools (localStorage/IndexedDB) using the same requests.
    - Edge cases:
        * Missing entity config → expect thrown error.
        * Schema validation failure (bad payload) → expect validator rejection.
        * Unsupported storage driver → falls back to JSON + logs error.
        * CSV missing headers → defaults to record keys.
    - Summary of latest test report: node test script logs validator startup and confirms persisted metadata for all formats/schemas; no failures observed.
    - Extend by capturing files under ./tmp/ or mocking ActionFS/ActionIDB for deterministic assertions.
  */

  async createEntity(request = {}) {
    /*
      Pipeline
      1. Receive request → ActionApp.handleJsonRoute / handleApiAction.
      2. Normalize + validate the request shape with the ActionEntity request schema.
      3. Extract payload + determine targetName (payload.data accepted).
      4. Lookup entity schema/config (dbSchema or schema reference).
      5. Merge defaults + metadata (actor, timestamps, meta defaults).
      6. Validate record via ActionValidator.
      7. Persist using storage config (json/jsonl/csv formats via ActionFS).
      8. Return standardized response.
    */
    /*
      Request conditions & options:
      - `targetName` is required (request.targetName || payload.targetName).
      - `payload.data` is supported; `targetName`/`data` keys are removed before validation.
      - `entityConfig.defaults` and `entityConfig.meta.defaults` seed base values.
      - Metadata (createdAt, createdBy, source) reconciles request.actor and payload.meta overrides.
      - Validation uses the schema referenced by the entity (dbSchema or schema field).
      - Storage must specify driver/path/file/format; supported formats: json, jsonl, csv (others fallback to json).
      - CSV output obeys `storage.headers`; unspecified headers default to record keys.
      - `_persistEntity` uses `ActionFS.appendFile`; it can be extended for new drivers (IndexedDB/LocalStorage).
      - Response metadata always includes `persistedAt` and `storagePath` for observability hooks.
      - Errors during lookup, validation, or persistence propagate to callers for upstream handling.
    */
    const validationRequest = this._buildValidationRequest(request);
    this.validator.validateAndThrow(validationRequest, this.requestSchema, {
      fieldPrefix: "request"
    });
    const targetName = this._resolveTargetName(request);
    const context = this._resolveTargetStorage(targetName);
    if (!context.entityConfig) {
      throw new Error(`No entity configuration found for ${targetName}`);
    }
    const entityConfig = context.entityConfig;
    const dbSchema = entityConfig.dbSchema || entityConfig.schema;
    if (!dbSchema) {
      throw new Error(`Missing schema for entity ${targetName}`);
    }
    const payload = this._resolvePayload(request);
    let record = this._buildRecord(payload, entityConfig, request);
    record = this._sanitizeRecord(record, entityConfig, request);
    await this._runHooks("beforeCreate", targetName, record, { request });
    const conflict = await this._checkForConflict(targetName, record, context);
    if (conflict) {
      const conflictResults = await this._runHooks("onConflict", targetName, record, {
        request,
        conflict,
        storage: context.storage
      });
      const resolution = this._resolveConflictAction(conflictResults, record, conflict);
      if (resolution.abort) {
        throw resolution.error || new Error(`Conflict detected for ${targetName}`);
      }
      if (resolution.record) {
        record = resolution.record;
      }
    }
    await this._runHooks("beforeValidate", targetName, record, { request, context });
    this.validator.validateAndThrow(record, dbSchema, {
      fieldPrefix: targetName
    });
    await this._runEntityValidationPipeline(record, entityConfig, request);
    await this._runHooks("afterValidate", targetName, record, { request });
    const persisted = await this._persistEntity(targetName, entityConfig, record, request.persist || {}, { request, context });
    await this._runHooks("afterCreate", targetName, record, { request, persisted });
    return this._prepareResponse(targetName, record, persisted, "create");
  }

  _buildValidationRequest(request) {
    var normalized = request && typeof request === "object" ? { ...request } : {};
    normalized.targetName = this._extractTargetNameCandidate(request);
    normalized.payload = this._extractPayloadForValidation(request);
    return normalized;
  }

  _extractTargetNameCandidate(request) {
    if (!request || typeof request !== "object") {
      return undefined;
    }
    function tidy(value) {
      if (typeof value !== "string") {
        return undefined;
      }
      var trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }
    var candidate = tidy(request.targetName);
    if (candidate) {
      return candidate;
    }
    if (request.payload && typeof request.payload === "object") {
      candidate = tidy(request.payload.targetName);
      if (candidate) {
        return candidate;
      }
      if (request.payload.data && typeof request.payload.data === "object") {
        candidate = tidy(request.payload.data.targetName);
        if (candidate) {
          return candidate;
        }
      }
    }
    return undefined;
  }

  _extractPayloadForValidation(request) {
    if (!request || typeof request !== "object") {
      return {};
    }
    if (request.payload && typeof request.payload === "object") {
      return { ...request.payload };
    }
    return {};
  }

  _resolveTargetName(request) {
    if (request && request.targetName) {
      return request.targetName;
    }
    if (request && request.payload && request.payload.targetName) {
      return request.payload.targetName;
    }
    throw new Error("Request must specify targetName");
  }

  _resolvePayload(request) {
    if (!request) {
      return {};
    }
    if (request.payload && typeof request.payload === "object") {
      if (request.payload.data && typeof request.payload.data === "object") {
        const copy = { ...request.payload.data };
        delete copy.targetName;
        return copy;
      }
      const copy = { ...request.payload };
      delete copy.targetName;
      delete copy.data;
      return copy;
    }
    return {};
  }

  _buildRecord(payload, entityConfig, request) {
    const defaults = entityConfig.defaults || {};
    const record = {
      ...defaults,
      ...payload
    };
    const payloadMeta = record.meta || {};
    const metaDefaults = (entityConfig.meta && entityConfig.meta.defaults) || {};
    record.meta = {
      ...metaDefaults,
      ...payloadMeta,
      source: (request && request.actor) || payloadMeta.source || "system",
      createdAt: payloadMeta.createdAt || new Date().toISOString(),
      createdBy: payloadMeta.createdBy || (request && request.actor) || "system"
    };
    return record;
  }

  _sanitizeRecord(record, entityConfig, request) {
    if (!record || typeof record !== "object") {
      return record;
    }
    const baseline = {
      stripHtml: true,
      escapeHtml: false,
      blockSqlKeywords: true,
      maxLength: 2048,
      disallowPathTraversal: true,
      ...((entityConfig && entityConfig.sanitization) || {})
    };
    var sanitized = {};
    var keys = Object.keys(record);
    var i;
    for (i = 0; i < keys.length; i++) {
      const key = keys[i];
      sanitized[key] = this._sanitizeValue(record[key], baseline, key);
    }
    return sanitized;
  }

  _sanitizeValue(value, rules, key) {
    if (typeof value === "string") {
      return this._sanitizeString(value, rules, key);
    }
    if (Array.isArray(value)) {
      return value.map((item) => this._sanitizeValue(item, rules, key));
    }
    if (value && typeof value === "object") {
      var sanitizedObject = {};
      var nestedKeys = Object.keys(value);
      var i;
      for (i = 0; i < nestedKeys.length; i++) {
        const nestedKey = nestedKeys[i];
        sanitizedObject[nestedKey] = this._sanitizeValue(value[nestedKey], rules, nestedKey);
      }
      return sanitizedObject;
    }
    return value;
  }

  _sanitizeString(value, rules) {
    if (typeof value !== "string") {
      return value;
    }
    var result = value;
    if (rules.stripHtml) {
      result = result.replace(/<[^>]+>/g, "");
    }
    if (rules.escapeHtml) {
      result = result
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
    if (rules.blockSqlKeywords) {
      result = result.replace(
        /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|REPLACE)\b/gi,
        ""
      );
    }
    if (rules.disallowPathTraversal) {
      result = result.replace(/\.\.\//g, "").replace(/\\.\\./g, "");
    }
    if (rules.maxLength && result.length > rules.maxLength) {
      result = result.slice(0, rules.maxLength);
    }
    return result;
  }

  async _checkForConflict(targetName, record, context) {
    if (!context || !context.keyField) {
      return null;
    }
    const keyField = context.keyField || "id";
    const key = record[keyField] || record.id;
    if (!key) {
      return null;
    }
    return this._findRecordInStorage(targetName, key, context);
  }

  async _findRecordInStorage(targetName, key, context) {
    if (!context) {
      return null;
    }
    if (context.driver === "fs") {
      const records = await this._loadFsRecords(
        context.storagePath,
        context.storage,
        context.entityConfig
      );
      for (var i = 0; i < records.length; i++) {
        if (records[i][context.keyField] === key) {
          return records[i];
        }
      }
      return null;
    }
    const browserRecords = await this._loadBrowserRecords(context.driver, context);
    for (var j = 0; j < browserRecords.length; j++) {
      if (browserRecords[j][context.keyField] === key) {
        return browserRecords[j];
      }
    }
    return null;
  }

  _resolveConflictAction(results, record, conflict) {
    const resolution = {
      abort: false,
      record: record
    };
    if (!Array.isArray(results)) {
      return resolution;
    }
    for (var i = 0; i < results.length; i++) {
      const entry = results[i];
      if (!entry || entry.skipped) {
        continue;
      }
      const payload = entry.result;
      if (payload && payload.action === "abort") {
        resolution.abort = true;
        resolution.error = payload.error || entry.error;
        continue;
      }
      if (payload && payload.record) {
        resolution.record = payload.record;
      }
      if (payload && payload.action === "merge" && conflict) {
        resolution.record = { ...conflict, ...payload.record };
      }
    }
    return resolution;
  }

  async _runEntityValidationPipeline(record, entityConfig, request) {
    const pipeline = (entityConfig && entityConfig.validation) || {};
    const locale = (request && request.meta && request.meta.locale) || "en";
    var errors = [];

    const crossFieldRules = pipeline.crossFieldRules || [];
    var i;
    for (i = 0; i < crossFieldRules.length; i++) {
      const rule = crossFieldRules[i];
      if (typeof rule.validate !== "function") {
        continue;
      }
      const outcome = this._interpretValidationResult(
        rule.validate(record, { request, fields: rule.fields })
      );
      if (!outcome.valid) {
        const message = this._resolveValidationMessage(
          rule,
          pipeline,
          locale,
          outcome.message
        );
        errors.push({
          rule: rule.name || "crossField",
          fields: rule.fields || [],
          message: message
        });
      }
    }

    const customValidators = pipeline.customValidators || [];
    for (i = 0; i < customValidators.length; i++) {
      const rule = customValidators[i];
      try {
        if (typeof rule.handler !== "function") {
          continue;
        }
        const outcome = this._interpretValidationResult(
          rule.handler(record, request)
        );
        if (!outcome.valid) {
          const message = this._resolveValidationMessage(
            rule,
            pipeline,
            locale,
            outcome.message
          );
          errors.push({
            rule: rule.name || "custom",
            fields: rule.fields || [],
            message: message
          });
        }
      } catch (error) {
        errors.push({
          rule: rule.name || "custom",
          fields: rule.fields || [],
          message: error.message
        });
      }
    }

    const asyncValidators = pipeline.asyncValidators || [];
    for (i = 0; i < asyncValidators.length; i++) {
      const rule = asyncValidators[i];
      try {
        if (typeof rule.handler !== "function") {
          continue;
        }
        const outcome = await rule.handler(record, request);
        const normalized = this._interpretValidationResult(outcome);
        if (!normalized.valid) {
          const message = this._resolveValidationMessage(
            rule,
            pipeline,
            locale,
            normalized.message
          );
          errors.push({
            rule: rule.name || "async",
            fields: rule.fields || [],
            message: message
          });
        }
      } catch (error) {
        errors.push({
          rule: rule.name || "async",
          fields: rule.fields || [],
          message: error.message
        });
      }
    }

    if (errors.length > 0) {
      const error = new Error(
        `Validation pipeline failed: ${errors.map((item) => item.message).join("; ")}`
      );
      error.validationErrors = errors;
      error.code = "VALIDATION_PIPELINE_ERROR";
      throw error;
    }
  }

  _interpretValidationResult(outcome) {
    if (outcome === undefined) {
      return { valid: true };
    }
    if (typeof outcome === "boolean") {
      return { valid: outcome };
    }
    if (outcome && typeof outcome === "object") {
      return {
        valid: outcome.valid !== false,
        message: outcome.message,
        data: outcome
      };
    }
    return { valid: true };
  }

  _resolveValidationMessage(rule, pipeline, locale, fallback) {
    const localizedRule = this._resolveLocalization(rule.localization, locale);
    if (localizedRule) {
      return localizedRule;
    }
    const pipelineLocalized =
      pipeline &&
      pipeline.localization &&
      this._resolveLocalization(pipeline.localization[rule.name], locale);
    if (pipelineLocalized) {
      return pipelineLocalized;
    }
    if (fallback) {
      return fallback;
    }
    return rule.message || `Validation ${rule.name || "rule"} failed`;
  }

  _resolveLocalization(localization, locale) {
    if (!localization) {
      return null;
    }
    if (typeof localization === "string") {
      return localization;
    }
    if (localization[locale]) {
      return localization[locale];
    }
    if (localization.default) {
      return localization.default;
    }
    return null;
  }

  async _persistEntity(targetName, entityConfig, record, requestPersist = {}, metadata = {}) {
    var baseStorage = entityConfig.storage || {};
    var storage = {
      ...baseStorage,
      path: baseStorage.path,
      file: baseStorage.file,
      format: baseStorage.format,
      driver: baseStorage.driver
    };
    var requestPersistEntries = requestPersist || {};
    var keyNames = Object.keys(requestPersistEntries);
    var i;
    for (i = 0; i < keyNames.length; i++) {
      var key = keyNames[i];
      var value = requestPersistEntries[key];
      if (value !== undefined) {
        storage[key] = value;
      }
    }
    const basePath = storage.path || "./data";
    const format = storage.format || "json";
    const extension = format === "csv" ? ".csv" : format === "json" ? ".json" : "";
    const fileName = storage.file || `${targetName}.${format}`;
    const normalizedFile = fileName.endsWith(extension) ? fileName : `${fileName}${extension}`;
    const driver = (storage.driver || "fs").toLowerCase();
    let persistenceDriver = driver;
    if (persistenceDriver === "fs" && !this.actionFS) {
      if (this.actionLocalStorage) {
        persistenceDriver = "localstorage";
      } else if (this.actionIDB) {
        persistenceDriver = "idb";
      } else {
        throw new Error("Filesystem persistence requires Node.js");
      }
    }
    const identityField = storage.keyField || "id";
    if (driver !== "fs") {
      record[identityField] = record[identityField] || record.id || `${targetName}:${Date.now()}`;
      record.id = record[identityField];
    }
    const storagePath =
      persistenceDriver === "fs"
        ? basePath.endsWith("/")
          ? `${basePath}${normalizedFile}`
          : `${basePath}/${normalizedFile}`
        : this._resolveDriverPath(persistenceDriver, targetName, storage, record);
    await this._runHooks("beforePersist", targetName, record, {
      request: metadata.request,
      storage,
      context: metadata.context,
      stage: "beforePersist"
    });
    const serialized = this._serializeRecord(storage, record);
    if (
      persistenceDriver === "fs" &&
      storage.format === "csv" &&
      storage.headers &&
      storage.headers.length > 0 &&
      storage.writeHeaders !== false
    ) {
      const headerPresent = await this._ensureCsvHeader(storagePath, storage.headers);
      if (!headerPresent) {
        const headerLine = `${storage.headers.join(",")}\n`;
        await this.actionFS.appendFile(storagePath, headerLine);
      }
    }
    storage.driver = persistenceDriver;
    await this._dispatchPersistence(persistenceDriver, storagePath, record, serialized);
    const persisted = {
      storagePath: storagePath,
      persistedAt: new Date().toISOString()
    };
    await this._runHooks("afterPersist", targetName, record, {
      request: metadata.request,
      storage,
      context: metadata.context,
      persisted,
      stage: "afterPersist"
    });
    return persisted;
  }

  // Read a single record by key (identity field)
  async readEntity(targetName, key) {
    const context = this._resolveTargetStorage(targetName);
    if (!context.entityConfig) {
      throw new Error(`No entity configuration for ${targetName}`);
    }
    const metadata = { key, context };
    await this._runHooks("beforeRead", targetName, null, metadata);
    if (context.driver !== "fs") {
      var browserRecords = await this._loadBrowserRecords(context.driver, context);
      var j;
      for (j = 0; j < browserRecords.length; j++) {
        if (browserRecords[j][context.keyField] === key) {
          await this._runHooks("afterRead", targetName, browserRecords[j], metadata);
          return browserRecords[j];
        }
      }
      await this._runHooks("afterRead", targetName, null, metadata);
      return null;
    }
    var records = await this._loadFsRecords(context.storagePath, context.storage, context.entityConfig);
    var k;
    for (k = 0; k < records.length; k++) {
      if (records[k][context.keyField] === key) {
        await this._runHooks("afterRead", targetName, records[k], metadata);
        return records[k];
      }
    }
    await this._runHooks("afterRead", targetName, null, metadata);
    return null;
  }

  // Query all records optionally filtered by predicate
  async queryEntities(targetName, predicate) {
    const context = this._resolveTargetStorage(targetName);
    if (!context.entityConfig || context.driver !== "fs") {
      var browserRecords = await this._loadBrowserRecords(context.driver, context);
      if (typeof predicate !== "function") {
        return browserRecords;
      }
      var filtered = [];
      var l;
      for (l = 0; l < browserRecords.length; l++) {
        if (predicate(browserRecords[l])) {
          filtered.push(browserRecords[l]);
        }
      }
      return filtered;
    }
    var records = await this._loadFsRecords(context.storagePath, context.storage, context.entityConfig);
    if (typeof predicate !== "function") {
      return records;
    }
    var result = [];
    var m;
    for (m = 0; m < records.length; m++) {
      if (predicate(records[m])) {
        result.push(records[m]);
      }
    }
    return result;
  }

  query(targetName) {
    return new EntityQueryBuilder(this, targetName);
  }

  async generateEntityId(options = {}) {
    const targetName = options.targetName || "entity_unique_id";
    const context = this._resolveTargetStorage(targetName);
    if (!context.entityConfig) {
      throw new Error(`No entity configuration for ${targetName}`);
    }
    const records =
      context.driver === "fs"
        ? await this._loadFsRecords(
            context.storagePath,
            context.storage,
            context.entityConfig
          )
        : await this._loadBrowserRecords(context.driver, context);
    var lastIndex = -1;
    var n;
    for (n = 0; n < records.length; n++) {
      var current = Number(records[n].index) || -1;
      if (current > lastIndex) {
        lastIndex = current;
      }
    }
    const nextIndex = lastIndex + 1;
    const acronym =
      (options.acronym &&
        typeof options.acronym === "string" &&
        options.acronym.toUpperCase()) ||
      (context.entityConfig.acronym && context.entityConfig.acronym.toUpperCase()) ||
      (context.entityConfig.name || "ENTITY")
        .split(/\s+/)[0]
        .toUpperCase();
    const generatedId = `${acronym}_${nextIndex}`;
    const record = {
      id: generatedId,
      acronym,
      index: nextIndex,
      meta: {
        ...options.meta,
        source: options.actor || "system",
        createdAt: new Date().toISOString(),
        createdBy: options.actor || "system"
      }
    };
    const persisted = await this._persistEntity(
      targetName,
      context.entityConfig,
      record,
      {},
      { request: { actor: options.actor }, context }
    );
    return { id: generatedId, index: nextIndex, record, persisted };
  }

  _initializeHookRegistry() {
    const events = [
      "beforeCreate",
      "afterCreate",
      "beforeUpdate",
      "afterUpdate",
      "beforeDelete",
      "afterDelete",
      "beforeValidate",
      "afterValidate",
      "beforePersist",
      "afterPersist",
      "beforeRead",
      "afterRead",
      "onConflict"
    ];
    const registry = {};
    var i;
    for (i = 0; i < events.length; i++) {
      registry[events[i]] = [];
    }
    return registry;
  }

  registerFormat(format, handler) {
    this.formatHandlers[format.toLowerCase()] = handler;
  }

  _getFormatHandler(format) {
    if (!format) {
      format = "json";
    }
    var key = format.toLowerCase();
    return this.formatHandlers[key];
  }

  registerHook(event, handler, options = {}) {
    if (!event || typeof handler !== "function") {
      throw new Error("Invalid hook registration");
    }
    const entry = {
      id: options.id || `${event}_${++this.hookIdCounter}`,
      handler,
      priority: typeof options.priority === "number" ? options.priority : 0,
      condition: typeof options.condition === "function" ? options.condition : null,
      timeout: typeof options.timeout === "number" ? options.timeout : 0,
      dependsOn: Array.isArray(options.dependsOn) ? options.dependsOn.slice(0) : [],
      errorStrategy: options.errorStrategy || "abort"
    };
    if (!this.hooks[event]) {
      this.hooks[event] = [];
    }
    this.hooks[event].push(entry);
    this._sortHooks(event);
    return entry.id;
  }

  _sortHooks(event) {
    if (!this.hooks[event]) {
      return;
    }
    this.hooks[event].sort((a, b) => b.priority - a.priority);
  }

  _createDefaultFormatHandlers() {
    function jsonHandler() {
      return {
        serialize: function (record) {
          return JSON.stringify(record) + "\n";
        },
        deserialize: function (line) {
          return JSON.parse(line);
        }
      };
    }
    function jsonlHandler() {
      return {
        serialize: function (record) {
          return JSON.stringify(record) + "\n";
        },
        deserialize: function (line) {
          return JSON.parse(line);
        }
      };
    }
    function csvHandler() {
      return {
        serialize: function (record, headers, resolve) {
          var values = [];
          var i;
          for (i = 0; i < headers.length; i++) {
            values.push(resolve(headers[i], record));
          }
          return values.join(",") + "\n";
        },
        deserialize: function (line, headers) {
          var parts = line.split(",");
          var record = {};
          var j;
          for (j = 0; j < headers.length; j++) {
            record[headers[j]] = parts[j] || "";
          }
          return record;
        }
      };
    }
    function treeHandler() {
      return {
        serialize: function (record, _, __, serializer) {
          if (!serializer) {
            serializer = JSON.stringify;
          }
          return serializer(record) + "\n";
        },
        deserialize: function (line, _, __, parser) {
          if (!parser) {
            parser = JSON.parse;
          }
          return parser(line);
        }
      };
    }
    function textHandler() {
      return {
        serialize: function (record) {
          if (typeof record === "string") {
            return record + "\n";
          }
          if (record && typeof record.content === "string") {
            return record.content + "\n";
          }
          return JSON.stringify(record) + "\n";
        },
        deserialize: function (line) {
          return { content: line };
        }
      };
    }
    var handlers = {};
    handlers.json = jsonHandler();
    handlers.jsonl = jsonlHandler();
    handlers.csv = csvHandler();
    handlers.yaml = treeHandler();
    handlers.yml = treeHandler();
    handlers.md = treeHandler();
    handlers.html = treeHandler();
    handlers.xml = treeHandler();
    handlers.txt = textHandler();
    return handlers;
  }

  async updateEntity(targetName, key, updates = {}) {
    const context = this._resolveTargetStorage(targetName);
    if (!context.entityConfig) {
      throw new Error(`No entity configuration for ${targetName}`);
    }
    if (context.driver !== "fs") {
      throw new Error("updateEntity supports FS storage only");
    }
    const records = await this._loadFsRecords(
      context.storagePath,
      context.storage,
      context.entityConfig
    );
    var idx = -1;
    var p;
    for (p = 0; p < records.length; p++) {
      if (records[p][context.keyField] === key) {
        idx = p;
        break;
      }
    }
    if (idx === -1) {
      return null;
    }
    const entityConfig = context.entityConfig;
    await this._runHooks("beforeUpdate", targetName, records[idx], { key, updates });
    const updated = {
      ...records[idx],
      ...updates
    };
    this.validator.validateAndThrow(updated, entityConfig.dbSchema || entityConfig.schema, {
      fieldPrefix: targetName
    });
    records[idx] = updated;
    await this._persistRecordsFs(context.storagePath, records, context.storage);
    await this._runHooks("afterUpdate", targetName, updated, { key, updates });
    return this._prepareResponse(targetName, updated, {
      storagePath: context.storagePath,
      persistedAt: new Date().toISOString()
    });
  }

  async deleteEntity(targetName, key) {
    const context = this._resolveTargetStorage(targetName);
    if (!context.entityConfig || context.driver !== "fs") {
      throw new Error("deleteEntity supports FS storage only");
    }
    const records = await this._loadFsRecords(
      context.storagePath,
      context.storage,
      context.entityConfig
    );
    var target = null;
    var s;
    for (s = 0; s < records.length; s++) {
      if (records[s][context.keyField] === key) {
        target = records[s];
        break;
      }
    }
    await this._runHooks("beforeDelete", targetName, target, { key });
    var remaining = [];
    var t;
    for (t = 0; t < records.length; t++) {
      if (records[t][context.keyField] !== key) {
        remaining.push(records[t]);
      }
    }
    await this._persistRecordsFs(context.storagePath, remaining, context.storage);
    await this._runHooks("afterDelete", targetName, target, { key });
    return remaining.length !== records.length;
  }

  async deleteAllEntities(targetName) {
    const context = this._resolveTargetStorage(targetName);
    if (!context.entityConfig || context.driver !== "fs") {
      throw new Error("deleteAllEntities supports FS storage only");
    }
    await this.actionFS.writeFile(context.storagePath, "");
  }

  async createMany(targetName, payloads, options = {}) {
    if (!Array.isArray(payloads)) {
      throw new Error("createMany requires an array of payloads");
    }
    if (payloads.length === 0) {
      return [];
    }
    const context = this._resolveTargetStorage(targetName);
    const snapshot =
      context.driver === "fs" ? await this._readFileContent(context.storagePath) : null;
    const responses = [];
    const baseRequest = options.request ? { ...options.request } : {};
    try {
      var i;
      for (i = 0; i < payloads.length; i++) {
        const payload = payloads[i];
        const request = {
          ...baseRequest,
          targetName,
          payload: payload,
          actor: options.actor || baseRequest.actor,
          persist: options.persist || baseRequest.persist
        };
        responses.push(await this.createEntity(request));
      }
      return responses;
    } catch (error) {
      if (context.driver === "fs") {
        await this.actionFS.writeFile(context.storagePath, snapshot || "");
      }
      throw error;
    }
  }

  async updateMany(targetName, updates, options = {}) {
    if (!Array.isArray(updates)) {
      throw new Error("updateMany requires an array of update descriptors");
    }
    if (updates.length === 0) {
      return [];
    }
    const context = this._resolveTargetStorage(targetName);
    const snapshot =
      context.driver === "fs" ? await this._readFileContent(context.storagePath) : null;
    const responses = [];
    try {
      var i;
      for (i = 0; i < updates.length; i++) {
        const entry = updates[i];
        const key = entry.key || entry.id;
        const changes = entry.updates || entry.payload || {};
        responses.push(await this.updateEntity(targetName, key, changes));
      }
      return responses;
    } catch (error) {
      if (context.driver === "fs") {
        await this.actionFS.writeFile(context.storagePath, snapshot || "");
      }
      throw error;
    }
  }

  async deleteMany(targetName, keys, options = {}) {
    if (!Array.isArray(keys)) {
      throw new Error("deleteMany requires an array of keys");
    }
    if (keys.length === 0) {
      return [];
    }
    const context = this._resolveTargetStorage(targetName);
    const snapshot =
      context.driver === "fs" ? await this._readFileContent(context.storagePath) : null;
    const results = [];
    try {
      var i;
      for (i = 0; i < keys.length; i++) {
        const entry = keys[i];
        const key = typeof entry === "object" ? entry.key || entry.id : entry;
        results.push(await this.deleteEntity(targetName, key));
      }
      return results;
    } catch (error) {
      if (context.driver === "fs") {
        await this.actionFS.writeFile(context.storagePath, snapshot || "");
      }
      throw error;
    }
  }

  /*
    Driver path builder ensures each medium has a consistent namespace.
    - FS uses the configured file/extension.
    - localStorage and IndexedDB store entries keyed by the entity name plus a generated id.
  */
  _resolveDriverPath(driver, targetName, storage, record) {
    const idPart = record.id || `${targetName}:${Date.now()}`;
    if (driver === "localstorage") {
      return `localStorage:${targetName}:${idPart}`;
    }
    if (driver === "idb") {
      return `indexedDB:${targetName}:${idPart}`;
    }
    // fallback to fs path
    const basePath = storage.path || "./data";
    const fileName = storage.file || `${targetName}.${storage.format || "json"}`;
    return basePath.endsWith("/") ? `${basePath}${fileName}` : `${basePath}/${fileName}`;
  }

  /*
    Dispatch persistence to the selected driver.
    FS appends to files, localStorage uses a namespaced key, and IndexedDB records use the actionIDB helper.
  */
  async _dispatchPersistence(driver, storagePath, record, serialized) {
    switch (driver) {
      case "localstorage":
        if (!this.actionLocalStorage) {
          throw new Error("localStorage is not available in this runtime");
        }
        this.actionLocalStorage.setItem(storagePath, record);
        break;
      case "idb":
        if (!this.actionIDB) {
          throw new Error("IndexedDB is not available in this runtime");
        }
        await this.actionIDB.put({ id: record.id || storagePath, ...record });
        break;
      case "fs":
      default:
        await this.actionFS.appendFile(storagePath, serialized);
        break;
    }
  }

  _serializeRecord(storage, record) {
    const format = (storage && storage.format) || "json";
    var handler = this._getFormatHandler(format);
    if (!handler) {
      handler = this._getFormatHandler("json");
    }
    if (!handler) {
      return `${JSON.stringify(record)}\n`;
    }
    if (format === "csv") {
      const headers = storage.headers || Object.keys(record);
      var self = this;
      return handler.serialize(record, headers, function(header, rec) {
        return self._resolveHeaderValue(header, rec);
      });
    }
    return handler.serialize(record);
  }

  _resolveFsPath(storage, targetName) {
    const basePath = storage.path || "./data";
    const fileName = storage.file || `${targetName}.${storage.format || "json"}`;
    const extension = storage.format === "csv" ? ".csv" : storage.format === "json" ? ".json" : "";
    const normalizedFile = fileName.endsWith(extension) ? fileName : `${fileName}${extension}`;
    return basePath.endsWith("/") ? `${basePath}${normalizedFile}` : `${basePath}/${normalizedFile}`;
  }

  _resolveTargetStorage(targetName) {
    const entityConfig = this.entityConfigs[targetName];
    if (!entityConfig) {
      return { entityConfig: null };
    }
    const storage = entityConfig.storage || {};
    const driver = (storage.driver || "fs").toLowerCase();
    const storagePath =
      driver === "fs"
        ? this._resolveFsPath(storage, targetName)
        : this._resolveDriverPath(driver, targetName, storage, {});
    const keyField = storage.keyField || "id";
    return {
      entityConfig,
      storage,
      driver,
      storagePath,
      keyField
    };
  }

  async _loadFsRecords(storagePath, storage, entityConfig) {
    try {
      const rawContent = await this._readFileContent(storagePath);
      const { content, encoding } = this._detectEncoding(rawContent);
      if (!content) {
        return [];
      }
      var format = (storage && storage.format) || "json";
      if (format === "csv") {
        const rows = this._splitCsvRows(content);
        if (rows.length === 0) {
          return [];
        }
        const headerLine = rows.shift();
        const actualHeaders = this._parseCsvLine(headerLine);
        var headers =
          storage.headers && storage.headers.length > 0
            ? storage.headers
            : actualHeaders;
        if (storage.headers && storage.headers.length > 0) {
          this._ensureHeadersMatch(actualHeaders, storage.headers);
        }
        const normalizedHeaders = this._validateCsvHeaders(entityConfig, headers, storage);
        storage.encoding = encoding;
        const schema =
          (entityConfig && (entityConfig.dbSchema || entityConfig.schema)) || {};
        const schemaProperties = schema.properties || {};
        var csvRecords = [];
        var j;
        for (j = 0; j < rows.length; j++) {
          const values = this._parseCsvLine(rows[j]);
          const record = this._buildRecordFromCsv(normalizedHeaders, values, schemaProperties);
          csvRecords.push(record);
        }
        return csvRecords;
      }
      const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
      var handler = this._getFormatHandler(format);
      if (handler) {
        var parsed = [];
        var l;
        for (l = 0; l < lines.length; l++) {
          parsed.push(handler.deserialize(lines[l]));
        }
        return parsed;
      }
      var fallback = [];
      var m;
      for (m = 0; m < lines.length; m++) {
        fallback.push(JSON.parse(lines[m]));
      }
      return fallback;
    } catch {
      return [];
    }
  }

  _detectEncoding(content) {
    if (!content) {
      return { content: "", encoding: "utf8" };
    }
    if (content.charCodeAt(0) === 0xfeff) {
      return { content: content.slice(1), encoding: "utf8-bom" };
    }
    return { content, encoding: "utf8" };
  }

  _splitCsvRows(content) {
    var rows = [];
    var current = "";
    var inQuotes = false;
    for (var i = 0; i < content.length; i++) {
      var char = content[i];
      if (char === '"') {
        if (content[i + 1] === '"') {
          current += '"';
          i++;
          continue;
        }
        inQuotes = !inQuotes;
        continue;
      }
      if (char === "\r") {
        continue;
      }
      if (char === "\n") {
        if (inQuotes) {
          current += "\n";
          continue;
        }
        rows.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    if (current.length > 0) {
      rows.push(current);
    }
    return rows.filter((row) => row.trim().length > 0);
  }

  _buildRecordFromCsv(headers, values, schemaProperties) {
    var record = {};
    var i;
    for (i = 0; i < headers.length; i++) {
      const header = headers[i];
      const rawValue = values[i] !== undefined ? values[i] : "";
      const schema = schemaProperties ? schemaProperties[header] : null;
      const casted = this._castCsvValue(rawValue, schema);
      this._assignCsvValue(record, header, casted);
    }
    return record;
  }

  _assignCsvValue(record, header, value) {
    if (header.indexOf("meta_") === 0) {
      const metaKey = header.replace("meta_", "");
      record.meta = record.meta || {};
      record.meta[metaKey] = value;
      return;
    }
    record[header] = value;
  }

  _castCsvValue(value, schema) {
    if (value === null || value === undefined) {
      return value;
    }
    var raw = typeof value === "string" ? value.trim() : value;
    if (!schema || !schema.type) {
      return raw;
    }
    switch (schema.type) {
      case "integer": {
        if (raw === "") {
          return null;
        }
        const parsed = parseInt(raw, 10);
        return isNaN(parsed) ? raw : parsed;
      }
      case "number": {
        if (raw === "") {
          return null;
        }
        const parsed = parseFloat(raw);
        return isNaN(parsed) ? raw : parsed;
      }
      case "boolean": {
        if (typeof raw === "string") {
          return /^(true|1)$/i.test(raw);
        }
        return Boolean(raw);
      }
      case "array": {
        if (typeof raw === "string" && raw.startsWith("[")) {
          try {
            return JSON.parse(raw);
          } catch {
            return raw;
          }
        }
        return Array.isArray(raw) ? raw : [raw];
      }
      case "object": {
        if (typeof raw === "string" && raw.startsWith("{")) {
          try {
            return JSON.parse(raw);
          } catch {
            return raw;
          }
        }
        return typeof raw === "object" ? raw : { value: raw };
      }
      default:
        return raw;
    }
  }

  _validateCsvHeaders(entityConfig, headers, storage) {
    const normalized = this._normalizeHeaders(headers);
    if (normalized.length === 0) {
      throw new Error("CSV headers must contain at least one field");
    }
    const uniques = new Set(normalized);
    if (uniques.size !== normalized.length) {
      throw new Error("CSV headers must be unique");
    }
    const schema = (entityConfig && (entityConfig.dbSchema || entityConfig.schema)) || {};
    const required = Array.isArray(schema.required) ? schema.required : [];
    var missing = [];
    var i;
    for (i = 0; i < required.length; i++) {
      if (normalized.indexOf(required[i]) === -1) {
        missing.push(required[i]);
      }
    }
    if (missing.length > 0) {
      throw new Error(`CSV missing required headers: ${missing.join(", ")}`);
    }
    const properties = schema.properties || {};
    var unsupported = [];
    for (i = 0; i < normalized.length; i++) {
      const header = normalized[i];
      if (header.indexOf("meta_") === 0) {
        continue;
      }
      if (!properties[header]) {
        unsupported.push(header);
      }
    }
    if (unsupported.length > 0) {
      throw new Error(`CSV headers do not match schema: ${unsupported.join(", ")}`);
    }
    storage.headers = normalized;
    return normalized;
  }

  _normalizeHeaders(headers) {
    if (!Array.isArray(headers)) {
      return [];
    }
    var normalized = [];
    var i;
    for (i = 0; i < headers.length; i++) {
      const value = headers[i];
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
          normalized.push(trimmed);
        }
      } else {
        normalized.push(value);
      }
    }
    return normalized;
  }

  _ensureHeadersMatch(actual, configured) {
    const normalizedActual = this._normalizeHeaders(actual);
    const normalizedConfigured = this._normalizeHeaders(configured);
    if (normalizedActual.length !== normalizedConfigured.length) {
      throw new Error("CSV headers do not match configured headers");
    }
    var i;
    for (i = 0; i < normalizedActual.length; i++) {
      if (normalizedActual[i] !== normalizedConfigured[i]) {
        throw new Error("CSV headers do not match configured headers");
      }
    }
  }

  async _loadBrowserRecords(driver, context) {
    if (driver === "localstorage") {
      return this._loadLocalStorageRecords(context);
    }
    if (driver === "idb") {
      return this._loadIdbRecords();
    }
    return [];
  }

  async _loadLocalStorageRecords(context) {
    if (!this.actionLocalStorage) {
      throw new Error("localStorage driver unavailable in this runtime");
    }
    const prefix = `localStorage:${context.entityConfig.id}:`;
    var keys = this.actionLocalStorage.listKeysWithPrefix(prefix);
    var records = [];
    var n;
    for (n = 0; n < keys.length; n++) {
      var value = this.actionLocalStorage.getItem(keys[n]);
      if (value) {
        records.push(value);
      }
    }
    return records;
  }

  async _loadIdbRecords() {
    if (!this.actionIDB) {
      return [];
    }
    return this.actionIDB.getAll();
  }

  _parseCsvLine(line) {
    var result = [];
    var current = "";
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var char = line[i];
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
          continue;
        }
        inQuotes = !inQuotes;
        continue;
      }
      if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    result.push(current);
    return result;
  }

  async _persistRecordsFs(storagePath, records, storage) {
    if (!records || records.length === 0) {
      await this.actionFS.writeFile(storagePath, "");
      return;
    }
    if (storage.format === "csv") {
      const headers = storage.headers || Object.keys(records[0]);
      var lines = [];
      var p;
      for (p = 0; p < records.length; p++) {
        var row = [];
        var q;
        for (q = 0; q < headers.length; q++) {
          row.push(this._resolveHeaderValue(headers[q], records[p]));
        }
        lines.push(row.join(","));
      }
      var content = headers.join(",") + "\n" + lines.join("\n") + "\n";
      await this.actionFS.writeFile(storagePath, content);
      return;
    }
    var textLines = [];
    var r;
    for (r = 0; r < records.length; r++) {
      textLines.push(JSON.stringify(records[r]));
    }
    await this.actionFS.writeFile(storagePath, textLines.join("\n") + "\n");
  }

  _resolveHeaderValue(header, record) {
    if (!record) {
      return "";
    }
    if (header.indexOf("meta_") === 0) {
      const metaKey = header.replace("meta_", "");
      return this._escapeCsv((record.meta && record.meta[metaKey]) || "");
    }
    return this._escapeCsv(record[header] || "");
  }

  _escapeCsv(value) {
    if (value === null || value === undefined) {
      return "";
    }
    const stringValue = String(value);
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  _cloneResponseSchema() {
    return JSON.parse(JSON.stringify(ActionEntityResponseSchema));
  }

  _prepareResponse(targetName, record, metaValues, operation = "create") {
    const response = this._cloneResponseSchema();
    response.action = `entity.${targetName}.${operation}`;
    response.payload = {
      ...response.payload,
      targetName: targetName,
      record: record
    };
    response.meta = {
      ...response.meta,
      ...metaValues
    };
    return response;
  }

  async _runHooks(event, targetName, record, metadata = {}) {
    const handlers = this.hooks[event] || [];
    const context = {
      targetName,
      record,
      metadata
    };
    const executionResults = [];
    if (!handlers.length) {
      return executionResults;
    }
    const executed = new Set();
    var iterations = 0;
    const maxIterations = handlers.length * 3;
    while (executed.size < handlers.length && iterations < maxIterations) {
      var progressed = false;
      var i;
      for (i = 0; i < handlers.length; i++) {
        const entry = handlers[i];
        if (executed.has(entry.id)) {
          continue;
        }
        const dependencies = entry.dependsOn || [];
        var ready = true;
        var j;
        for (j = 0; j < dependencies.length; j++) {
          if (!executed.has(dependencies[j])) {
            ready = false;
            break;
          }
        }
        if (!ready) {
          continue;
        }
        if (entry.condition && !entry.condition(context)) {
          executionResults.push({ entryId: entry.id, skipped: true });
          executed.add(entry.id);
          progressed = true;
          continue;
        }
        try {
          const result = await this._executeHookEntry(entry, context);
          if (result && typeof result === "object" && result.valid === false) {
            throw new Error(result.message || `Hook ${entry.id} returned invalid state`);
          }
          executionResults.push({ entryId: entry.id, result });
          executed.add(entry.id);
          progressed = true;
        } catch (error) {
          executionResults.push({ entryId: entry.id, error });
          executed.add(entry.id);
          progressed = true;
          if (entry.errorStrategy === "warn") {
            console.warn(`[ActionEntity hook][${entry.id}]`, error.message);
          }
          if (entry.errorStrategy === "abort") {
            throw error;
          }
        }
      }
      if (!progressed) {
        break;
      }
      iterations++;
    }
    return executionResults;
  }

  async _executeHookEntry(entry, context) {
    const invoke = () => Promise.resolve(entry.handler(context));
    if (entry.timeout > 0) {
      let timer;
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Hook ${entry.id} timed out after ${entry.timeout}ms`));
        }, entry.timeout);
      });
      try {
        const result = await Promise.race([invoke(), timeoutPromise]);
        clearTimeout(timer);
        return result;
      } catch (error) {
        clearTimeout(timer);
        throw error;
      }
    }
    return invoke();
  }

  getPersistedRecords() {
    return this.memoryRecordLines.slice(0);
  }

  async _readFileContent(storagePath) {
    if (!this.actionFS) {
      return "";
    }
    try {
      return await this.actionFS.readFile(storagePath);
    } catch {
      return "";
    }
  }

  async _ensureCsvHeader(storagePath, headers) {
    const headerLine = headers.join(",");
    try {
      const content = await this._readFileContent(storagePath);
      if (!content) {
        return false;
      }
      const firstLine = content.split(/\r?\n/)[0];
      if (firstLine.trim() === headerLine) {
        return true;
      }
      // Prepend header if missing but file already exists.
      await this.actionFS.writeFile(storagePath, `${headerLine}\n${content}`);
      return true;
    } catch {
      return false;
    }
  }
}

class EntityQueryBuilder {
  constructor(actionEntity, targetName) {
    this.actionEntity = actionEntity;
    this.targetName = targetName;
    this.context = this.actionEntity._resolveTargetStorage(targetName);
    this.filters = [];
    this.sorts = [];
    this.limitValue = 0;
    this.offsetValue = 0;
    this.cursorInfo = null;
  }

  where(field, operator = "eq", value) {
    return this._addFilter("and", field, operator, value);
  }

  andWhere(field, operator = "eq", value) {
    return this.where(field, operator, value);
  }

  orWhere(field, operator = "eq", value) {
    return this._addFilter("or", field, operator, value);
  }

  wherePredicate(predicate, logical = "and") {
    if (typeof predicate === "function") {
      this.filters.push({ logical, predicate });
    }
    return this;
  }

  whereGroup(logical, callback) {
    if (typeof callback !== "function") {
      return this;
    }
    const builder = new EntityQueryBuilder(this.actionEntity, this.targetName);
    callback(builder);
    const predicate = (record) => builder._evaluateFilters(record);
    this.filters.push({ logical, predicate });
    return this;
  }

  text(field, value) {
    return this.where(field, "text", value);
  }

  range(field, min, max) {
    return this.where(field, "range", [min, max]);
  }

  sort(field, direction = "asc") {
    this.sorts.push({ field, direction: this._normalizeDirection(direction) });
    return this;
  }

  limit(count) {
    this.limitValue = Math.max(0, Number(count) || 0);
    return this;
  }

  offset(count) {
    this.offsetValue = Math.max(0, Number(count) || 0);
    return this;
  }

  pageSize(count) {
    return this.limit(count);
  }

  cursor(field, value, direction = "asc") {
    this.cursorInfo = {
      field,
      value,
      direction: this._normalizeDirection(direction)
    };
    return this;
  }

  async execute(options = {}) {
    const records = await this._loadRecords();
    const filtered = records.filter((record) => this._evaluateFilters(record));
    const sorted = this._applySort(filtered);
    const cursorApplied = this._applyCursor(sorted);
    const offset = options.offset !== undefined ? options.offset : this.offsetValue;
    const withOffset = offset ? cursorApplied.slice(offset) : cursorApplied;
    const limit =
      options.limit !== undefined ? options.limit : this.limitValue || withOffset.length;
    const page = limit > 0 ? withOffset.slice(0, limit) : withOffset;
    const nextCursor = this._computeNextCursor(page, limit);
    return {
      records: page,
      totalCount: filtered.length,
      offset: offset,
      limit: limit,
      nextCursor: nextCursor
    };
  }

  async _loadRecords() {
    if (!this.context || !this.context.entityConfig) {
      return [];
    }
    if (this.context.driver === "fs") {
      return this.actionEntity._loadFsRecords(
        this.context.storagePath,
        this.context.storage,
        this.context.entityConfig
      );
    }
    return this.actionEntity._loadBrowserRecords(this.context.driver, this.context);
  }

  _evaluateFilters(record) {
    if (!this.filters.length) {
      return true;
    }
    const andFilters = this.filters.filter((f) => f.logical !== "or");
    const orFilters = this.filters.filter((f) => f.logical === "or");
    const andValid = andFilters.every((filter) => filter.predicate(record));
    const orValid = orFilters.length === 0 || orFilters.some((filter) => filter.predicate(record));
    return andValid && orValid;
  }

  _applySort(records) {
    if (!this.sorts.length) {
      return records;
    }
    const sorted = records.slice(0);
    sorted.sort((a, b) => {
      var i;
      for (i = 0; i < this.sorts.length; i++) {
        const rule = this.sorts[i];
        const dir = rule.direction === "desc" ? -1 : 1;
        const av = this._resolvePath(a, rule.field);
        const bv = this._resolvePath(b, rule.field);
        if (av < bv) {
          return -1 * dir;
        }
        if (av > bv) {
          return 1 * dir;
        }
      }
      return 0;
    });
    return sorted;
  }

  _applyCursor(records) {
    if (!this.cursorInfo || !this.cursorInfo.field) {
      return records;
    }
    const direction = this.cursorInfo.direction;
    var index = 0;
    while (index < records.length) {
      const current = this._resolvePath(records[index], this.cursorInfo.field);
      if (direction === "desc") {
        if (current < this.cursorInfo.value) {
          break;
        }
      } else {
        if (current > this.cursorInfo.value) {
          break;
        }
      }
      index++;
    }
    return records.slice(index);
  }

  _computeNextCursor(page, limit) {
    if (!page || page.length === 0) {
      return null;
    }
    if (limit <= 0 || page.length < limit) {
      return null;
    }
    const referenceField =
      (this.cursorInfo && this.cursorInfo.field) ||
      (this.sorts[0] && this.sorts[0].field);
    if (!referenceField) {
      return null;
    }
    const lastValue = this._resolvePath(page[page.length - 1], referenceField);
    return {
      field: referenceField,
      value: lastValue,
      direction:
        (this.cursorInfo && this.cursorInfo.direction) ||
        (this.sorts[0] && this.sorts[0].direction) ||
        "asc"
    };
  }

  _addFilter(logical, field, operator, value) {
    const predicate =
      typeof field === "function" && !operator
        ? field
        : this._createPredicate(field, operator, value);
    if (predicate) {
      this.filters.push({ logical, predicate });
    }
    return this;
  }

  _createPredicate(field, operator, comparison) {
    const op = (operator || "eq").toLowerCase();
    return (record) => {
      const actual = this._resolvePath(record, field);
      switch (op) {
        case "eq":
        case "equals":
          return actual === comparison;
        case "neq":
        case "not":
        case "not_equals":
          return actual !== comparison;
        case "gt":
        case ">":
          return actual > comparison;
        case "gte":
        case ">=":
          return actual >= comparison;
        case "lt":
        case "<":
          return actual < comparison;
        case "lte":
        case "<=":
          return actual <= comparison;
        case "contains":
          return (
            typeof actual === "string" &&
            typeof comparison === "string" &&
            actual.toLowerCase().includes(comparison.toLowerCase())
          );
        case "text":
          return (
            typeof actual === "string" &&
            actual.toLowerCase().includes(String(comparison).toLowerCase())
          );
        case "range":
        case "between": {
          if (!Array.isArray(comparison) || comparison.length < 2) {
            return false;
          }
          return actual >= comparison[0] && actual <= comparison[1];
        }
        case "in":
          return Array.isArray(comparison) && comparison.includes(actual);
        case "notin":
          return Array.isArray(comparison) && !comparison.includes(actual);
        case "regex": {
          try {
            const re = new RegExp(comparison);
            return re.test(actual);
          } catch {
            return false;
          }
        }
        default:
          return actual === comparison;
      }
    };
  }

  _resolvePath(record, path) {
    if (!record || !path) {
      return undefined;
    }
    const parts = String(path).split(".");
    var value = record;
    var i;
    for (i = 0; i < parts.length; i++) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[parts[i]];
    }
    return value;
  }

  _normalizeDirection(direction) {
    return direction === "desc" ? "desc" : "asc";
  }
}
