// ============================================================================
// PRODUCTION-GRADE ACTION FRAMEWORK v2.0
// ============================================================================
// Universal framework for browser and Node.js
// Features:
// - Platform-aware runtime with auto-detection
// - Comprehensive configuration system
// - Production error handling with configurable messages
// - RBAC permissions and validation
// - Multi-storage support (IndexedDB, LocalStorage, FileSystem)
// - Built-in synchronization
// - Health monitoring and logging
// ============================================================================

import { RUNTIME } from './config/runtime.js';
import { ERROR_CONFIG } from './config/errorConfig.js';
import { APP_CONFIG } from './config/appConfig.js';

// Configurations centralized in src/config/*

// ============================================================================
// 4. ACTIONERROR CLASS - Production error handling
// ============================================================================
class ActionError extends Error {
  constructor(category, code, message, details = {}, context = {}) {
    const errorConfig = ERROR_CONFIG.categories[category] || ERROR_CONFIG.categories.system;
    const errorCode = `${errorConfig.code}_${code.toString().padStart(3, '0')}`;
    const userMessage = ERROR_CONFIG.messages[APP_CONFIG.i18n.defaultLocale]?.[errorCode] || 
                       errorConfig.defaultMessage;
    
    super(userMessage);
    
    this.name = 'ActionError';
    this.category = category;
    this.code = errorCode;
    this.level = errorConfig.level;
    this.recoverable = errorConfig.recoverable;
    this.timestamp = new Date().toISOString();
    this.details = details;
    this.context = {
      requestId: context.requestId,
      userId: context.userId,
      sessionId: context.sessionId,
      ...context
    };
    this.suggestions = errorConfig.suggestions;
    this.httpStatus = ERROR_CONFIG.httpStatus[errorCode] || 500;
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ActionError);
    }
  }

  toJSON() {
    const base = {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        category: this.category,
        level: this.level,
        timestamp: this.timestamp,
        suggestions: this.suggestions
      }
    };

    // Include details in development
    if (APP_CONFIG.meta.environment !== 'production') {
      base.error.details = this.details;
      base.error.stack = this.stack;
      base.error.context = this.context;
    }

    // Include request context if available
    if (this.context.requestId) {
      base.requestId = this.context.requestId;
    }

    return base;
  }

  log() {
    const logger = ActionFramework.getLogger();
    const logData = {
      error: this.code,
      message: this.message,
      category: this.category,
      level: this.level,
      timestamp: this.timestamp,
      context: this.context
    };

    switch (this.level) {
      case 'critical':
      case 'error':
        logger.error(logData);
        break;
      case 'warn':
        logger.warn(logData);
        break;
      case 'info':
        logger.info(logData);
        break;
      default:
        logger.debug(logData);
    }

    // Notify monitoring system
    if (APP_CONFIG.monitoring.enabled) {
      ActionFramework.getMonitor().recordError(this);
    }
  }

  static fromError(error, context = {}) {
    if (error instanceof ActionError) {
      return error;
    }

    // Map generic errors to ActionError
    let category = 'system';
    let code = '001';
    let details = {};

    if (error.name === 'ValidationError') {
      category = 'validation';
      code = '001';
      details = { validationErrors: error.errors };
    } else if (error.name === 'TypeError') {
      category = 'validation';
      code = '002';
    } else if (error.message?.includes('permission') || error.message?.includes('unauthorized')) {
      category = 'authorization';
      code = '001';
    } else if (error.message?.includes('auth') || error.message?.includes('login')) {
      category = 'authentication';
      code = '001';
    } else if (error.code === 'ENOENT' || error.message?.includes('file')) {
      category = 'database';
      code = '002';
    }

    return new ActionError(
      category,
      code,
      error.message || 'An unexpected error occurred',
      details,
      context
    );
  }
}

// ============================================================================
// 5. ACTIONENTITY CLASS - Enhanced with production features
// ============================================================================
class ActionEntity {
  constructor(entityName, options = {}) {
    this.name = entityName;
    this.config = APP_CONFIG.entities[entityName];
    
    if (!this.config) {
      throw new ActionError('system', '001', `Entity configuration not found: ${entityName}`);
    }

    this.storage = this.initStorage();
    this.cache = this.initCache();
    this.validator = this.initValidator();
    this.hooks = this.initHooks();
    this.permissions = this.config.permissions || {};
    
    // Performance metrics
    this.metrics = {
      operations: new Map(),
      errors: new Map(),
      latency: new Map()
    };

    this.initialize();
  }

