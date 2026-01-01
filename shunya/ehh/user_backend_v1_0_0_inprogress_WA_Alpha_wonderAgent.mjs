/*
Overview: Implements the manifest-aligned ActionApp/ActionEntity backend for version 1 user/session create flows.
Purpose: Run the very same code base in Node to obey the request/response contract, reuse ActionFS/localStorage/indexDb helpers, and honor the schema+RBAC described in the configs.
Audience: Developers and QA engineers who want demonstrable API routes that follow the manifest’s classes/methods, storage layers, and validation rules.
Problem Addressed: Prior proofs-of-concept diverged from the approved design, so this file rebuilds the stack class-by-class and executes the create operations sequentially per your instruction.
Use Cases: POST `/api/v1/users` to create a registered user and `/api/v1/user-sessions` to create a session, with each step logged and validated.
Features: ActionFS file helpers, ActionLocalStorage shim, ActionIndexDb persistence, ActionEntity CRUD + runtime helpers, ActionApp orchestration, and a lightweight HTTP server.
Benefits: Matches the manifest exactly, produces consistent logs, keeps storage format aligned with sample configs, and demonstrates that the same classes run in node/browser.
User Stories: As a developer I can instantiate ActionApp, create the ActionEntity for each plan, run its create method, and see the results persisted; as a reviewer I can read the manifest while inspecting the actual classes running.
User Flow: Launch ActionApp, verify ActionFS/LocalStorage/IndexDb available, send POST payloads, receive schema-driven responses, and inspect JSON/JSONL files.
System Components: ConfigLoader, SchemaValidator, RBACService, ActionFS, ActionLocalStorage, ActionIndexDb, ActionEntity, ActionApp, and BackendServer.
Edge Cases: Missing config files, validation errors, RBAC denials, unsupported storage formats, missing folders.
Test Cases: POST valid and invalid user/session payloads, confirm RBAC denies unauthorized roles, ensure JSON/JSONL files update, and assert consistent responses.
Configuration: Reads export-honed sample configs at `shunya/config/sample`.
Schema: User register requires username/email/password/role, user session adds tokens/timestamps/status.
*/

import { createServer } from 'node:http';
import { appendFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, '..');
const sampleConfigRoot = resolve(workspaceRoot, 'config', 'sample');
const dataRoot = resolve(workspaceRoot, 'data');

class ActionFS {
  async readFile(target, encoding = 'utf8') {
    return readFile(target, encoding);
  }

  async writeFile(target, payload, encoding = 'utf8') {
    await writeFile(target, payload, encoding);
  }

  async exists(target) {
    try {
      await stat(target);
      return true;
    } catch {
      return false;
    }
  }

  async ensureDir(target) {
    await mkdir(target, { recursive: true });
  }

  async remove(target) {
    await stat(target);
    await writeFile(target, '');
  }
}

class ActionLocalStorage {
  constructor(namespace = 'ehh_v1') {
    this.namespace = namespace;
    this.store = new Map();
  }

  setItem(key, value) {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    this.store.set(`${this.namespace}:${key}`, payload);
  }

  getItem(key) {
    const entry = this.store.get(`${this.namespace}:${key}`);
    if (!entry) {
      return null;
    }
    try {
      return JSON.parse(entry);
    } catch {
      return entry;
    }
  }

  removeItem(key) {
    this.store.delete(`${this.namespace}:${key}`);
  }

  clear() {
    const prefix = `${this.namespace}:`;
    const keys = Array.from(this.store.keys());
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i].startsWith(prefix)) {
        this.store.delete(keys[i]);
      }
    }
  }

  _resolveValue(value) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  snapshot() {
    const entries = [];
    const prefix = `${this.namespace}:`;
    this.store.forEach((value, key) => {
      if (!key.startsWith(prefix)) {
        return;
      }
      entries.push({
        key: key.slice(prefix.length),
        value: this._resolveValue(value)
      });
    });
    return entries;
  }
}

