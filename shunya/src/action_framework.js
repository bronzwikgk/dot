// action-framework.js - COMPLETE FRAMEWORK IN ONE FILE
// Works in both Browser and Node.js
// Features:
// - Platform-aware config, schemas, and event mapping for browser and Node.js.
// - ActionRequest/ActionEvent/ActionEntity abstractions with schema validation and file support.
// - Integrated view rendering, templating, and DOM updates plus server-side outputs.
// - HTTP handling, persistence, CRUD, and health checks baked into ActionApp orchestration.

// ============================================================================
// 1. CONFIGURATION BLOCK (Everything as const)
// ============================================================================

const CONFIG = {
  // Platform auto-detection
  platform: (function () {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return 'browser';
    }
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      return 'node';
    }
    return 'unknown';
  })(),

  // Entity Schemas
  entities: {
    user: {
      fields: {
        id: { type: 'string', generate: true },
        name: { type: 'string', required: true, min: 2, max: 100 },
        email: { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        age: { type: 'number', min: 0, max: 150 },
        createdAt: { type: 'number', default: function () { return Date.now(); } },
        updatedAt: { type: 'number', default: function () { return Date.now(); } }
      },
      indexes: ['id', 'email'],
      browser: { storage: 'memory', persist: false },
      node: { storage: 'memory', persist: false }
    },

    file: {
      fields: {
        id: { type: 'string', generate: true },
        name: { type: 'string', required: true },
        size: { type: 'number', min: 0 },
        type: { type: 'string' },
        content: { type: 'any' },
        path: { type: 'string' },
        createdAt: { type: 'number', default: function () { return Date.now(); } }
      },
      browser: { maxSize: 5242880 }, // 5MB
      node: { directory: './uploads', maxSize: 104857600 } // 100MB
    },

    task: {
      fields: {
        id: { type: 'string', generate: true },
        title: { type: 'string', required: true },
        completed: { type: 'boolean', default: false },
        createdAt: { type: 'number', default: function () { return Date.now(); } }
      }
    }
  },

  // Request Schemas (events → actions)
  requests: {
    createUser: {
      entity: 'user',
      required: ['name', 'email'],
      transform: function (data) { return { ...data, name: data.name.trim() }; }
    },

    updateUser: {
      entity: 'user',
      required: ['id'],
      allow: ['name', 'email', 'age']
    },

    uploadFile: {
      entity: 'file',
      required: ['name', 'content']
    },

    createTask: {
      entity: 'task',
      required: ['title']
    },

    completeTask: {
      entity: 'task',
      required: ['id'],
      update: { completed: true, updatedAt: function () { return Date.now(); } }
    }
  },

  // Response Schemas
  responses: {
    userCreated: {
      include: ['id', 'name', 'email', 'createdAt'],
      status: 'success'
    },
    
    fileUploaded: {
      include: ['id', 'name', 'size', 'type', 'createdAt'],
      status: 'success'
    },
    
    taskCompleted: {
      include: ['id', 'title', 'completed', 'updatedAt'],
      status: 'success'
    },
    
    error: {
      include: ['code', 'message', 'timestamp'],
      status: 'error'
    }
  },

  // Event Mappings
  events: {
    // Browser DOM events → Request types
    browser: {
      'submit#user-form': 'createUser',
      'click#save-user': 'createUser',
      'change#file-upload': 'uploadFile',
      'submit#task-form': 'createTask',
      'click.task-complete': 'completeTask'
    },
    
    // Node HTTP routes → Request types
    node: {
      'POST /users': 'createUser',
      'PUT /users/:id': 'updateUser',
      'POST /files': 'uploadFile',
      'POST /tasks': 'createTask',
      'PATCH /tasks/:id/complete': 'completeTask',
      'GET /health': 'healthCheck'
    }
  },

  // View Templates
  templates: {
    userList: {
      browser: function (data) {
        return `
        <div class="user-list">
          ${data.users.map(function (user) {
            return `
            <div class="user" data-id="${user.id}">
              <h3>${user.name}</h3>
              <p>${user.email}</p>
              <small>Created: ${new Date(user.createdAt).toLocaleDateString()}</small>
            </div>
          `;
          }).join('')}
        </div>
      `;
      },
      node: function (data) { return JSON.stringify({ users: data.users }); }
    },

    taskList: {
      browser: function (data) {
        return `
        <ul class="task-list">
          ${data.tasks.map(function (task) {
            return `
            <li class="task ${task.completed ? 'completed' : ''}" data-id="${task.id}">
              <input type="checkbox" ${task.completed ? 'checked' : ''}>
              <span>${task.title}</span>
            </li>
          `;
          }).join('')}
        </ul>
      `;
      },
      node: function (data) { return JSON.stringify({ tasks: data.tasks }); }
    }
  }
};

