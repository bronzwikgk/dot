// ERMS FRAMEWORK v1.0 - MINIMAL IMPLEMENTATION
// ============================================================================
// Single file implementation for Node.js, Browser, and Google Apps Script
// ============================================================================

// 1. RUNTIME DETECTION
const RUNTIME = (() => {
  if (typeof ScriptApp !== 'undefined' || (typeof google !== 'undefined' && google.script && google.script.run)) {
    return { platform: 'google_apps_script', version: 'GAS', features: ['google_sheets', 'script_properties'] };
  }
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return { platform: 'browser', version: navigator.userAgent, features: ['local_storage', 'dom_access'] };
  }
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return { platform: 'node.js', version: process.version, features: ['file_system', 'http_server'] };
  }
  return { platform: 'unknown', version: 'unknown', features: [] };
})();

console.log(`🚀 ERMS Framework v1.0 starting on ${RUNTIME.platform}`);

// 2. CONFIGURATION LOADER
class ConfigLoader {
  static async loadConfig(path) {
    const ext = path.split('.').pop().toLowerCase();
    
    if (!['js', 'json'].includes(ext)) {
      throw new Error(`Only .js and .json configs supported in v1.0`);
    }
    
    try {
      if (ext === 'js') {
        if (RUNTIME.platform === 'node.js') {
          const module = await import(path);
          return module.default || module;
        }
        if (RUNTIME.platform === 'browser') {
          const module = await import(path);
          return module.default || module;
        }
        // GAS doesn't support dynamic imports
        return requireConfig(path);
      }
      
      if (ext === 'json') {
        return await this.loadJSON(path);
      }
    } catch (error) {
      console.error(`Failed to load config ${path}:`, error);
      return {};
    }
  }
  
  static async loadJSON(path) {
    switch (RUNTIME.platform) {
      case 'node.js':
        const fs = require('fs').promises;
        return JSON.parse(await fs.readFile(path, 'utf8'));
        
      case 'browser':
        const response = await fetch(path);
        return await response.json();
        
      case 'google_apps_script':
        if (path.startsWith('properties://')) {
          const key = path.replace('properties://', '');
          return JSON.parse(PropertiesService.getScriptProperties().getProperty(key) || '{}');
        }
        throw new Error('JSON configs in GAS must use properties:// prefix');
        
      default:
        throw new Error(`Cannot load JSON on ${RUNTIME.platform}`);
    }
  }
}

// 3. ENTITY SYSTEM
class EntityStore {
  constructor(entityType, config) {
    this.type = entityType;
    this.config = config || {};
    this.data = new Map();
    this.indexes = new Map();
    
    // Initialize indexes from config
    if (this.config.indexes) {
      this.config.indexes.forEach(index => {
        this.indexes.set(index, new Map());
      });
    }
  }
  