class ActionEvent {
  constructor() {
    this.listeners = [];
    this.changeLog = [];
  }

  addListener(target, eventName, handler) {
    this.listeners.push({ target, eventName, handler });
    this.changeLog.push(`[${new Date().toISOString()}] added ${eventName} to ${target}`);
  }

  bind() {
    for (let i = 0; i < this.listeners.length; i += 1) {
      const listener = this.listeners[i];
      const resolved = this._resolveTarget(listener.target);
      if (resolved && typeof resolved.addEventListener === 'function') {
        resolved.addEventListener(listener.eventName, listener.handler);
      }
    }
  }

  _resolveTarget(name) {
    if (name === 'window' && typeof window !== 'undefined') {
      return window;
    }
    if (name === 'document' && typeof document !== 'undefined') {
      return document;
    }
    return null;
  }

  _describeTarget(target) {
    return typeof target === 'string' ? target : 'custom';
  }
}

class ActionView {
  constructor(rootId = 'appview') {
    this.viewRootId = rootId;
  }

  render(html, context = {}) {
    if (typeof document === 'undefined') {
      return '';
    }
    const root = document.getElementById(this.viewRootId);
    if (!root) {
      return '';
    }
    root.innerHTML = this._applyContext(html, context);
    return root.innerHTML;
  }

  renderToString(html, context = {}) {
    return this._applyContext(html, context);
  }

  _applyContext(html, context) {
    let result = html;
    const keys = Object.keys(context);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const token = new RegExp(`\\$\\{${key}\\}`, 'g');
      result = result.replace(token, context[key]);
    }
    return result;
  }
}

class ActionClient {
  constructor(baseUrl = 'http://localhost:4173') {
    this.baseUrl = baseUrl;
  }

  async request(path, method, body) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    return response.json();
  }

  createUser(payload) {
    return this.request('/api/v1/users', 'POST', payload);
  }

  createSession(payload) {
    return this.request('/api/v1/user-sessions', 'POST', payload);
  }
}

class ActionIndexDb {
  constructor(basePath) {
    this.basePath = basePath;
    this.file = resolve(this.basePath, 'indexdb.json');
  }

  async openDatabase() {
    await mkdir(this.basePath, { recursive: true });
    if (!(await this.exists(this.file))) {
      await writeFile(this.file, '[]', 'utf8');
    }
  }

  async exists(target) {
    try {
      await stat(target);
      return true;
    } catch {
      return false;
    }
  }

  async saveRecord(record) {
    const current = await this.readAll();
    current.push(record);
    await writeFile(this.file, JSON.stringify(current, null, 2), 'utf8');
    return record;
  }

  async readAll() {
    const raw = await readFile(this.file, 'utf8');
    return JSON.parse(raw || '[]');
  }

  async deleteRecord(id) {
    const rows = await this.readAll();
    const filtered = rows.filter(entry => entry._id !== id);
    await writeFile(this.file, JSON.stringify(filtered, null, 2), 'utf8');
    return filtered.length !== rows.length;
  }
}

class SchemaValidator {
  constructor() {
    this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  }

  validate(definition, payload) {
    const schema = definition.dbSchema || {};
    const props = schema.properties || {};
    const errors = [];
    const keys = Object.keys(props);

    for (let i = 0; i < keys.length; i += 1) {
      const field = keys[i];
      const config = props[field];
      if (!config) {
        continue;
      }
      const value = payload[field];
      const rules = config.validate || {};

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: 'required' });
      }

      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push({ field, message: 'minLength ' + rules.minLength });
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push({ field, message: 'maxLength ' + rules.maxLength });
        }
      }

      if (rules.format === 'email' && value && !this.emailRegex.test(value)) {
        errors.push({ field, message: 'invalid email' });
      }

      if (config.type && value !== undefined && value !== null) {
        if (config.type === 'number' && typeof value !== 'number') {
          errors.push({ field, message: 'must be number' });
        }
        if (config.type === 'string' && typeof value !== 'string') {
          errors.push({ field, message: 'must be string' });
        }
      }
    }

    if (errors.length > 0) {
      const error = new Error('Validation failed');
      error.details = errors;
      throw error;
    }

    return true;
  }
}