  initStorage() {
    const storageConfig = this.config.storage;
    const providerName = storageConfig.primary;
    const providerConfig = APP_CONFIG.storage.providers[providerName];

    if (!providerConfig || !providerConfig.enabled) {
      // Try fallback
      for (const fallback of APP_CONFIG.storage.fallbackOrder) {
        if (APP_CONFIG.storage.providers[fallback]?.enabled) {
          return this.createStorageProvider(fallback);
        }
      }
      throw new ActionError('system', '003', 'No storage provider available');
    }

    return this.createStorageProvider(providerName);
  }

  createStorageProvider(providerName) {
    const providerConfig = APP_CONFIG.storage.providers[providerName];
    
    switch (providerName) {
      case 'indexeddb':
        return new IndexedDBStorage({
          dbName: providerConfig.name,
          storeName: this.config.storage.options.indexeddb.storeName,
          version: providerConfig.version,
          indexes: this.config.storage.options.indexeddb.indexes
        });
        
      case 'localStorage':
        return new LocalStorage({
          prefix: providerConfig.prefix + this.name + '_',
          quota: providerConfig.quota
        });
        
      case 'file':
        return new FileStorage({
          basePath: providerConfig.basePath,
          entityName: this.name,
          encoding: providerConfig.encoding
        });
        
      case 'memory':
        return new MemoryStorage({
          maxItems: providerConfig.maxItems,
          ttl: providerConfig.ttl
        });
        
      default:
        throw new ActionError('system', '004', `Unsupported storage provider: ${providerName}`);
    }
  }

  initCache() {
    return new CacheManager({
      provider: APP_CONFIG.cache.provider,
      ttl: APP_CONFIG.cache.ttl[this.name] || APP_CONFIG.cache.ttl.default,
      prefix: `cache_${this.name}_`
    });
  }

  initValidator() {
    return new Validator({
      schema: this.config.schema,
      strict: true,
      coerceTypes: true,
      removeAdditional: true
    });
  }

  initHooks() {
    const hooks = {};
    const hookConfig = this.config.hooks || {};
    
    Object.entries(hookConfig).forEach(([hookName, hookFunctions]) => {
      hooks[hookName] = hookFunctions.map(fnName => {
        const hook = ActionFramework.getHook(fnName);
        if (!hook) {
          console.warn(`Hook not found: ${fnName}`);
          return null;
        }
        return hook;
      }).filter(Boolean);
    });
    
    return hooks;
  }

  async initialize() {
    try {
      await this.storage.initialize();
      await this.cache.initialize();
      console.log(`Entity ${this.name} initialized successfully`);
    } catch (error) {
      throw ActionError.fromError(error, { entity: this.name, operation: 'initialize' });
    }
  }

  // CRUD Operations with enhanced error handling
  async create(data, context = {}) {
    const startTime = Date.now();
    const operation = 'create';
    
    try {
      // 1. Permission check
      this.checkPermission(operation, context);
      
      // 2. Run pre-hooks
      await this.runHooks('beforeCreate', { data, context, operation });
      
      // 3. Validate data
      const validatedData = await this.validator.validate(data, 'create');
      
      // 4. Generate metadata
      const entityData = this.enrichData(validatedData, context, operation);
      
      // 5. Store data
      const result = await this.storage.create(entityData);
      
      // 6. Update cache
      await this.cache.set(result._id, result);
      
      // 7. Run post-hooks
      await this.runHooks('afterCreate', { data: result, context, operation });
      
      // 8. Record metrics
      this.recordMetrics(operation, Date.now() - startTime, true);
      
      // 9. Audit log
      this.audit(operation, result, context);
      
      return this.formatResponse(operation, result);
      
    } catch (error) {
      const actionError = ActionError.fromError(error, {
        entity: this.name,
        operation,
        data,
        context
      });
      
      this.recordMetrics(operation, Date.now() - startTime, false);
      actionError.log();
      
      throw actionError;
    }
  }

  async read(query = {}, context = {}) {
    const startTime = Date.now();
    const operation = 'read';
    
    try {
      // Permission check
      this.checkPermission(operation, context);
      
      // Check cache first for single ID queries
      if (query._id) {
        const cached = await this.cache.get(query._id);
        if (cached) {
          this.recordMetrics(operation, Date.now() - startTime, true);
          return this.formatResponse(operation, cached);
        }
      }
      
      // Query storage
      const result = await this.storage.read(query);
      
      // Cache results
      if (Array.isArray(result)) {
        for (const item of result) {
          await this.cache.set(item._id, item);
        }
      } else if (result) {
        await this.cache.set(result._id, result);
      }
      
      this.recordMetrics(operation, Date.now() - startTime, true);
      return this.formatResponse(operation, result);
      
    } catch (error) {
      const actionError = ActionError.fromError(error, {
        entity: this.name,
        operation,
        query,
        context
      });
      
      this.recordMetrics(operation, Date.now() - startTime, false);
      actionError.log();
      
      throw actionError;
    }
  }