  create(record) {
    // Generate ID if not provided
    if (!record.id) {
      record.id = `ent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Add timestamps
    const now = Date.now();
    record.createdAt = record.createdAt || now;
    record.updatedAt = now;
    
    // Store
    this.data.set(record.id, record);
    
    // Update indexes
    this.updateIndexes(record);
    
    return record;
  }
  
  read(query = {}) {
    if (query.id) {
      const record = this.data.get(query.id);
      return record ? [record] : [];
    }
    
    // Simple query matching
    const results = [];
    for (const record of this.data.values()) {
      let matches = true;
      
      for (const [key, value] of Object.entries(query)) {
        if (record[key] !== value) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        results.push(record);
      }
    }
    
    return results;
  }
  
  update(id, updates) {
    const record = this.data.get(id);
    if (!record) {
      throw new Error(`Entity ${id} not found`);
    }
    
    // Remove from indexes
    this.removeFromIndexes(record);
    
    // Update
    const updated = { ...record, ...updates, updatedAt: Date.now() };
    this.data.set(id, updated);
    
    // Add to indexes
    this.updateIndexes(updated);
    
    return updated;
  }
  
  delete(id) {
    const record = this.data.get(id);
    if (!record) {
      throw new Error(`Entity ${id} not found`);
    }
    
    this.removeFromIndexes(record);
    this.data.delete(id);
    
    return { id, deleted: true };
  }
  
  updateIndexes(record) {
    for (const [indexName, index] of this.indexes.entries()) {
      const value = record[indexName];
      if (value !== undefined) {
        if (!index.has(value)) {
          index.set(value, new Set());
        }
        index.get(value).add(record.id);
      }
    }
  }
  
  removeFromIndexes(record) {
    for (const [indexName, index] of this.indexes.entries()) {
      const value = record[indexName];
      if (value !== undefined && index.has(value)) {
        index.get(value).delete(record.id);
        if (index.get(value).size === 0) {
          index.delete(value);
        }
      }
    }
  }
}

// 4. ACTION ENTITY
class ActionEntity {
  constructor() {
    this.stores = new Map();
  }
  
  registerEntity(type, config = {}) {
    console.log(`📝 Registering entity type: ${type}`);
    const store = new EntityStore(type, config);
    this.stores.set(type, store);
    return store;
  }
  
  getStore(type) {
    const store = this.stores.get(type);
    if (!store) {
      throw new Error(`Entity type ${type} not registered`);
    }
    return store;
  }
  
  async create(type, data) {
    const store = this.getStore(type);
    return store.create(data);
  }
  
  async read(type, query = {}) {
    const store = this.getStore(type);
    return store.read(query);
  }
  
  async update(type, id, updates) {
    const store = this.getStore(type);
    return store.update(id, updates);
  }
  
  async delete(type, id) {
    const store = this.getStore(type);
    return store.delete(id);
  }
  
  // Tree operations
  async createTree(type, data, parentId = null) {
    const store = this.getStore(type);
    const record = store.create({
      ...data,
      parentId,
      children: [],
      isLeaf: true,
      depth: 0
    });
    
    if (parentId) {
      const parent = store.data.get(parentId);
      if (parent) {
        parent.children.push(record.id);
        parent.isLeaf = false;
      }
      
      // Calculate depth
      let depth = 0;
      let current = parent;
      while (current && current.parentId) {
        depth++;
        current = store.data.get(current.parentId);
      }
      record.depth = depth + 1;
    }
    
    return record;
  }
  
  async getTree(type, rootId = null) {
    const store = this.getStore(type);
    const result = [];
    
    for (const record of store.data.values()) {
      if (record.parentId === rootId) {
        const node = { ...record };
        node.children = await this.getTree(type, record.id);
        result.push(node);
      }
    }
    
    return result;
  }
}

// 5. ACTION VALIDATOR
class ActionValidator {
  constructor(config = {}) {
    this.config = config;
    this.rules = new Map();
  }
  
  addRule(entityType, rule) {
    if (!this.rules.has(entityType)) {
      this.rules.set(entityType, []);
    }
    this.rules.get(entityType).push(rule);
  }
  
  validate(entityType, data, operation) {
    const rules = this.rules.get(entityType) || [];
    const errors = [];
    
    for (const rule of rules) {
      try {
        rule.validate(data, operation);
      } catch (error) {
        errors.push({
          field: rule.field,
          message: error.message,
          code: rule.code
        });
      }
    }
    
    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }
    
    return true;
  }
  
  // RBAC
  checkPermission(user, resource, action) {
    const userRole = user.role || 'guest';
    const resourceConfig = this.config.resources?.[resource];
    
    if (!resourceConfig) {
      return false; // Resource not configured
    }
    
    const allowedRoles = resourceConfig[action] || [];
    return allowedRoles.includes(userRole);
  }
  
  // CORS
  checkCORS(origin) {
    const allowedOrigins = this.config.cors?.origins || [];
    const allowAll = this.config.cors?.allowAll || false;
    
    if (allowAll) return true;
    if (allowedOrigins.includes('*')) return true;
    return allowedOrigins.includes(origin);
  }
}

class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// 6. ACTION FS (File System)
class ActionFS {
  constructor() {
    this.platform = RUNTIME.platform;
  }
  
  async readFile(path) {
    switch (this.platform) {
      case 'node.js':
        const fs = require('fs').promises;
        return await fs.readFile(path, 'utf8');
        
      case 'browser':
        const response = await fetch(path);
        return await response.text();
        
      case 'google_apps_script':
        if (path.startsWith('properties://')) {
          const key = path.replace('properties://', '');
          return PropertiesService.getScriptProperties().getProperty(key) || '';
        }
        if (path.startsWith('drive://')) {
          const fileId = path.replace('drive://', '');
          const file = DriveApp.getFileById(fileId);
          return file.getBlob().getDataAsString();
        }
        throw new Error(`Unsupported path format: ${path}`);
        
      default:
        throw new Error(`Cannot read files on ${this.platform}`);
    }
  }
  
  async writeFile(path, content) {
    switch (this.platform) {
      case 'node.js':
        const fs = require('fs').promises;
        await fs.writeFile(path, content, 'utf8');
        return true;
        
      case 'browser':
        // Create download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = path.split('/').pop();
        a.click();
        URL.revokeObjectURL(url);
        return true;
        
      case 'google_apps_script':
        if (path.startsWith('properties://')) {
          const key = path.replace('properties://', '');
          PropertiesService.getScriptProperties().setProperty(key, content);
          return true;
        }
        return false;
        
      default:
        throw new Error(`Cannot write files on ${this.platform}`);
    }
  }
  
  async exists(path) {
    try {
      await this.readFile(path);
      return true;
    } catch {
      return false;
    }
  }
}

// 7. ACTION SERVER (HTTP)
class ActionServer {
  constructor(config = {}) {
    this.config = {
      port: 3000,
      cors: { origins: ['*'] },
      ...config
    };
    
    this.routes = new Map();
    this.middleware = [];
    this.validator = null;
  }
  
  setValidator(validator) {
    this.validator = validator;
  }
  
  route(method, path, handler) {
    const key = `${method} ${path}`;
    this.routes.set(key, handler);
    console.log(`📡 Registered route: ${key}`);
  }
  
  use(middleware) {
    this.middleware.push(middleware);
  }
  
  start() {
    if (RUNTIME.platform !== 'node.js') {
      console.log('⚠️ HTTP server only available on Node.js');
      return;
    }
    
    const http = require('http');
    
    const server = http.createServer(async (req, res) => {
      // Apply middleware
      for (const middleware of this.middleware) {
        if (!await middleware(req, res)) {
          return; // Middleware handled the request
        }
      }
      
      // Parse URL
      const url = new URL(req.url, `http://${req.headers.host}`);
      const routeKey = `${req.method} ${url.pathname}`;
      
      // Check CORS
      if (this.validator) {
        const origin = req.headers.origin;
        if (!this.validator.checkCORS(origin)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'CORS not allowed' }));
          return;
        }
      }
      
      // Find handler
      let handler = this.routes.get(routeKey);
      
      // Try pattern matching for :param routes
      if (!handler) {
        for (const [routePattern, routeHandler] of this.routes.entries()) {
          const [method, pattern] = routePattern.split(' ');
          if (method === req.method && this.matchRoute(pattern, url.pathname)) {
            handler = routeHandler;
            break;
          }
        }
      }
      
      if (!handler) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
        return;
      }
      
      // Parse body
      let body = '';
      req.on('data', chunk => body += chunk);
      
      req.on('end', async () => {
        try {
          const data = body ? JSON.parse(body) : {};
          const params = this.extractParams(routeKey, url.pathname);
          
          const result = await handler({
            ...data,
            ...params,
            ...Object.fromEntries(url.searchParams)
          });
          
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: error.message,
            ...(error.errors && { errors: error.errors })
          }));
        }
      });
    });
    
    server.listen(this.config.port, () => {
      console.log(`🌐 ActionServer listening on port ${this.config.port}`);
      console.log('Available routes:');
      for (const route of this.routes.keys()) {
        console.log(`  ${route}`);
      }
    });
    
    return server;
  }
  
  matchRoute(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    
    if (patternParts.length !== pathParts.length) return false;
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) continue;
      if (patternParts[i] !== pathParts[i]) return false;
    }
    
    return true;
  }
  
  extractParams(pattern, path) {
    const params = {};
    const patternParts = pattern.split(' ');
    const routePattern = patternParts.length > 1 ? patternParts[1] : patternParts[0];
    
    const patternSegments = routePattern.split('/');
    const pathSegments = path.split('/');
    
    for (let i = 0; i < patternSegments.length; i++) {
      if (patternSegments[i].startsWith(':')) {
        const paramName = patternSegments[i].substring(1);
        params[paramName] = pathSegments[i];
      }
    }
    
    return params;
  }
}