class RBACService {
  allow(policy, role, operation) {
    if (!policy || !policy.rbac) {
      return true;
    }
    const rules = policy.rbac[role] || [];
    for (let i = 0; i < rules.length; i += 1) {
      if (rules[i] === '*' || rules[i] === operation) {
        return true;
      }
    }
    return false;
  }
}

class ActionEntity {
  constructor(name, definition, dependencies) {
    this.name = name;
    this.definition = definition;
    this.dependencies = dependencies;
    this.storageFile = definition.storage ? definition.storage.file : `${name}.json`;
    this.storagePath = resolve(dependencies.dataRoot, definition.storage ? definition.storage.path : '');
  }

  async create(payload, context = {}) {
    this.dependencies.validator.validate(this.definition, payload);
    const role = context.user ? context.user.role : 'guest';
    if (!this.dependencies.rbac.allow(this.definition.policy, role, 'create')) {
      const error = new Error('RBAC denied create');
      error.status = 403;
      throw error;
    }

    const record = this.enrich(payload, context);
    await this.dependencies.fs.ensureDir(this.storagePath);

    const targetFile = resolve(this.storagePath, this.storageFile);
    if (this.definition.storage && this.definition.storage.format === 'jsonl') {
      await appendFile(targetFile, JSON.stringify(record) + '\n', 'utf8');
    } else {
      const existing = (await this.dependencies.fs.exists(targetFile))
        ? JSON.parse(await this.dependencies.fs.readFile(targetFile, 'utf8'))
        : [];
      existing.push(record);
      await this.dependencies.fs.writeFile(targetFile, JSON.stringify(existing, null, 2), 'utf8');
    }

    return this.formatResponse('create', record);
  }

  async read(filter = {}) {
    const targetFile = resolve(this.storagePath, this.storageFile);
    if (!(await this.dependencies.fs.exists(targetFile))) {
      return this.formatResponse('read', []);
    }
    const raw = await this.dependencies.fs.readFile(targetFile, 'utf8');
    const parsed = raw ? JSON.parse(raw) : [];
    if (!filter || typeof filter !== 'object') {
      return this.formatResponse('read', parsed);
    }
    let result = parsed;
    if (filter.search) {
      result = this.applySearch(result, filter.search);
    }
    if (filter.filter) {
      result = this.applyFilter(result, filter.filter);
    }
    if (filter.sort) {
      result = this.applySort(result, filter.sort);
    }
    return this.formatResponse('read', result);
  }

  async update(id, payload, context = {}) {
    const targetFile = resolve(this.storagePath, this.storageFile);
    if (!(await this.dependencies.fs.exists(targetFile))) {
      throw new Error('Not found');
    }
    const raw = await this.dependencies.fs.readFile(targetFile, 'utf8');
    const parsed = raw ? JSON.parse(raw) : [];
    let updated = null;
    for (let i = 0; i < parsed.length; i += 1) {
      if (parsed[i]._id === id) {
        parsed[i] = Object.assign({}, parsed[i], payload, this.metadata(context));
        updated = parsed[i];
        break;
      }
    }
    await this.dependencies.fs.writeFile(targetFile, JSON.stringify(parsed, null, 2), 'utf8');
    return this.formatResponse('update', updated);
  }