  async update(id, data, context = {}) {
    const startTime = Date.now();
    const operation = 'update';
    
    try {
      this.checkPermission(operation, context);
      
      // Run pre-hooks
      await this.runHooks('beforeUpdate', { id, data, context, operation });
      
      // Validate update data
      const validatedData = await this.validator.validate(data, 'update');
      
      // Enrich with metadata
      const updateData = this.enrichData(validatedData, context, operation);
      
      // Perform update
      const result = await this.storage.update(id, updateData);
      
      // Update cache
      await this.cache.set(id, result);
      await this.cache.invalidatePattern(`${this.name}_list_*`);
      
      // Run post-hooks
      await this.runHooks('afterUpdate', { id, data: result, context, operation });
      
      this.recordMetrics(operation, Date.now() - startTime, true);
      this.audit(operation, { id, ...result }, context);
      
      return this.formatResponse(operation, result);
      
    } catch (error) {
      const actionError = ActionError.fromError(error, {
        entity: this.name,
        operation,
        id,
        data,
        context
      });
      
      this.recordMetrics(operation, Date.now() - startTime, false);
      actionError.log();
      
      throw actionError;
    }
  }

  async delete(id, context = {}) {
    const startTime = Date.now();
    const operation = 'delete';
    
    try {
      this.checkPermission(operation, context);
      
      // Check if exists
      const existing = await this.storage.read({ _id: id });
      if (!existing) {
        throw new ActionError('validation', '004', 'Record not found', { id });
      }
      
      // Run pre-hooks
      await this.runHooks('beforeDelete', { id, context, operation });
      
      // Perform deletion
      await this.storage.delete(id);
      
      // Clear cache
      await this.cache.delete(id);
      await this.cache.invalidatePattern(`${this.name}_list_*`);
      
      // Run post-hooks
      await this.runHooks('afterDelete', { id, context, operation });
      
      this.recordMetrics(operation, Date.now() - startTime, true);
      this.audit(operation, { id }, context);
      
      return this.formatResponse(operation, { id, deleted: true });
      
    } catch (error) {
      const actionError = ActionError.fromError(error, {
        entity: this.name,
        operation,
        id,
        context
      });
      
      this.recordMetrics(operation, Date.now() - startTime, false);
      actionError.log();
      
      throw actionError;
    }
  }

  // Helper methods
  checkPermission(operation, context) {
    const allowedRoles = this.permissions[operation];
    const userRole = context.user?.role || 'guest';
    
    if (!allowedRoles || !allowedRoles.includes(userRole)) {
      throw new ActionError('authorization', '001', 
        `Permission denied for operation: ${operation}`, 
        { 
          operation, 
          userRole, 
          allowedRoles,
          entity: this.name 
        },
        context
      );
    }
  }

  enrichData(data, context, operation) {
    const enriched = { ...data };
    const now = new Date().toISOString();
    
    if (operation === 'create') {
      if (!enriched._id) {
        enriched._id = this.generateId();
      }
      enriched.metadata = enriched.metadata || {};
      enriched.metadata.createdAt = now;
      enriched.metadata.createdBy = context.user?.userId || 'system';
    }
    
    if (operation === 'create' || operation === 'update') {
      enriched.metadata = enriched.metadata || {};
      enriched.metadata.updatedAt = now;
      enriched.metadata.updatedBy = context.user?.userId || 'system';
    }
    
    return enriched;
  }

  async runHooks(hookName, data) {
    const hooks = this.hooks[hookName] || [];
    
    for (const hook of hooks) {
      try {
        await hook(data, this);
      } catch (error) {
        console.error(`Hook ${hookName} failed:`, error);
        // Don't throw from hooks to avoid breaking main operation
      }
    }
  }

  formatResponse(operation, data) {
    return {
      success: true,
      operation: `${this.name}.${operation}`,
      timestamp: new Date().toISOString(),
      data: this.sanitizeResponse(data)
    };
  }