// 8. MAIN ERMS FRAMEWORK CLASS
class ERMSFramework {
  constructor(config = {}) {
    this.config = config;
    this.runtime = RUNTIME;
    
    // Initialize core components
    this.entity = new ActionEntity();
    this.validator = new ActionValidator(config.validator);
    this.fs = new ActionFS();
    this.server = new ActionServer(config.server);
    
    // Set validator for server
    this.server.setValidator(this.validator);
    
    // Load config if provided
    if (config.path) {
      this.loadConfig(config.path);
    }
    
    console.log(`✅ ERMS Framework v1.0 initialized on ${this.runtime.platform}`);
  }
  
  async loadConfig(path) {
    console.log(`📂 Loading config from: ${path}`);
    const config = await ConfigLoader.loadConfig(path);
    
    // Merge with existing config
    this.config = { ...this.config, ...config };
    
    // Register entities from config
    if (config.entities) {
      for (const [entityType, entityConfig] of Object.entries(config.entities)) {
        this.entity.registerEntity(entityType, entityConfig);
        
        // Add validation rules
        if (entityConfig.validation) {
          for (const rule of entityConfig.validation) {
            this.validator.addRule(entityType, rule);
          }
        }
      }
    }
    
    // Set validator config
    if (config.validator) {
      this.validator.config = { ...this.validator.config, ...config.validator };
    }
    
    return this.config;
  }
  