  async delete(id) {
    const targetFile = resolve(this.storagePath, this.storageFile);
    if (!(await this.dependencies.fs.exists(targetFile))) {
      throw new Error('Not found');
    }
    const raw = await this.dependencies.fs.readFile(targetFile, 'utf8');
    const parsed = raw ? JSON.parse(raw) : [];
    const filtered = parsed.filter(item => item._id !== id);
    await this.dependencies.fs.writeFile(targetFile, JSON.stringify(filtered, null, 2), 'utf8');
    return this.formatResponse('delete', { id, deleted: true });
  }

  async createBrowser(payload, context = {}) {
    const record = await this.create(payload, context);
    this.dependencies.localStorage.setItem(`${this.name}:last`, record.data);
    return record;
  }

  async createNode(payload, context = {}) {
    const record = await this.create(payload, context);
    await this.dependencies.indexDb.saveRecord(record.data);
    return record;
  }

  buildTree(data) {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map(entry => ({ id: entry._id, children: [] }));
  }

  traverse(tree, fn) {
    if (!Array.isArray(tree)) {
      return;
    }
    for (let i = 0; i < tree.length; i += 1) {
      fn(tree[i]);
      if (tree[i].children) {
        this.traverse(tree[i].children, fn);
      }
    }
  }

  flatten(tree) {
    const flat = [];
    this.traverse(tree, node => flat.push(node));
    return flat;
  }

  enrich(payload, context) {
    const record = Object.assign({}, payload);
    const now = new Date().toISOString();
    record._id = record._id || `${this.name}_${Date.now()}`;
    record.metadata = Object.assign({}, record.metadata || {}, {
      createdAt: now,
      createdBy: context.user ? context.user.userId : 'system'
    });
    return record;
  }

  metadata(context) {
    const now = new Date().toISOString();
    return {
      metadata: {
        updatedAt: now,
        updatedBy: context.user ? context.user.userId : 'system'
      }
    };
  }

  formatResponse(operation, result) {
    return {
      success: true,
      operation: `${this.name}.${operation}`,
      timestamp: new Date().toISOString(),
      data: result
    };
  }

  applyFilter(items, filter) {
    if (!filter || typeof filter !== 'object') {
      return items;
    }
    const entries = Object.entries(filter);
    if (!entries.length) {
      return items;
    }
    let results = items;
    for (let i = 0; i < entries.length; i += 1) {
      const [field, value] = entries[i];
      if (value === undefined || value === null) {
        continue;
      }
      const needle = Array.isArray(value) ? value.map(v => v.toString()) : [value.toString()];
      results = results.filter(entry => {
        const entryValue = entry[field];
        if (entryValue === undefined || entryValue === null) {
          return false;
        }
        const normalized = entryValue.toString();
        return needle.includes(normalized);
      });
    }
    return results;
  }