  sanitizeResponse(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeItem(item));
    }
    return this.sanitizeItem(data);
  }

  sanitizeItem(item) {
    if (!item || typeof item !== 'object') return item;
    
    const sanitized = { ...item };
    
    // Remove hidden fields
    Object.entries(this.config.schema.fields).forEach(([fieldName, fieldConfig]) => {
      if (fieldConfig.hidden && sanitized[fieldName] !== undefined) {
        delete sanitized[fieldName];
      }
    });
    
    return sanitized;
  }

  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  recordMetrics(operation, duration, success) {
    const key = `${this.name}.${operation}`;
    
    if (!this.metrics.operations.has(key)) {
      this.metrics.operations.set(key, { count: 0, success: 0, errors: 0 });
    }
    
    const metric = this.metrics.operations.get(key);
    metric.count++;
    
    if (success) {
      metric.success++;
    } else {
      metric.errors++;
    }
    
    // Record latency
    if (!this.metrics.latency.has(key)) {
      this.metrics.latency.set(key, []);
    }
    
    const latencies = this.metrics.latency.get(key);
    latencies.push(duration);
    
    // Keep only last 100 measurements
    if (latencies.length > 100) {
      latencies.shift();
    }
  }

  audit(operation, data, context) {
    if (!APP_CONFIG.logging.levels.audit) return;
    
    const logger = ActionFramework.getLogger();
    logger.audit({
      entity: this.name,
      operation,
      data,
      user: context.user,
      timestamp: new Date().toISOString(),
      requestId: context.requestId
    });
  }

  getMetrics() {
    const metrics = {};
    
    for (const [key, value] of this.metrics.operations) {
      metrics[key] = {
        ...value,
        errorRate: value.errors / value.count,
        avgLatency: this.calculateAverageLatency(key)
      };
    }
    
    return metrics;
  }

  calculateAverageLatency(key) {
    const latencies = this.metrics.latency.get(key) || [];
    if (latencies.length === 0) return 0;
    
    return latencies.reduce((sum, latency) => sum + latency, 0) / latencies.length;
  }
}

// ============================================================================
// 6. STORAGE PROVIDERS
// ============================================================================

class IndexedDBStorage {
  constructor(options) {
    this.options = options;
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(this.options.dbName, this.options.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(this.options.storeName)) {
          const store = db.createObjectStore(this.options.storeName, {
            keyPath: this.options.keyPath
          });
          
          // Create indexes
          this.options.indexes.forEach(index => {
            store.createIndex(index.name, index.keyPath, { unique: index.unique });
          });
        }
      };
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.options.storeName], 'readwrite');
      const store = transaction.objectStore(this.options.storeName);
      
      const request = store.add(data);
      
      request.onsuccess = () => resolve({ ...data, _id: request.result });
      request.onerror = () => reject(request.error);
    });
  }

  async read(query) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.options.storeName], 'readonly');
      const store = transaction.objectStore(this.options.storeName);
      
      if (query._id) {
        const request = store.get(query._id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } else {
        const request = store.getAll();
        request.onsuccess = () => {
          let results = request.result;
          
          // Apply filters
          Object.keys(query).forEach(key => {
            if (key !== '_id') {
              results = results.filter(item => item[key] === query[key]);
            }
          });
          
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      }
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.options.storeName], 'readwrite');
      const store = transaction.objectStore(this.options.storeName);
      
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const existing = getRequest.result;
        if (!existing) {
          reject(new Error('Record not found'));
          return;
        }
        
        const updated = { ...existing, ...data };
        const putRequest = store.put(updated);
        
        putRequest.onsuccess = () => resolve(updated);
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.options.storeName], 'readwrite');
      const store = transaction.objectStore(this.options.storeName);
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve({ id, deleted: true });
      request.onerror = () => reject(request.error);
    });
  }
}

class LocalStorage {
  constructor(options) {
    this.prefix = options.prefix;
    this.quota = options.quota;
  }

  async initialize() {
    if (typeof localStorage === 'undefined') {
      throw new Error('LocalStorage not supported');
    }
    return Promise.resolve();
  }

  async create(data) {
    const id = data._id || this.generateId();
    const key = this.prefix + id;
    const item = { ...data, _id: id };
    
    localStorage.setItem(key, JSON.stringify(item));
    return item;
  }