  // Quick start - register entity with validation
  registerEntity(type, schema) {
    const store = this.entity.registerEntity(type, schema);
    
    // Add basic validation rules
    if (schema.fields) {
      for (const [fieldName, fieldConfig] of Object.entries(schema.fields)) {
        if (fieldConfig.required) {
          this.validator.addRule(type, {
            field: fieldName,
            code: 'REQUIRED',
            validate: (data) => {
              if (data[fieldName] === undefined || data[fieldName] === null) {
                throw new Error(`${fieldName} is required`);
              }
            }
          });
        }
      }
    }
    
    return store;
  }
  
  // Health check
  async health() {
    const entityStatus = [];
    
    for (const [type, store] of this.entity.stores.entries()) {
      entityStatus.push({
        type,
        count: store.data.size,
        storage: 'memory'
      });
    }
    
    return {
      status: 'healthy',
      platform: this.runtime.platform,
      version: '1.0',
      timestamp: new Date().toISOString(),
      entities: entityStatus
    };
  }
  
  // Start server (Node.js only)
  startServer(port = 3000) {
    if (this.runtime.platform !== 'node.js') {
      throw new Error('HTTP server only available on Node.js');
    }
    
    // Register health endpoint
    this.server.route('GET', '/health', async () => {
      return await this.health();
    });
    
    // Register entity endpoints
    for (const entityType of this.entity.stores.keys()) {
      // Create
      this.server.route('POST', `/entities/${entityType}`, async (data) => {
        // Validate
        this.validator.validate(entityType, data, 'create');
        
        // Check permissions
        const user = data._user || { role: 'guest' };
        if (!this.validator.checkPermission(user, entityType, 'create')) {
          throw new Error('Permission denied');
        }
        
        return await this.entity.create(entityType, data);
      });
      
      // Read all
      this.server.route('GET', `/entities/${entityType}`, async (query) => {
        const user = query._user || { role: 'guest' };
        if (!this.validator.checkPermission(user, entityType, 'read')) {
          throw new Error('Permission denied');
        }
        
        return await this.entity.read(entityType, query);
      });
      
      // Read single
      this.server.route('GET', `/entities/${entityType}/:id`, async (data) => {
        const user = data._user || { role: 'guest' };
        if (!this.validator.checkPermission(user, entityType, 'read')) {
          throw new Error('Permission denied');
        }
        
        const results = await this.entity.read(entityType, { id: data.id });
        return results[0] || null;
      });
      
      // Update
      this.server.route('PUT', `/entities/${entityType}/:id`, async (data) => {
        this.validator.validate(entityType, data, 'update');
        
        const user = data._user || { role: 'guest' };
        if (!this.validator.checkPermission(user, entityType, 'update')) {
          throw new Error('Permission denied');
        }
        
        return await this.entity.update(entityType, data.id, data);
      });
      
      // Delete
      this.server.route('DELETE', `/entities/${entityType}/:id`, async (data) => {
        const user = data._user || { role: 'guest' };
        if (!this.validator.checkPermission(user, entityType, 'delete')) {
          throw new Error('Permission denied');
        }
        
        return await this.entity.delete(entityType, data.id);
      });
    }
    
    return this.server.start();
  }
}