  applySearch(items, search) {
    if (!search) {
      return items;
    }
    const normalized = search.toString().toLowerCase();
    return items.filter(entry => {
      const values = Object.values(entry);
      for (let i = 0; i < values.length; i += 1) {
        const candidate = values[i];
        if (candidate === undefined || candidate === null) {
          continue;
        }
        if (candidate.toString().toLowerCase().indexOf(normalized) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  applySort(items, sort) {
    if (!sort) {
      return items;
    }
    const instructions = [];
    if (typeof sort === 'string') {
      instructions.push(sort);
    } else if (Array.isArray(sort)) {
      sort.forEach(inst => instructions.push(inst));
    } else if (typeof sort === 'object') {
      Object.entries(sort).forEach(([key, value]) => {
        instructions.push(`${key}:${value}`);
      });
    }
    if (!instructions.length) {
      return items;
    }
    return [...items].sort((a, b) => {
      for (let i = 0; i < instructions.length; i += 1) {
        const [field, direction] = instructions[i].split(':');
        const dir = (direction || 'asc').toLowerCase();
        const left = a[field];
        const right = b[field];
        if (left === right) {
          continue;
        }
        if (left === undefined || left === null) {
          return dir === 'desc' ? 1 : -1;
        }
        if (right === undefined || right === null) {
          return dir === 'desc' ? -1 : 1;
        }
        if (left < right) {
          return dir === 'desc' ? 1 : -1;
        }
        if (left > right) {
          return dir === 'desc' ? -1 : 1;
        }
      }
      return 0;
    });
  }
}

class ActionApp {
  constructor(options = {}) {
    this.port = options.port || 4173;
    this.runtime = 'node';
    this.fs = new ActionFS();
    this.localStorage = new ActionLocalStorage();
    this.indexDb = new ActionIndexDb(resolve(dataRoot, 'indexdb'));
    this.validator = new SchemaValidator();
    this.rbac = new RBACService();
    this.entities = new Map();
    this.configs = null;
  }

  async init() {
    await this.detectRuntime();
    await this.loadConfigs();
    await this.initStorage();
    await this.initEntities();
  }

  async detectRuntime() {
    this.runtime = typeof window === 'undefined' ? 'node' : 'browser';
  }

  async loadConfigs() {
    const loader = new ConfigLoader(sampleConfigRoot);
    this.configs = await loader.loadAll();
  }

  async initStorage() {
    await this.indexDb.openDatabase();
  }

  async initEntities() {
    const user = new ActionEntity('user_register', this.configs.user, {
      fs: this.fs,
      localStorage: this.localStorage,
      indexDb: this.indexDb,
      validator: this.validator,
      rbac: this.rbac,
      dataRoot
    });
    const session = new ActionEntity('user_session', this.configs.session, {
      fs: this.fs,
      localStorage: this.localStorage,
      indexDb: this.indexDb,
      validator: this.validator,
      rbac: this.rbac,
      dataRoot
    });
    this.entities.set('/api/v1/users', user);
    this.entities.set('/api/v1/user-sessions', session);

    if (this.configs.erms && Array.isArray(this.configs.erms.entities)) {
      const baseSchema = this.configs.erms.defaultSchema || {};
      for (let i = 0; i < this.configs.erms.entities.length; i += 1) {
        const entityInfo = this.configs.erms.entities[i];
        const definition = JSON.parse(JSON.stringify(baseSchema));
        definition.id = entityInfo.id;
        definition.name = entityInfo.name;
        definition.storage = {
          driver: 'fs',
          path: `../data/erms/${entityInfo.id}`,
          file: `${entityInfo.id}.json`,
          format: 'json'
        };
        const route = `/api/v1${this.normalizeRoute(entityInfo.id)}`;
        const entityInst = new ActionEntity(entityInfo.id, definition, {
          fs: this.fs,
          localStorage: this.localStorage,
          indexDb: this.indexDb,
          validator: this.validator,
          rbac: this.rbac,
          dataRoot
        });
        this.entities.set(route, entityInst);
      }
    }
  }

  normalizeRoute(value) {
    return '/' + (
      (value || '')
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    );
  }

  async start() {
    await this.init();
    await this.createHttpService(this.port);
  }

  async createHttpService(port) {
    this.httpService = new ActionServer(this, port);
    this.httpService.route('GET', '/api/v1/test/batch', this.handleTestBatch.bind(this));
    return this.httpService.start();
  }

  async handleRequest(req, res) {
    try {
      if (req.method !== 'POST') {
        return this.sendResponse(res, 405, { success: false, message: 'POST only' });
      }

      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const body = Buffer.concat(buffers).toString();
      const payload = body ? JSON.parse(body) : {};

      const entity = this.entities.get(req.url);
      if (!entity) {
        return this.sendResponse(res, 404, { success: false, message: 'Route missing' });
      }

      const context = this.buildContext(req);
      let response;

      if (req.url === '/api/v1/users') {
        response = await entity.createNode(payload, context);
      } else if (req.url === '/api/v1/user-sessions') {
        response = await entity.createNode(payload, context);
      } else {
        response = await entity.create(payload, context);
      }

      this.sendResponse(res, 200, response);
    } catch (error) {
      const status = error.status || 400;
      this.sendResponse(res, status, { success: false, message: error.message, details: error.details || null });
    }
  }

  buildContext(req) {
    return {
      user: {
        userId: req.headers['x-user-id'] || 'guest',
        role: req.headers['x-user-role'] || 'guest'
      },
      requestId: `req_${Date.now()}`
    };
  }

  sendResponse(res, status, payload) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  }

  async handleTestBatch(req, res) {
    try {
      const batch = new ActionTestBatch(this);
      const payload = await batch.report();
      this.sendResponse(res, 200, payload);
    } catch (error) {
      const status = error.status || 500;
      this.sendResponse(res, status, { success: false, message: error.message });
    }
  }
}

class ConfigLoader {
  constructor(basePath) {
    this.basePath = basePath;
  }

  async loadExport(name) {
    const raw = await readFile(resolve(this.basePath, name), 'utf8');
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) {
      throw new Error('Unable to parse export file: ' + name);
    }
    const jsonText = raw.slice(start, end + 1);
    return JSON.parse(jsonText);
  }

  async loadAll() {
    return {
      user: await this.loadExport('entity_user_register_config.txt'),
      session: await this.loadExport('entity_user_session_config.txt'),
      erms: await this.loadExport('dataset_entity_erms_config.txt')
    };
  }
}

class ActionServer {
  constructor(actionApp, port) {
    this.actionApp = actionApp;
    this.port = port;
    this.server = null;
    this.routes = new Map();
  }

  route(method, path, handler) {
    this.routes.set(`${method.toUpperCase()} ${path}`, handler);
  }

  async start() {
    const server = createServer(this.handle.bind(this));
    return new Promise((resolve, reject) => {
      server.listen(this.port, () => {
        this.server = server;
        console.log(`ActionServer listening on port ${server.address().port}`);
        resolve(server);
      });
      server.on('error', reject);
    });
  }

  async listen() {
    return this.start();
  }

  async handle(req, res) {
    try {
      const routeKey = `${req.method.toUpperCase()} ${new URL(req.url, 'http://localhost').pathname}`;
      const handler = this.routes.get(routeKey);
      if (handler) {
        await handler(req, res);
        return;
      }
      await this.defaultHandler(req, res);
    } catch (error) {
      const status = error.status || 400;
      this.actionApp.sendResponse(res, status, { success: false, message: error.message });
    }
  }

  async defaultHandler(req, res) {
    const route = this.parseRoute(req.url);
    const entity = this.actionApp.entities.get(route.base);
    if (!entity) {
      this.actionApp.sendResponse(res, 404, { success: false, message: 'Route missing' });
      return;
    }
    const payload = req.method === 'GET' ? this.parseQueryParams(req.url) : await this.collectBody(req);
    const context = this.actionApp.buildContext(req);
    let response = null;
    if (req.method === 'POST') {
      response = await entity.createNode(payload, context);
    } else if (req.method === 'GET') {
      response = await entity.read(payload);
    } else if (req.method === 'PUT') {
      if (!route.id) throw new Error('Missing id for update');
      response = await entity.update(route.id, payload, context);
    } else if (req.method === 'DELETE') {
      if (!route.id) throw new Error('Missing id for delete');
      response = await entity.delete(route.id);
    } else {
      this.actionApp.sendResponse(res, 405, { success: false, message: 'Method not allowed' });
      return;
    }
    this.actionApp.sendResponse(res, 200, response);
  }

  parseRoute(url) {
    const pathname = new URL(url, 'http://localhost').pathname;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 3) {
      return { base: `/${segments.slice(0, 3).join('/')}`, id: segments[3] };
    }
    return { base: `/${segments.join('/')}`, id: null };
  }

  async collectBody(req) {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const text = Buffer.concat(buffers).toString();
    return text ? JSON.parse(text) : {};
  }

  parseQueryParams(url) {
    const result = {};
    const parsed = new URL(url, 'http://localhost');
    const entries = parsed.searchParams.entries();
    for (const [key, value] of entries) {
      result[key] = this.parseParamValue(value);
    }
    return result;
  }

  parseParamValue(value) {
    if (!value) {
      return value;
    }
    const trimmed = value.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed;
      }
    }
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(part => this.parseParamValue(part));
    }
    return trimmed;
  }
}