  async read(query) {
    const results = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          
          let match = true;
          Object.keys(query).forEach(filterKey => {
            if (item[filterKey] !== query[filterKey]) {
              match = false;
            }
          });
          
          if (match) {
            results.push(item);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
    
    if (query._id) {
      return results[0] || null;
    }
    
    return results;
  }

  async update(id, data) {
    const key = this.prefix + id;
    const existing = localStorage.getItem(key);
    
    if (!existing) {
      throw new Error('Record not found');
    }
    
    const updated = { ...JSON.parse(existing), ...data };
    localStorage.setItem(key, JSON.stringify(updated));
    
    return updated;
  }

  async delete(id) {
    const key = this.prefix + id;
    localStorage.removeItem(key);
    return { id, deleted: true };
  }

  generateId() {
    return 'ls_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

class MemoryStorage {
  constructor(options) {
    this.data = new Map();
    this.maxItems = options.maxItems;
    this.ttl = options.ttl;
    this.expiry = new Map();
    
    // Cleanup expired items
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  async initialize() {
    return Promise.resolve();
  }

  async create(data) {
    const id = data._id || this.generateId();
    const item = { ...data, _id: id };
    
    if (this.data.size >= this.maxItems) {
      // Remove oldest item
      const oldestKey = this.data.keys().next().value;
      this.data.delete(oldestKey);
      this.expiry.delete(oldestKey);
    }
    
    this.data.set(id, item);
    this.expiry.set(id, Date.now() + this.ttl);
    
    return item;
  }

  async read(query) {
    const results = [];
    
    for (const item of this.data.values()) {
      let match = true;
      
      Object.keys(query).forEach(key => {
        if (item[key] !== query[key]) {
          match = false;
        }
      });
      
      if (match) {
        results.push(item);
      }
    }
    
    if (query._id) {
      return results[0] || null;
    }
    
    return results;
  }

  async update(id, data) {
    const existing = this.data.get(id);
    
    if (!existing) {
      throw new Error('Record not found');
    }
    
    const updated = { ...existing, ...data };
    this.data.set(id, updated);
    this.expiry.set(id, Date.now() + this.ttl);
    
    return updated;
  }

  async delete(id) {
    this.data.delete(id);
    this.expiry.delete(id);
    return { id, deleted: true };
  }

  generateId() {
    return 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  cleanup() {
    const now = Date.now();
    
    for (const [id, expiry] of this.expiry.entries()) {
      if (now > expiry) {
        this.data.delete(id);
        this.expiry.delete(id);
      }
    }
  }
}

// ============================================================================
// 7. CACHE MANAGER
// ============================================================================
class CacheManager {
  constructor(options) {
    this.options = options;
    this.storage = null;
  }

  async initialize() {
    switch (this.options.provider) {
      case 'localStorage':
        this.storage = new LocalStorage({
          prefix: this.options.prefix,
          quota: 5242880
        });
        break;
      case 'memory':
        this.storage = new MemoryStorage({
          maxItems: 1000,
          ttl: this.options.ttl
        });
        break;
      default:
        throw new Error('Unsupported cache provider');
    }
    
    await this.storage.initialize();
  }

  async get(key) {
    try {
      const result = await this.storage.read({ _id: key });
      return result ? result.data : null;
    } catch (error) {
      return null;
    }
  }

  async set(key, data) {
    try {
      await this.storage.create({
        _id: key,
        data,
        timestamp: Date.now(),
        ttl: Date.now() + this.options.ttl
      });
    } catch (error) {
      // Cache failures shouldn't break application
      console.warn('Cache set failed:', error);
    }
  }

  async delete(key) {
    try {
      await this.storage.delete(key);
    } catch (error) {
      // Ignore cache deletion errors
    }
  }

  async invalidatePattern(pattern) {
    // Simple pattern matching for cache invalidation
    if (this.options.provider === 'memory') {
      const memoryStorage = this.storage;
      for (const key of memoryStorage.data.keys()) {
        if (key.includes(pattern)) {
          await this.delete(key);
        }
      }
    }
  }
}

// ============================================================================
// 8. VALIDATOR
// ============================================================================
class Validator {
  constructor(options) {
    this.schema = options.schema;
    this.strict = options.strict;
  }

  validate(data, operation = 'create') {
    const errors = [];
    const validated = { ...data };
    
    // Validate each field
    Object.entries(this.schema.fields).forEach(([fieldName, fieldConfig]) => {
      const value = data[fieldName];
      
      // Check required fields
      if (fieldConfig.required && operation === 'create') {
        if (value === undefined || value === null || value === '') {
          errors.push({
            field: fieldName,
            message: `Field '${fieldName}' is required`,
            code: 'REQUIRED'
          });
          return;
        }
      }
      
      // Skip validation if value is not provided
      if (value === undefined || value === null) {
        return;
      }
      
      // Type validation
      if (!this.validateType(fieldName, value, fieldConfig.type)) {
        errors.push({
          field: fieldName,
          message: `Field '${fieldName}' must be of type ${fieldConfig.type}`,
          code: 'TYPE_MISMATCH'
        });
        return;
      }
      
      // String validations
      if (fieldConfig.type === 'string') {
        if (fieldConfig.min && value.length < fieldConfig.min) {
          errors.push({
            field: fieldName,
            message: `Field '${fieldName}' must be at least ${fieldConfig.min} characters`,
            code: 'MIN_LENGTH'
          });
        }
        
        if (fieldConfig.max && value.length > fieldConfig.max) {
          errors.push({
            field: fieldName,
            message: `Field '${fieldName}' must be at most ${fieldConfig.max} characters`,
            code: 'MAX_LENGTH'
          });
        }
        
        if (fieldConfig.format === 'email' && !this.isValidEmail(value)) {
          errors.push({
            field: fieldName,
            message: `Field '${fieldName}' must be a valid email address`,
            code: 'INVALID_FORMAT'
          });
        }
        
        if (fieldConfig.enum && !fieldConfig.enum.includes(value)) {
          errors.push({
            field: fieldName,
            message: `Field '${fieldName}' must be one of: ${fieldConfig.enum.join(', ')}`,
            code: 'INVALID_VALUE'
          });
        }
      }
      
      // Number validations
      if (fieldConfig.type === 'number') {
        if (fieldConfig.min !== undefined && value < fieldConfig.min) {
          errors.push({
            field: fieldName,
            message: `Field '${fieldName}' must be at least ${fieldConfig.min}`,
            code: 'MIN_VALUE'
          });
        }
        
        if (fieldConfig.max !== undefined && value > fieldConfig.max) {
          errors.push({
            field: fieldName,
            message: `Field '${fieldName}' must be at most ${fieldConfig.max}`,
            code: 'MAX_VALUE'
          });
        }
      }
      
      // Array validations
      if (fieldConfig.type === 'array') {
        if (!Array.isArray(value)) {
          errors.push({
            field: fieldName,
            message: `Field '${fieldName}' must be an array`,
            code: 'TYPE_MISMATCH'
          });
        } else {
          if (fieldConfig.minItems && value.length < fieldConfig.minItems) {
            errors.push({
              field: fieldName,
              message: `Field '${fieldName}' must have at least ${fieldConfig.minItems} items`,
              code: 'MIN_ITEMS'
            });
          }
        }
      }
    });
    
    if (errors.length > 0) {
      throw new ActionError('validation', '001', 'Validation failed', { errors });
    }
    
    return validated;
  }

  validateType(fieldName, value, expectedType) {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'timestamp':
        return !isNaN(Date.parse(value));
      default:
        return true;
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// ============================================================================
// 9. ACTIONFRAMEWORK MAIN CLASS
// ============================================================================
class ActionFramework {
  static instance = null;
  
  constructor(config = {}) {
    if (ActionFramework.instance) {
      return ActionFramework.instance;
    }
    
    // Merge config with defaults
    this.config = this.mergeConfigs(APP_CONFIG, config);
    
    // Initialize components
    this.entities = new Map();
    this.logger = this.initLogger();
    this.monitor = this.initMonitor();
    this.hooks = this.initHooks();
    this.cache = new CacheManager({
      provider: this.config.cache.provider,
      ttl: this.config.cache.ttl.default
    });
    
    // Register error handler
    this.registerErrorHandler();
    
    ActionFramework.instance = this;
    
    console.log(`ActionFramework v${this.config.meta.version} initialized in ${this.config.meta.environment} mode`);
  }
  
  mergeConfigs(base, override) {
    const result = { ...base };
    
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };
    
    return deepMerge(result, override);
  }
  
  initLogger() {
    return {
      log: (level, message, meta = {}) => {
        const timestamp = new Date().toISOString();
        const logEntry = {
          timestamp,
          level,
          message,
          ...meta,
          environment: this.config.meta.environment,
          instance: this.config.meta.instance
        };
        
        if (this.config.logging.transports.console.enabled) {
          const format = this.config.logging.transports.console.format;
          if (format === 'json') {
            console.log(JSON.stringify(logEntry));
          } else {
            console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
          }
        }
      },
      
      error: (data) => this.log('error', data.message || 'Error occurred', data),
      warn: (data) => this.log('warn', data.message || 'Warning', data),
      info: (data) => this.log('info', data.message || 'Info', data),
      debug: (data) => {
        if (this.config.runtime.debug) {
          this.log('debug', data.message || 'Debug', data);
        }
      },
      audit: (data) => {
        if (this.config.logging.levels.audit) {
          this.log('audit', data.message || 'Audit', data);
        }
      }
    };
  }
  
  initMonitor() {
    return {
      metrics: {
        requests: [],
        errors: [],
        latency: []
      },
      
      recordRequest: (request) => {
        if (this.metrics.requests.length > 1000) {
          this.metrics.requests.shift();
        }
        this.metrics.requests.push({
          ...request,
          timestamp: Date.now()
        });
      },
      
      recordError: (error) => {
        if (this.metrics.errors.length > 1000) {
          this.metrics.errors.shift();
        }
        this.metrics.errors.push({
          code: error.code,
          category: error.category,
          timestamp: Date.now()
        });
      },
      
      recordLatency: (operation, duration) => {
        if (this.metrics.latency.length > 1000) {
          this.metrics.latency.shift();
        }
        this.metrics.latency.push({
          operation,
          duration,
          timestamp: Date.now()
        });
      },
      
      getMetrics: () => {
        const now = Date.now();
        const lastMinute = now - 60000;
        
        const recentRequests = this.metrics.requests.filter(r => r.timestamp > lastMinute);
        const recentErrors = this.metrics.errors.filter(e => e.timestamp > lastMinute);
        
        return {
          requestsPerMinute: recentRequests.length,
          errorsPerMinute: recentErrors.length,
          errorRate: recentRequests.length > 0 ? recentErrors.length / recentRequests.length : 0,
          latency: this.calculateLatencyMetrics()
        };
      },
      
      calculateLatencyMetrics: () => {
        if (this.metrics.latency.length === 0) return { avg: 0, p95: 0, p99: 0 };
        
        const sorted = [...this.metrics.latency].sort((a, b) => a.duration - b.duration);
        const avg = sorted.reduce((sum, item) => sum + item.duration, 0) / sorted.length;
        const p95 = sorted[Math.floor(sorted.length * 0.95)]?.duration || 0;
        const p99 = sorted[Math.floor(sorted.length * 0.99)]?.duration || 0;
        
        return { avg, p95, p99 };
      }
    };
  }
  
  initHooks() {
    return {
      generateId: (data) => {
        data.data._id = 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      },
      
      setTimestamps: (data) => {
        const now = new Date().toISOString();
        if (!data.data.metadata) {
          data.data.metadata = {};
        }
        
        if (data.operation === 'create') {
          data.data.metadata.createdAt = now;
          data.data.metadata.createdBy = data.context.user?.userId || 'system';
        }
        
        if (data.operation === 'create' || data.operation === 'update') {
          data.data.metadata.updatedAt = now;
          data.data.metadata.updatedBy = data.context.user?.userId || 'system';
        }
      },
      
      validateSchema: async (data, entity) => {
        // Schema validation happens in entity
      },
      
      cache: async (data, entity) => {
        await entity.cache.set(data.data._id, data.data);
      },
      
      clearCache: async (data, entity) => {
        await entity.cache.delete(data.id);
        await entity.cache.invalidatePattern(`${entity.name}_list_*`);
      }
    };
  }
  
  registerErrorHandler() {
    // Global error handler
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        const error = ActionError.fromError(event.error, { source: 'window.error' });
        error.log();
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        const error = ActionError.fromError(event.reason, { source: 'unhandledrejection' });
        error.log();
      });
    }
    
    if (typeof process !== 'undefined') {
      process.on('uncaughtException', (error) => {
        const actionError = ActionError.fromError(error, { source: 'uncaughtException' });
        actionError.log();
        
        if (!actionError.recoverable) {
          console.error('Unrecoverable error, exiting...');
          process.exit(1);
        }
      });
      
      process.on('unhandledRejection', (reason, promise) => {
        const actionError = ActionError.fromError(reason, { source: 'unhandledRejection' });
        actionError.log();
      });
    }
  }
  
  getEntity(entityName) {
    if (!this.entities.has(entityName)) {
      const entity = new ActionEntity(entityName);
      this.entities.set(entityName, entity);
    }
    return this.entities.get(entityName);
  }
  
  static getLogger() {
    return ActionFramework.instance?.logger || console;
  }
  
  static getMonitor() {
    return ActionFramework.instance?.monitor;
  }
  
  static getHook(hookName) {
    return ActionFramework.instance?.hooks[hookName];
  }
  
  async health() {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: this.config.meta.version,
      environment: this.config.meta.environment,
      platform: RUNTIME.platform,
      entities: {}
    };
    
    // Check entity health
    for (const [entityName, entity] of this.entities) {
      try {
        const metrics = entity.getMetrics();
        health.entities[entityName] = {
          status: 'healthy',
          operations: metrics
        };
      } catch (error) {
        health.entities[entityName] = {
          status: 'unhealthy',
          error: error.message
        };
        health.status = 'degraded';
      }
    }
    
    // Check storage health
    try {
      await this.cache.initialize();
      health.cache = 'healthy';
    } catch (error) {
      health.cache = 'unhealthy';
      health.status = 'degraded';
    }
    
    // Get system metrics
    if (RUNTIME.platform === 'node') {
      health.system = {
        memory: process.memoryUsage(),
        uptime: process.uptime()
      };
    }
    
    return health;
  }
  
  async startServer(port = this.config.runtime.server?.port || 3000) {
    if (RUNTIME.platform !== 'node') {
      throw new Error('HTTP server only available in Node.js');
    }
    
    const http = require('http');
    
    const server = http.createServer(async (req, res) => {
      const requestId = 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const startTime = Date.now();
      
      // Set CORS headers
      if (this.config.runtime.security.cors.enabled) {
        const origin = req.headers.origin;
        const allowedOrigins = this.config.runtime.security.cors.origins;
        
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin || '*');
          res.setHeader('Access-Control-Allow-Methods', 
            this.config.runtime.security.cors.methods.join(','));
          res.setHeader('Access-Control-Allow-Headers',
            this.config.runtime.security.cors.headers.join(','));
          
          if (this.config.runtime.security.cors.credentials) {
            res.setHeader('Access-Control-Allow-Credentials', 'true');
          }
        }
        
        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }
      }
      
      // Parse request
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      
      req.on('end', async () => {
        try {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const route = `${req.method} ${url.pathname}`;
          
          // Find matching route
          const routeConfig = this.config.routes.endpoints.find(endpoint => {
            const routePattern = endpoint.path.replace(/:\w+/g, '([^/]+)');
            const regex = new RegExp(`^${routePattern}$`);
            return req.method === endpoint.method && regex.test(url.pathname);
          });
          
          if (!routeConfig) {
            throw new ActionError('validation', '005', 'Route not found', { route });
          }
          
          // Parse body
          let data = {};
          if (body) {
            try {
              data = JSON.parse(body);
            } catch {
              throw new ActionError('validation', '006', 'Invalid JSON body');
            }
          }
          
          // Extract path parameters
          const pathParams = {};
          const pathParts = url.pathname.split('/');
          const configParts = routeConfig.path.split('/');
          
          configParts.forEach((part, index) => {
            if (part.startsWith(':')) {
              const paramName = part.substring(1);
              pathParams[paramName] = pathParts[index];
            }
          });
          
          // Create context
          const context = {
            requestId,
            user: { userId: 'guest', role: 'guest' }, // Would come from auth middleware
            headers: req.headers,
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
          };
          
          // Merge data
          const requestData = { ...data, ...pathParams, ...Object.fromEntries(url.searchParams) };
          
          // Execute action
          const [entityName, action] = routeConfig.action.split('.');
          const entity = this.getEntity(entityName);
          
          let result;
          switch (action) {
            case 'create':
              result = await entity.create(requestData, context);
              break;
            case 'read':
              result = await entity.read(requestData, context);
              break;
            case 'readOne':
              result = await entity.read({ _id: requestData.id }, context);
              break;
            case 'update':
              result = await entity.update(requestData.id, requestData, context);
              break;
            case 'delete':
              result = await entity.delete(requestData.id, context);
              break;
            default:
              throw new ActionError('validation', '007', `Unknown action: ${action}`);
          }
          
          // Send response
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId
          });
          
          res.end(JSON.stringify(result));
          
          // Record metrics
          const duration = Date.now() - startTime;
          this.monitor.recordLatency(route, duration);
          this.monitor.recordRequest({
            route,
            method: req.method,
            status: 200,
            duration
          });
          
        } catch (error) {
          const actionError = ActionError.fromError(error, { requestId });
          
          res.writeHead(actionError.httpStatus, {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId
          });
          
          res.end(JSON.stringify(actionError.toJSON()));
          
          actionError.log();
          
          // Record error metrics
          this.monitor.recordError(actionError);
        }
      });
    });
    
    return new Promise((resolve) => {
      server.listen(port, () => {
        console.log(`ActionFramework server listening on port ${port}`);
        console.log(`Environment: ${this.config.meta.environment}`);
        console.log(`Health endpoint: http://localhost:${port}/health`);
        console.log(`API prefix: ${this.config.routes.api.prefix}`);
        resolve(server);
      });
    });
  }
}

// ============================================================================
// 10. EXPORT AND INITIALIZATION
// ============================================================================

// Export everything
export {
  RUNTIME,
  ERROR_CONFIG,
  APP_CONFIG,
  ActionError,
  ActionEntity,
  ActionFramework,
  IndexedDBStorage,
  LocalStorage,
  MemoryStorage,
  CacheManager,
  Validator
};

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  window.ActionFramework = ActionFramework;
}

// Usage example
/*
// 1. Initialize framework
const framework = new ActionFramework();

// 2. Get entity
const userEntity = framework.getEntity('user');

// 3. Create record
try {
  const result = await userEntity.create({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'secure123'
  }, {
    user: { userId: 'system', role: 'admin' },
    requestId: 'req_123'
  });
  console.log('Created:', result);
} catch (error) {
  console.error('Error:', error.toJSON());
}

// 4. Start server (Node.js only)
if (RUNTIME.platform === 'node') {
  await framework.startServer();
}

// 5. Check health
const health = await framework.health();
console.log('Health:', health);
*/

// Export default
export default ActionFramework;