// 9. EXPORT & GLOBAL SETUP
// Export for Node.js/ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ERMSFramework,
    ActionEntity,
    ActionValidator,
    ActionFS,
    ActionServer,
    ConfigLoader,
    RUNTIME
  };
}

// Export for ES modules
if (typeof exports !== 'undefined') {
  Object.assign(exports, {
    ERMSFramework,
    ActionEntity,
    ActionValidator,
    ActionFS,
    ActionServer,
    ConfigLoader,
    RUNTIME
  });
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.ERMS = {
    ERMSFramework,
    ActionEntity,
    ActionValidator,
    ActionFS,
    ActionServer,
    ConfigLoader,
    RUNTIME
  };
}

// Example config for quick testing
const EXAMPLE_CONFIG = {
  entities: {
    user: {
      fields: {
        name: { type: 'string', required: true },
        email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        age: { type: 'number', min: 0, max: 150 }
      },
      indexes: ['email']
    },
    task: {
      fields: {
        title: { type: 'string', required: true },
        completed: { type: 'boolean', default: false }
      }
    }
  },
  validator: {
    cors: {
      origins: ['*'],
      allowAll: true
    },
    resources: {
      user: {
        create: ['admin', 'user'],
        read: ['admin', 'user', 'guest'],
        update: ['admin', 'user'],
        delete: ['admin']
      },
      task: {
        create: ['admin', 'user'],
        read: ['admin', 'user', 'guest'],
        update: ['admin', 'user'],
        delete: ['admin', 'user']
      }
    }
  }
};

// Quick start helper
async function quickStart(config = EXAMPLE_CONFIG) {
  const erms = new ERMSFramework(config);
  
  // Register example entities
  erms.registerEntity('user', config.entities.user);
  erms.registerEntity('task', config.entities.task);
  
  // Add example data
  await erms.entity.create('user', {
    name: 'Admin User',
    email: 'admin@example.com',
    age: 30,
    role: 'admin'
  });
  
  await erms.entity.create('task', {
    title: 'Setup ERMS Framework',
    completed: true
  });
  
  console.log('🚀 ERMS Framework quick start complete!');
  console.log('- Entity types:', Array.from(erms.entity.stores.keys()));
  console.log('- Platform:', erms.runtime.platform);
  
  // Start server if on Node.js
  if (erms.runtime.platform === 'node.js') {
    erms.startServer();
  }
  
  return erms;
}

// Auto-start in browser for demo
if (typeof window !== 'undefined' && window.location.search.includes('demo=true')) {
  window.addEventListener('DOMContentLoaded', async () => {
    const erms = await quickStart();
    
    // Create demo UI
    const app = document.getElementById('app') || document.body;
    app.innerHTML = `
      <div style="font-family: system-ui; padding: 20px;">
        <h1>ERMS Framework v1.0 Demo</h1>
        <p>Platform: ${erms.runtime.platform}</p>
        <div id="entities"></div>
      </div>
    `;
    
    // Show entities
    const users = await erms.entity.read('user');
    const tasks = await erms.entity.read('task');
    
    document.getElementById('entities').innerHTML = `
      <h3>Users (${users.length})</h3>
      <pre>${JSON.stringify(users, null, 2)}</pre>
      <h3>Tasks (${tasks.length})</h3>
      <pre>${JSON.stringify(tasks, null, 2)}</pre>
    `;
  });
}

// Export quickStart for easy use
if (typeof module !== 'undefined' && module.exports) {
  module.exports.quickStart = quickStart;
}
if (typeof exports !== 'undefined') {
  exports.quickStart = quickStart;
}
if (typeof window !== 'undefined') {
  window.quickStart = quickStart;
}

console.log('📦 ERMS Framework v1.0 loaded successfully');
// ============================================================================
// END OF ERMS FRAMEWORK v1.0 IMPLEMENTATION
// ============================================================================