/*
Overview: Summarizes RBAC-aware operations per role, local cache snapshots, and IndexedDB contents for batch diagnostics.
Purpose: Feed `/api/v1/test/batch` with deterministic data so QA can validate manifest-aligned permissions and storage state.
Audience: Testers and automation suites that need a single endpoint to inspect RBAC access matrices, LocalStorage caches, and IndexedDB records.
Problem Addressed: Without a consolidated report it is hard to tell which roles can invoke which actions or what the persisted state looks like after CRUD operations.
Use Cases: Run `GET /api/v1/test/batch` after running create/update scenarios to see if roles align with policy, localStorage/local caches contain the expected entries, and IndexedDB has the recorded rows.
Features: Aggregates RBAC policies per entity, snapshots LocalStorage entries, dumps IndexedDB contents, and enumerates entity routes.
Benefits: Provides immediate insight into RBAC operations, caches, and persistent stores while keeping the same request/response contract.
User Stories: "As a QA engineer I can call the batch report before/after tests to ensure the configuration is honored," and "As a developer I can use the report output to verify LocalStorage and IndexedDB states."
User Flow: HTTP GET → ActionServer.route handler → ActionTestBatch.report → JSON response with metadata/operations/storage.
System Components: ActionApp entities, ActionIndexDb, ActionLocalStorage, ActionServer routing.
Edge Cases: Handles missing RBAC data, empty storage, and unavailable IndexedDB outputs gracefully.
Configuration: Respects AppConfig route definitions (`/api/v1/test/batch`) and uses the configured data root/storage paths.
Schema: `{ runtime, timestamp, port, routes, operationsPerRole, localStorage, indexedDb }`
*/
class ActionTestBatch {
  constructor(actionApp) {
    this.actionApp = actionApp;
    this.entities = Array.from(actionApp.entities.values());
  }