// ============================================================================
// 2. ACTIONREQUEST CLASS (Event → Request conversion)
// ============================================================================

class ActionRequest {
  constructor(type, data, source = {}) {
    this.type = type;
    this.data = data;
    this.source = source; // {event, element, request, etc}
    this.timestamp = Date.now();
    this.id = `req_${this.timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Auto-validate if schema exists
    this.validate();
  }

  validate() {
    const schema = CONFIG.requests[this.type];
    if (!schema) {
      throw new Error(`No request schema found for type: ${this.type}`);
    }

    // Check required fields
    if (schema.required) {
      for (var reqIndex = 0; reqIndex < schema.required.length; reqIndex += 1) {
        var reqField = schema.required[reqIndex];
        if (this.data[reqField] === undefined || this.data[reqField] === null) {
          throw new Error(`Missing required field: ${reqField}`);
        }
      }
    }

    // Only allow specified fields if schema has 'allow'
    if (schema.allow) {
      var dataKeys = Object.keys(this.data);
      for (var keyIndex = 0; keyIndex < dataKeys.length; keyIndex += 1) {
        var currentField = dataKeys[keyIndex];
        if (schema.allow.indexOf(currentField) === -1) {
          delete this.data[currentField];
        }
      }
    }

    // Apply transform if defined
    if (schema.transform && typeof schema.transform === 'function') {
      this.data = schema.transform(this.data);
    }

    // Apply update fields if defined (for update operations)
    if (schema.update) {
      var updateKeys = Object.keys(schema.update);
      for (var updateIndex = 0; updateIndex < updateKeys.length; updateIndex += 1) {
        var updateKey = updateKeys[updateIndex];
        var updateValue = schema.update[updateKey];
        this.data[updateKey] = typeof updateValue === 'function' ? updateValue() : updateValue;
      }
    }

    return true;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      data: this.data,
      timestamp: this.timestamp,
      source: this.source
    };
  }
}

// ============================================================================
// 3. ACTIONEVENT CLASS (Event listener/handler)
// ============================================================================

class ActionEvent {
  constructor() {
    this.platform = CONFIG.platform;
    this.handlers = new Map();
    this.eventQueue = [];
    this.isProcessing = false;
    
    if (this.platform === 'browser') {
      this.setupBrowserEvents();
    } else {
      this.setupNodeEvents();
    }
  }

  setupBrowserEvents() {
    // Listen to DOM events from config
    var browserEvents = Object.keys(CONFIG.events.browser);
    var self = this;
    for (var eventIndex = 0; eventIndex < browserEvents.length; eventIndex += 1) {
      (function (localEventKey) {
        var eventParts = localEventKey.split('#');
        var localEventName = eventParts[0];
        var localSelector = eventParts[1];
        var localRequestType = CONFIG.events.browser[localEventKey];
        
        document.addEventListener(localEventName, function (event) {
          if (localSelector && !event.target.matches(localSelector)) {
            return;
          }
          
          var data = self.extractDataFromEvent(event);
          var request = new ActionRequest(localRequestType, data, {
            event: event.type,
            element: event.target,
            dataset: event.target.dataset
          });
          
          self.emit('request', request);
        });
      }(browserEvents[eventIndex]));
    }
  }

  setupNodeEvents() {
    // Node uses internal event emitter
    const EventEmitter = require('events');
    this.emitter = new EventEmitter();
    
    // Could set up HTTP server here if needed
    this.httpServer = null;
  }

  extractDataFromEvent(event) {
    if (event.target.tagName === 'FORM') {
      var formData = new FormData(event.target);
      var data = {};
      var formIterator = formData.entries();
      var entry = formIterator.next();
      while (!entry.done) {
        data[entry.value[0]] = entry.value[1];
        entry = formIterator.next();
      }
      return data;
    }
    
    // Extract from input elements
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
      return {
        [event.target.name || 'value']: event.target.value,
        checked: event.target.checked,
        type: event.target.type
      };
    }
    
    // Extract from dataset
    return { ...event.target.dataset };
  }

  on(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType).push(handler);
  }

  off(eventType, handler) {
    if (this.handlers.has(eventType)) {
      const handlers = this.handlers.get(eventType);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(eventType, data) {
    // Add to queue for async processing
    this.eventQueue.push({ eventType, data });
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    this.isProcessing = true;
    
    while (this.eventQueue.length > 0) {
      const { eventType, data } = this.eventQueue.shift();
      
      // Call handlers
      if (this.handlers.has(eventType)) {
        const handlers = this.handlers.get(eventType);
        for (const handler of handlers) {
          try {
            await handler(data);
          } catch (error) {
            console.error(`Error in event handler for ${eventType}:`, error);
            this.emit('error', error);
          }
        }
      }
      
      // Platform-specific emission
      if (this.platform === 'browser') {
        window.dispatchEvent(new CustomEvent(eventType, { detail: data }));
      } else if (this.emitter) {
        this.emitter.emit(eventType, data);
      }
    }
    
    this.isProcessing = false;
  }

  // For Node.js HTTP support
  handleHttpRequest(req, res) {
    if (this.platform !== 'node') return;
    
    const route = `${req.method} ${req.url.split('?')[0]}`;
    const requestType = CONFIG.events.node[route];
    
    if (!requestType) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Route not found' }));
      return;
    }
    
    // Parse request body
    let body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      try {
        const data = body ? JSON.parse(body) : {};
        const request = new ActionRequest(requestType, data, {
          method: req.method,
          url: req.url,
          headers: req.headers
        });
        
        this.emit('request', request);
        
        // Listen for response
        this.once('response', function (response) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response));
        });
        
        this.once('error', function (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });
        
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }

  once(eventType, handler) {
    var self = this;
    function onceHandler(data) {
      handler(data);
      self.off(eventType, onceHandler);
    }
    this.on(eventType, onceHandler);
  }
}

// ============================================================================
// 4. ACTIONENTITY CLASS (Data operations - files, db, cache)
// ============================================================================

class ActionEntity {
  constructor() {
    this.platform = CONFIG.platform;
    this.stores = new Map(); // In-memory stores
    this.fileCache = new Map(); // For file content
    this.initStores();
    this.initFileSystem();
  }

  initStores() {
    // Initialize in-memory store for each entity
    var entityKeys = Object.keys(CONFIG.entities);
    for (var entityIndex = 0; entityIndex < entityKeys.length; entityIndex += 1) {
      var entityName = entityKeys[entityIndex];
      this.stores.set(entityName, new Map());
    }
  }

  initFileSystem() {
    if (this.platform === 'node') {
      // Ensure uploads directory exists
      const fs = require('fs');
      const path = require('path');
      const uploadDir = CONFIG.entities.file.node.directory || './uploads';
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    }
  }

  // CRUD Operations
  async create(entityName, data) {
    const entityConfig = CONFIG.entities[entityName];
    if (!entityConfig) {
      throw new Error(`Unknown entity: ${entityName}`);
    }

    // Validate against schema
    this.validateEntity(entityConfig, data);

    // Generate ID if needed
    if (!data.id && entityConfig.fields.id?.generate) {
      data.id = this.generateId();
    }

    // Set defaults
    var entityFieldKeys = Object.keys(entityConfig.fields);
    for (var fieldIndex = 0; fieldIndex < entityFieldKeys.length; fieldIndex += 1) {
      var field = entityFieldKeys[fieldIndex];
      var fieldConfig = entityConfig.fields[field];
      if (data[field] === undefined && fieldConfig.default) {
        data[field] = typeof fieldConfig.default === 'function'
          ? fieldConfig.default()
          : fieldConfig.default;
      }
    }

    // Set timestamps
    if (entityConfig.fields.createdAt && !data.createdAt) {
      data.createdAt = Date.now();
    }
    if (entityConfig.fields.updatedAt) {
      data.updatedAt = Date.now();
    }

    // Platform-specific create logic
    if (this.platform === 'browser') {
      await this.createBrowser(entityName, data);
    } else {
      await this.createNode(entityName, data);
    }

    // Store in memory
    const store = this.stores.get(entityName);
    store.set(data.id, data);

    // Format response
    return this.formatResponse('created', entityName, data);
  }

  async createBrowser(entityName, data) {
    const entityConfig = CONFIG.entities[entityName];
    
    // For files, handle Blob/File objects
    if (entityName === 'file' && data.content) {
      // Convert to base64 for storage
      if (data.content instanceof Blob || data.content instanceof File) {
        data.content = await this.blobToBase64(data.content);
      }
      
      // Calculate size
      if (!data.size && data.content) {
        data.size = new TextEncoder().encode(data.content).length;
      }
      
      // Check size limit
      const maxSize = entityConfig.browser?.maxSize || 5242880;
      if (data.size > maxSize) {
        throw new Error(`File size exceeds limit: ${maxSize} bytes`);
      }
    }
    
    // Persist to localStorage if configured
    if (entityConfig.browser?.persist && typeof localStorage !== 'undefined') {
      const key = `entity_${entityName}_${data.id}`;
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  async createNode(entityName, data) {
    const entityConfig = CONFIG.entities[entityName];
    
    // For files, save to filesystem
    if (entityName === 'file' && data.content) {
      const fs = require('fs').promises;
      const path = require('path');
      const crypto = require('crypto');
      
      const uploadDir = entityConfig.node?.directory || './uploads';
      const fileName = `${data.id}_${data.name}`.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = path.join(uploadDir, fileName);
      
      // Save file content
      if (Buffer.isBuffer(data.content)) {
        await fs.writeFile(filePath, data.content);
      } else if (typeof data.content === 'string') {
        // Handle base64 string
        if (data.content.startsWith('data:')) {
          const base64Data = data.content.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          await fs.writeFile(filePath, buffer);
        } else {
          await fs.writeFile(filePath, data.content);
        }
      }
      
      // Update file record
      data.path = filePath;
      data.url = `/uploads/${fileName}`;
      
      if (!data.size) {
        const stats = await fs.stat(filePath);
        data.size = stats.size;
      }
      
      // Check size limit
      const maxSize = entityConfig.node?.maxSize || 104857600;
      if (data.size > maxSize) {
        await fs.unlink(filePath).catch(function () {});
        throw new Error(`File size exceeds limit: ${maxSize} bytes`);
      }
    }
    
    // Persist to JSON file if configured
    if (entityConfig.node?.persist && entityName !== 'file') {
      const fs = require('fs').promises;
      const filePath = `./data/${entityName}.json`;
      
      let existing = [];
      try {
        const content = await fs.readFile(filePath, 'utf8');
        existing = JSON.parse(content);
      } catch (error) {
        // File doesn't exist yet
      }
      
      existing.push(data);
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
    }
  }

  async read(entityName, query = {}) {
    const store = this.stores.get(entityName);
    if (!store) {
      throw new Error(`Entity not found: ${entityName}`);
    }

    let results = Array.from(store.values());

    // Apply query filters
    var queryKeys = Object.keys(query);
    if (queryKeys.length > 0) {
      var filteredResults = [];
      for (var resIndex = 0; resIndex < results.length; resIndex += 1) {
        var item = results[resIndex];
        var matchesAll = true;
        for (var queryIndex = 0; queryIndex < queryKeys.length; queryIndex += 1) {
          var key = queryKeys[queryIndex];
          var matchesKey = true;
          if (key.charAt(0) === '$') {
            switch (key) {
              case '$or':
                matchesKey = false;
                var orConditions = query[key];
                for (var orIndex = 0; orIndex < orConditions.length && !matchesKey; orIndex += 1) {
                  var orCondition = orConditions[orIndex];
                  var orConditionKeys = Object.keys(orCondition);
                  var orMatch = true;
                  for (var condKeyIndex = 0; condKeyIndex < orConditionKeys.length && orMatch; condKeyIndex += 1) {
                    var condKey = orConditionKeys[condKeyIndex];
                    if (item[condKey] !== orCondition[condKey]) {
                      orMatch = false;
                    }
                  }
                  if (orMatch) {
                    matchesKey = true;
                  }
                }
                break;
              case '$and':
                matchesKey = true;
                var andConditions = query[key];
                for (var andIndex = 0; andIndex < andConditions.length && matchesKey; andIndex += 1) {
                  var andCondition = andConditions[andIndex];
                  var andConditionKeys = Object.keys(andCondition);
                  var andMatch = true;
                  for (var condIdx = 0; condIdx < andConditionKeys.length && andMatch; condIdx += 1) {
                    var condField = andConditionKeys[condIdx];
                    if (item[condField] !== andCondition[condField]) {
                      andMatch = false;
                    }
                  }
                  if (!andMatch) {
                    matchesKey = false;
                  }
                }
                break;
              default:
                matchesKey = true;
            }
          } else {
            if (item[key] !== query[key]) {
              matchesKey = false;
            }
          }
          
          if (!matchesKey) {
            matchesAll = false;
            break;
          }
        }
        if (matchesAll) {
          filteredResults.push(item);
        }
      }
      results = filteredResults;
    }

    // Sort by createdAt by default
    results.sort(function (a, b) {
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return results;
  }

  async update(entityName, id, updates) {
    const store = this.stores.get(entityName);
    if (!store) {
      throw new Error(`Entity not found: ${entityName}`);
    }

    const existing = store.get(id);
    if (!existing) {
      throw new Error(`${entityName} with id ${id} not found`);
    }

    const entityConfig = CONFIG.entities[entityName];
    
    // Validate updates
    var updateFields = Object.keys(updates);
    for (var updateFieldIndex = 0; updateFieldIndex < updateFields.length; updateFieldIndex += 1) {
      var updateField = updateFields[updateFieldIndex];
      var fieldConfig = entityConfig.fields[updateField];
      if (fieldConfig) {
        this.validateField(updateField, updates[updateField], fieldConfig);
      }
    }

    // Apply updates
    const updated = { ...existing, ...updates };
    
    // Update timestamp
    if (entityConfig.fields.updatedAt) {
      updated.updatedAt = Date.now();
    }

    store.set(id, updated);

    // Platform-specific update
    if (this.platform === 'node' && entityConfig.node?.persist && entityName !== 'file') {
      await this.persistToFile(entityName);
    }

    return this.formatResponse('updated', entityName, updated);
  }

  async delete(entityName, id) {
    const store = this.stores.get(entityName);
    if (!store) {
      throw new Error(`Entity not found: ${entityName}`);
    }

    const item = store.get(id);
    if (!item) {
      throw new Error(`${entityName} with id ${id} not found`);
    }

    // Platform-specific delete
    if (entityName === 'file' && item.path && this.platform === 'node') {
      const fs = require('fs').promises;
      await fs.unlink(item.path).catch(function () {});
    }

    store.delete(id);

    // Update persistence
    if (this.platform === 'node' && CONFIG.entities[entityName]?.node?.persist && entityName !== 'file') {
      await this.persistToFile(entityName);
    }

    return this.formatResponse('deleted', entityName, { id });
  }

  // File operations
  async saveFile(fileData) {
    return this.create('file', fileData);
  }

  async readFile(id) {
    const files = await this.read('file', { id });
    if (files.length === 0) {
      throw new Error(`File with id ${id} not found`);
    }

    const file = files[0];
    
    // Load file content if needed
    if (this.platform === 'node' && file.path && !file.content) {
      const fs = require('fs').promises;
      const content = await fs.readFile(file.path);
      file.content = content;
    }

    return file;
  }

  async deleteFile(id) {
    return this.delete('file', id);
  }

  // Helper methods
  validateEntity(entityConfig, data) {
    var validateFields = Object.keys(entityConfig.fields);
    for (var validateIndex = 0; validateIndex < validateFields.length; validateIndex += 1) {
      var validateField = validateFields[validateIndex];
      var fieldConfig = entityConfig.fields[validateField];
      if (fieldConfig.required && (data[validateField] === undefined || data[validateField] === null)) {
        throw new Error('Field ' + validateField + ' is required');
      }
      
      if (data[validateField] !== undefined && data[validateField] !== null) {
        this.validateField(validateField, data[validateField], fieldConfig);
      }
    }
  }

  validateField(field, value, config) {
    if (config.type === 'string') {
      if (typeof value !== 'string') {
        throw new Error(`${field} must be a string`);
      }
      if (config.min && value.length < config.min) {
        throw new Error(`${field} must be at least ${config.min} characters`);
      }
      if (config.max && value.length > config.max) {
        throw new Error(`${field} must be at most ${config.max} characters`);
      }
      if (config.pattern && !config.pattern.test(value)) {
        throw new Error(`${field} has invalid format`);
      }
    } else if (config.type === 'number') {
      if (typeof value !== 'number' || isNaN(value)) {
        throw new Error(`${field} must be a number`);
      }
      if (config.min !== undefined && value < config.min) {
        throw new Error(`${field} must be at least ${config.min}`);
      }
      if (config.max !== undefined && value > config.max) {
        throw new Error(`${field} must be at most ${config.max}`);
      }
    } else if (config.type === 'boolean' && typeof value !== 'boolean') {
      throw new Error(`${field} must be a boolean`);
    }
  }

  async blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async persistToFile(entityName) {
    const fs = require('fs').promises;
    const store = this.stores.get(entityName);
    const data = Array.from(store.values());
    await fs.writeFile(`./data/${entityName}.json`, JSON.stringify(data, null, 2));
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  formatResponse(action, entityName, data) {
    const responseSchema = CONFIG.responses[`${entityName}${action.charAt(0).toUpperCase() + action.slice(1)}`] 
      || CONFIG.responses[action] 
      || { include: Object.keys(data) };

    const response = {
      success: true,
      action: `${entityName}.${action}`,
      timestamp: Date.now()
    };

    if (responseSchema.include) {
      response.data = {};
      var includeFields = responseSchema.include;
      for (var includeIndex = 0; includeIndex < includeFields.length; includeIndex += 1) {
        var includeField = includeFields[includeIndex];
        if (data[includeField] !== undefined) {
          response.data[includeField] = data[includeField];
        }
      }
    } else {
      response.data = data;
    }

    return response;
  }

  // Health check
  async health() {
    var storeEntries = [];
    var storeKeys = Array.from(this.stores.keys());
    for (var storeIndex = 0; storeIndex < storeKeys.length; storeIndex += 1) {
      var storeName = storeKeys[storeIndex];
      storeEntries.push({
        name: storeName,
        count: this.stores.get(storeName).size
      });
    }

    return {
      platform: this.platform,
      status: 'healthy',
      timestamp: Date.now(),
      stores: storeEntries,
      memory: this.platform === 'node' ? process.memoryUsage() : null
    };
  }
}

// ============================================================================
// 5. ACTIONVIEW CLASS (View rendering)
// ============================================================================

class ActionView {
  constructor() {
    this.platform = CONFIG.platform;
    this.templates = CONFIG.templates;
    this.rendered = new Map(); // Track rendered components
  }

  render(templateName, data, target = null) {
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    let output;
    
    // Get platform-specific template
    if (this.platform === 'browser' && template.browser) {
      if (typeof template.browser === 'function') {
        output = template.browser(data);
      } else {
        output = this.interpolate(template.browser, data);
      }
    } else if (this.platform === 'node' && template.node) {
      if (typeof template.node === 'function') {
        output = template.node(data);
      } else {
        output = this.interpolate(template.node, data);
      }
    } else if (typeof template === 'string') {
      output = this.interpolate(template, data);
    } else {
      output = JSON.stringify(data);
    }

    // Apply to target
    if (this.platform === 'browser') {
      return this.renderToDOM(output, target || '#app');
    } else {
      // In Node, just return the output
      return output;
    }
  }

  renderToDOM(html, selector) {
    if (typeof document === 'undefined') return null;
    
    const element = typeof selector === 'string' 
      ? document.querySelector(selector)
      : selector;
    
    if (!element) {
      console.warn(`Target element not found: ${selector}`);
      return null;
    }

    element.innerHTML = html;
    this.rendered.set(selector, { html, timestamp: Date.now() });
    
    // Dispatch render event
    if (window) {
      window.dispatchEvent(new CustomEvent('view:rendered', {
        detail: { selector, html }
      }));
    }
    
    return element;
  }

  update(selectorOrData, data) {
    if (this.platform === 'browser') {
      // Update existing DOM element
      if (typeof selectorOrData === 'string') {
        const element = document.querySelector(selectorOrData);
        if (!element) return false;
        
        // Update specific properties
        if (data.html !== undefined) {
          element.innerHTML = data.html;
        } else if (data.text !== undefined) {
          element.textContent = data.text;
        } else if (data.value !== undefined) {
          element.value = data.value;
        } else {
          // Update attributes
          var dataKeys = Object.keys(data);
          for (var keyIndex = 0; keyIndex < dataKeys.length; keyIndex += 1) {
            var key = dataKeys[keyIndex];
            if (key.startsWith('data-')) {
              element.dataset[key.replace('data-', '')] = data[key];
            } else if (key === 'class') {
              element.className = data[key];
            } else {
              element.setAttribute(key, data[key]);
            }
          }
        }
        
        return true;
      }
    }
    
    // For Node or data updates
    return selectorOrData;
  }

  interpolate(template, data) {
    if (typeof template !== 'string') return template;
    
    // Simple {{variable}} interpolation
    return template.replace(/\{\{(\w+)(\.\w+)*\}\}/g, function (match, path) {
      var parts = path.split('.');
      var value = data;
      
      for (var partIndex = 0; partIndex < parts.length; partIndex += 1) {
        var part = parts[partIndex];
        if (value === undefined || value === null) {
          value = undefined;
          break;
        }
        value = value[part];
      }
      
      return value !== undefined && value !== null ? String(value) : '';
    });
  }

  clear(selector) {
    if (this.platform === 'browser' && typeof document !== 'undefined') {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = '';
        this.rendered.delete(selector);
      }
    }
  }

  // For SSR in Node
  renderToString(templateName, data) {
    if (this.platform !== 'node') {
      throw new Error('renderToString is only available in Node.js');
    }
    
    return this.render(templateName, data);
  }
}

// ============================================================================
// 6. ACTIONAPP CLASS (Main orchestrator)
// ============================================================================

class ActionApp {
  constructor(configOverrides = {}) {
    // Merge config
    Object.assign(CONFIG, configOverrides);
    
    // Initialize core components
    this.events = new ActionEvent();
    this.entity = new ActionEntity();
    this.view = new ActionView();
    
    // State
    this.isRunning = false;
    this.requests = new Map();
    this.responses = new Map();
    
    // Set up event handlers
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    var self = this;
    this.events.on('request', async function (request) {
      var requestId = request.id;
      self.requests.set(requestId, request);
      
      try {
        var response = await self.processRequest(request);
        self.responses.set(requestId, response);
        self.events.emit('response', response);
        
        if (request.data && request.data._template) {
          await self.view.render(request.data._template, response.data);
          delete request.data._template;
        }
        
      } catch (error) {
        var errorResponse = {
          success: false,
          error: {
            code: error.code || 'INTERNAL_ERROR',
            message: error.message,
            requestId: requestId,
            timestamp: Date.now()
          }
        };
        
        self.events.emit('error', errorResponse);
        self.responses.set(requestId, errorResponse);
      }
    });

    this.events.on('error', function (error) {
      console.error('ActionApp Error:', error);
      
      if (CONFIG.platform === 'browser' && typeof document !== 'undefined') {
        var errorDiv = document.getElementById('error-container') ||
          (function () {
            var div = document.createElement('div');
            div.id = 'error-container';
            div.style.cssText = '\n              position: fixed;\n              top: 20px;\n              right: 20px;\n              background: #f44336;\n              color: white;\n              padding: 15px;\n              border-radius: 5px;\n              z-index: 10000;\n              max-width: 400px;\n            ';
            document.body.appendChild(div);
            return div;
          })();
        
        errorDiv.textContent = (error.error && error.error.message) ? error.error.message : 'An error occurred';
        errorDiv.style.display = 'block';
        
        setTimeout(function () {
          errorDiv.style.display = 'none';
        }, 5000);
      }
    });
  }

  async processRequest(request) {
    const { type, data } = request;
    const requestConfig = CONFIG.requests[type];
    
    if (!requestConfig) {
      throw new Error(`Unknown request type: ${type}`);
    }

    const entityName = requestConfig.entity;
    
    // Route to appropriate entity method
    switch (type.split(/(?=[A-Z])/)[0].toLowerCase()) {
      case 'create':
        return await this.entity.create(entityName, data);
        
      case 'update':
        return await this.entity.update(entityName, data.id, data);
        
      case 'delete':
        return await this.entity.delete(entityName, data.id);
        
      case 'upload':
        return await this.entity.saveFile(data);
        
      case 'complete':
        return await this.entity.update(entityName, data.id, { completed: true });
        
      case 'health':
        return await this.entity.health();
        
      default:
        // Default to read
        const results = await this.entity.read(entityName, data);
        return {
          success: true,
          action: `${entityName}.read`,
          data: results,
          count: results.length,
          timestamp: Date.now()
        };
    }
  }

  // Convenience methods
  async createUser(data) {
    const request = new ActionRequest('createUser', data);
    this.events.emit('request', request);
    return this.waitForResponse(request.id);
  }

  async uploadFile(fileData) {
    const request = new ActionRequest('uploadFile', fileData);
    this.events.emit('request', request);
    return this.waitForResponse(request.id);
  }

  async waitForResponse(requestId, timeout = 10000) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var startTime = Date.now();
      
      function checkResponse() {
        if (self.responses.has(requestId)) {
          resolve(self.responses.get(requestId));
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for response to request ' + requestId));
          return;
        }
        
        setTimeout(checkResponse, 100);
      }
      
      checkResponse();
    });
  }

  // Start/Stop
  start() {
    this.isRunning = true;
    
    if (CONFIG.platform === 'node') {
      console.log('ActionApp started in Node.js mode');
      console.log('Entities available:', Object.keys(CONFIG.entities));
    } else {
      console.log('ActionApp started in Browser mode');
    }
    
    this.events.emit('app:started', { timestamp: Date.now() });
  }

  stop() {
    this.isRunning = false;
    this.events.emit('app:stopped', { timestamp: Date.now() });
  }

  // For Node.js HTTP server
  startServer(port = 3000) {
    if (CONFIG.platform !== 'node') {
      throw new Error('HTTP server only available in Node.js');
    }
    
    const http = require('http');
    var self = this;
    
    const server = http.createServer(function (req, res) {
      self.events.handleHttpRequest(req, res);
    });
    
    server.listen(port, function () {
      console.log('ActionApp HTTP server listening on port ' + port);
      console.log('Available routes:');
      var nodeRoutes = Object.keys(CONFIG.events.node);
      for (var routeIndex = 0; routeIndex < nodeRoutes.length; routeIndex += 1) {
        var route = nodeRoutes[routeIndex];
        console.log('  ' + route);
      }
    });
    
    return server;
  }
}

// ============================================================================
// 7. EXPORT EVERYTHING
// ============================================================================

// Export all classes and config
export {
  CONFIG,
  ActionRequest,
  ActionEvent,
  ActionEntity,
  ActionView,
  ActionApp
};