  async report() {
    const operationsPerRole = this.buildOperationsPerRole();
    const localStorage = this.actionApp.localStorage.snapshot();
    const indexedDb = await this.actionApp.indexDb.readAll();

    return {
      runtime: this.actionApp.runtime,
      port: this.actionApp.port,
      timestamp: new Date().toISOString(),
      routes: Array.from(this.actionApp.entities.keys()),
      operationsPerRole,
      localStorage,
      indexedDb
    };
  }

  buildOperationsPerRole() {
    const map = {};
    for (let i = 0; i < this.entities.length; i += 1) {
      const entity = this.entities[i];
      const policy = (entity.definition && entity.definition.policy && entity.definition.policy.rbac) || {};
      const entityLabel = entity.definition && entity.definition.id ? entity.definition.id : entity.name;
      const roles = Object.keys(policy);
      for (let j = 0; j < roles.length; j += 1) {
        const role = roles[j];
        if (!map[role]) {
          map[role] = {};
        }
        map[role][entityLabel] = Array.isArray(policy[role]) ? Array.from(new Set(policy[role])) : [];
      }
    }
    return map;
  }
}

(function () {
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    (new ActionApp()).start().catch(function (error) {
      console.error('Startup failed', error);
    });
  }
}());

export {
  ActionFS,
  ActionLocalStorage,
  ActionIndexDb,
  SchemaValidator,
  RBACService,
  ActionEntity,
  ActionApp,
  ConfigLoader,
  ActionServer,
  ActionEvent,
  ActionView,
  ActionClient,
  ActionTestBatch
};
