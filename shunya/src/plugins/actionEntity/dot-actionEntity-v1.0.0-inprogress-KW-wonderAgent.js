/*
Overview: Encapsulate entity lifecycle management and request handling for the ActionEntity plugin.
Purpose: Provide a dedicated module that loads entity schemas, validates payloads, and orchestrates CRUD flows.
Audience: Plugin integrators, automation scripts, and orchestration agents invoking entity actions.
Problem Addressed: Prevent sprawling logic inside the generic plugin entry point and centralize schema-aware flows.
Use Cases: Create, read, update, delete, and list entity data while managing storage initialization and cache hints.
Features: Schema validation, cache-aware reads, storage bootstrap, hook placeholders, and TTL-driven cache cleanup.
Benefits: Improved modularity, clearer exports, and easier testing of ActionEntity behavior.
User Stories: As an automation agent, I can call `processRequest` and rely on consistent validation and persistence.
User Flow: Initialize configs, process a request, and receive structured responses with cache metadata.
System Components: Depends on ActionFs for storage and SchemaValidator for enforcement.
Edge Cases: Handles missing configs, validation failures, cache expirations, and absent IDs.
Test Cases: CRUD scenarios for each action plus cache hits, list filters, and schema violations.
Configuration:
- version: v1.0.0
- status: inprogress
- agent: KW-wonderAgent
Schema:
- type: object
- properties:
  - ActionFs: object
  - SchemaValidator: object
  - DATASETS: object
  - ENTITY_CONFIGS: object
*/

import path from 'path';
import fsPromises from 'fs/promises';
import { ActionFs } from './dot-actionFs-v1.0.0-inprogress-KW-wonderAgent.js';

const DATASETS = {
  action: ['create', 'read', 'update', 'delete', 'list'],
  entity: ['user_register', 'user_session', 'alarm', 'search_query', 'datatable'],
  field_types: ['string', 'number', 'boolean', 'date', 'array', 'object'],
  status_codes: ['success', 'error']
};

const ENTITY_CONFIGS = {
  user_register: {
    id: 'user_register',
    name: 'User Register',
    type: 'entity',
    dbSchema: {
      properties: {
        id: { type: 'string' },
        username: { type: 'string', validate: { required: true, minLength: 3 } },
        email: { type: 'string', validate: { required: true, format: 'email' } },
        password: { type: 'string', validate: { required: true, minLength: 6 } },
        userId: { type: 'string', validate: { required: true } },
        role: { type: 'string', default: 'user' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    },
    storage: {
      driver: 'fs',
      path: './data/user_register',
      file: 'users.json',
      format: 'json'
    },
    cacheHints: {
      ttl: 300,
      keys: ['user_register_list']
    }
  },
  user_session: {
    id: 'user_session',
    name: 'User Session',
    type: 'entity',
    dbSchema: {
      properties: {
        id: { type: 'string' },
        sessionId: { type: 'string', validate: { required: true } },
        userId: { type: 'string', validate: { required: true } },
        username: { type: 'string' },
        token: { type: 'string' },
        expiresAt: { type: 'string' },
        createdAt: { type: 'string' }
      }
    },
    storage: {
      driver: 'fs',
      path: './data/user_session',
      file: 'sessions.json',
      format: 'json'
    }
  },
  alarm: {
    id: 'alarm',
    name: 'Alarm',
    type: 'entity',
    dbSchema: {
      properties: {
        id: { type: 'string' },
        message: { type: 'string', validate: { required: true } },
        severity: { type: 'string', validate: { required: true, enum: ['critical', 'high', 'medium', 'low'] } },
        status: { type: 'string', default: 'active' },
        createdAt: { type: 'string' },
        acknowledgedAt: { type: 'string' }
      }
    },
    storage: {
      driver: 'fs',
      path: './data/alarm',
      file: 'alarms.json',
      format: 'json'
    }
  }
};

class SchemaValidator {
  static validate(data, schema, isUpdate) {
    const errors = [];

    if (!schema || !schema.properties) {
      return ['Schema properties not defined'];
    }

    const properties = schema.properties;

    if (!isUpdate) {
      for (const fieldName in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, fieldName) === false) {
          continue;
        }
        const fieldSchema = properties[fieldName];
        const validate = fieldSchema.validate || {};
        const value = data[fieldName];

        if (validate.required && (value === undefined || value === null || value === '')) {
          errors.push(fieldName + ' is required');
        }
      }
    }

    for (const fieldName in data) {
      if (Object.prototype.hasOwnProperty.call(data, fieldName) === false) {
        continue;
      }
      const value = data[fieldName];
      const fieldSchema = properties[fieldName];

      if (!fieldSchema) {
        errors.push('Field ' + fieldName + ' not allowed in schema');
        continue;
      }

      const validate = fieldSchema.validate || {};
      const fieldType = fieldSchema.type;

      if (isUpdate && (value === undefined || value === null)) {
        continue;
      }

      if (fieldType && SchemaValidator.checkType(value, fieldType) === false) {
        errors.push(fieldName + ' should be type ' + fieldType);
      }

      if (typeof value === 'string') {
        if (validate.minLength && value.length < validate.minLength) {
          errors.push(fieldName + ' must be at least ' + validate.minLength + ' characters');
        }

        if (validate.maxLength && value.length > validate.maxLength) {
          errors.push(fieldName + ' must be at most ' + validate.maxLength + ' characters');
        }

        if (validate.format === 'email' && SchemaValidator.isValidEmail(value) === false) {
          errors.push(fieldName + ' must be a valid email');
        }

        if (validate.pattern && new RegExp(validate.pattern).test(value) === false) {
          errors.push(fieldName + ' must match pattern ' + validate.pattern);
        }
      }

      if (validate.enum && validate.enum.indexOf(value) === -1) {
        errors.push(fieldName + ' must be one of: ' + validate.enum.join(', '));
      }
    }

    return errors;
  }

  static checkType(value, expectedType) {
    if (expectedType === 'array') {
      return Array.isArray(value);
    }
    if (expectedType === 'object') {
      return typeof value === 'object' && value !== null && Array.isArray(value) === false;
    }
    if (expectedType === 'date') {
      if (typeof value === 'string') {
        return isNaN(Date.parse(value)) === false;
      }
      return value instanceof Date;
    }
    return typeof value === expectedType;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

class ActionEntity {
  constructor(config) {
    const baseConfig = config || {};
    this.config = baseConfig;
    this.actions = baseConfig.dataset?.action || DATASETS.action;
    this.entities = baseConfig.dataset?.entity || DATASETS.entity;
    this.storageBase = baseConfig.storage?.basePath || './data';
    this.storage = new ActionFs(this.storageBase);
    this.entityConfigs = {};
    this.cacheEnabled = baseConfig.cache !== false;
    this.cache = new Map();
    this.ready = false;
  }

  async initialize() {
    console.log('Initializing ActionEntity...');
    const configsPath = path.join(this.storage.basePath, 'configs');
    await fsPromises.mkdir(configsPath, { recursive: true });

    for (let i = 0; i < this.entities.length; i += 1) {
      const entityName = this.entities[i];
      try {
        const config = ENTITY_CONFIGS[entityName];
        if (config) {
          const configPath = path.join(configsPath, 'entity_' + entityName + '_config.json');
          await fsPromises.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
        }

        this.entityConfigs[entityName] = config || {};
        const storageConfig = config?.storage || {};
        const storagePath = storageConfig.path || './data/' + entityName;
        const fileName = storageConfig.file || entityName + '.json';
        const fullPath = path.resolve(storagePath, fileName);
        const format = storageConfig.format || 'json';
        const fileExists = await this.storage.fileExists(fullPath);

        if (fileExists === false) {
          console.log('Creating storage for ' + entityName + ' at ' + fullPath + '...');
          let initialContent = [];
          if (format === 'csv' && config?.dbSchema?.properties) {
            initialContent = [{}];
          }
          await this.storage.createFile(fullPath, initialContent, format);
        }
      } catch (error) {
        console.error('Failed to initialize entity ' + entityName + ':', error.message);
      }
    }

    console.log('Loaded ' + Object.keys(this.entityConfigs).length + ' entity configs');
    this.ready = true;
    return this;
  }

  async processRequest(request) {
    if (this.ready === false) {
      throw new Error('ActionEntity not initialized. Call initialize() first.');
    }

    const entity = request.entity;
    const action = request.action;
    const data = request.data;
    const id = request.id;
    const response = {
      success: false,
      data: null,
      meta: {
        entity: entity,
        action: action,
        timestamp: new Date().toISOString(),
        cacheHit: false
      },
      error: null
    };

    try {
      if (this.entities.indexOf(entity) === -1) {
        throw new Error('Unknown entity: ' + entity);
      }

      if (this.actions.indexOf(action) === -1) {
        throw new Error('Unknown action: ' + action);
      }

      const entityConfig = this.entityConfigs[entity];
      if (!entityConfig) {
        throw new Error('Config not loaded for entity: ' + entity);
      }

      if (action !== 'delete' && action !== 'list' && data !== undefined) {
        const isUpdate = action === 'update';
        const validationErrors = SchemaValidator.validate(data, entityConfig.dbSchema, isUpdate);
        if (validationErrors.length > 0) {
          throw new Error('Validation failed: ' + validationErrors.join(', '));
        }
      }

      let result;
      if (action === 'create') {
        result = await this.executeCreate(entity, data, entityConfig);
      } else if (action === 'read') {
        if (!id) {
          throw new Error('ID required for read action');
        }
        result = await this.executeRead(entity, id, entityConfig);
      } else if (action === 'update') {
        if (!id) {
          throw new Error('ID required for update action');
        }
        result = await this.executeUpdate(entity, id, data, entityConfig);
      } else if (action === 'delete') {
        if (!id) {
          throw new Error('ID required for delete action');
        }
        result = await this.executeDelete(entity, id, entityConfig);
      } else if (action === 'list') {
        result = await this.executeList(entity, data || {}, entityConfig);
      } else {
        throw new Error('Unsupported action: ' + action);
      }

      response.success = true;
      response.data = result;
      response.meta.cacheHit = result?.cacheHit || false;
    } catch (error) {
      response.error = {
        code: 'EXECUTION_ERROR',
        message: error.message
      };
    }

    return response;
  }

  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async executeCreate(entity, data, config) {
    const id = this.generateId();
    const now = new Date().toISOString();
    const record = {
      id: id,
      createdAt: now,
      updatedAt: now
    };

    const dataKeys = Object.keys(data);
    for (let i = 0; i < dataKeys.length; i += 1) {
      const key = dataKeys[i];
      record[key] = data[key];
    }

    if (config.hooks?.beforeCreate?.includes('hashPassword') && record.password) {
      record.password = this.hashPassword(record.password);
    }

    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || './data/' + entity;
    const fileName = storageConfig.file || entity + '.json';
    const fullPath = path.resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    const records = await this.storage.readFile(fullPath, format);

    records.push(record);
    await this.storage.writeFile(fullPath, records, format);
    console.log('Created ' + entity + ' record with ID: ' + id);

    const returnRecord = {};
    const recordKeys = Object.keys(record);
    for (let i = 0; i < recordKeys.length; i += 1) {
      const key = recordKeys[i];
      returnRecord[key] = record[key];
    }

    if (config.hooks?.afterCreate?.includes('stripPassword')) {
      delete returnRecord.password;
    }

    if (this.cacheEnabled) {
      this.cache.delete(entity + ':list');
    }

    return returnRecord;
  }

  async executeRead(entity, id, config) {
    if (this.cacheEnabled) {
      const cacheKey = entity + ':' + id;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit for ' + cacheKey);
        const cachedResult = {};
        const cachedKeys = Object.keys(cached);
        for (let i = 0; i < cachedKeys.length; i += 1) {
          const key = cachedKeys[i];
          cachedResult[key] = cached[key];
        }
        cachedResult.cacheHit = true;
        return cachedResult;
      }
    }

    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || './data/' + entity;
    const fileName = storageConfig.file || entity + '.json';
    const fullPath = path.resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    const records = await this.storage.readFile(fullPath, format);

    let record = null;
    for (let i = 0; i < records.length; i += 1) {
      if (records[i].id === id) {
        record = records[i];
        break;
      }
    }

    if (!record) {
      throw new Error('Record not found: ' + id);
    }

    if (this.cacheEnabled) {
      const cacheKey = entity + ':' + id;
      const ttl = config.cacheHints?.ttl || 300;
      const cachedRecord = {};
      const recordKeys = Object.keys(record);
      for (let i = 0; i < recordKeys.length; i += 1) {
        const key = recordKeys[i];
        cachedRecord[key] = record[key];
      }
      cachedRecord.cacheHit = false;
      this.cache.set(cacheKey, cachedRecord);
      console.log('Cached ' + cacheKey + ' with TTL: ' + ttl + 's');
      setTimeout(function () {
        this.cache.delete(cacheKey);
        console.log('Cache expired for ' + cacheKey);
      }.bind(this), ttl * 1000);
    }

    const result = {};
    const recordKeys = Object.keys(record);
    for (let i = 0; i < recordKeys.length; i += 1) {
      const key = recordKeys[i];
      result[key] = record[key];
    }

    result.cacheHit = false;
    return result;
  }

  async executeUpdate(entity, id, data, config) {
    const existingResult = await this.executeRead(entity, id, config);
    const existing = existingResult;
    const now = new Date().toISOString();
    const updatedRecord = {};
    const existingKeys = Object.keys(existing);
    for (let i = 0; i < existingKeys.length; i += 1) {
      const key = existingKeys[i];
      updatedRecord[key] = existing[key];
    }

    const dataKeys = Object.keys(data);
    for (let i = 0; i < dataKeys.length; i += 1) {
      const key = dataKeys[i];
      updatedRecord[key] = data[key];
    }

    updatedRecord.updatedAt = now;
    updatedRecord.id = id;

    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || './data/' + entity;
    const fileName = storageConfig.file || entity + '.json';
    const fullPath = path.resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    const records = await this.storage.readFile(fullPath, format);

    let index = -1;
    for (let i = 0; i < records.length; i += 1) {
      if (records[i].id === id) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      throw new Error('Record not found for update: ' + id);
    }

    records[index] = updatedRecord;
    await this.storage.writeFile(fullPath, records, format);
    console.log('Updated ' + entity + ' record: ' + id);

    if (this.cacheEnabled) {
      this.cache.delete(entity + ':' + id);
      this.cache.delete(entity + ':list');
      console.log('Invalidated cache for ' + entity + ':' + id + ' and ' + entity + ':list');
    }

    return updatedRecord;
  }

  async executeDelete(entity, id, config) {
    await this.executeRead(entity, id, config);

    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || './data/' + entity;
    const fileName = storageConfig.file || entity + '.json';
    const fullPath = path.resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    const records = await this.storage.readFile(fullPath, format);

    const filteredRecords = [];
    for (let i = 0; i < records.length; i += 1) {
      if (records[i].id !== id) {
        filteredRecords.push(records[i]);
      }
    }

    if (filteredRecords.length === records.length) {
      throw new Error('Record not found for deletion: ' + id);
    }

    await this.storage.writeFile(fullPath, filteredRecords, format);
    console.log('Deleted ' + entity + ' record: ' + id);

    if (this.cacheEnabled) {
      this.cache.delete(entity + ':' + id);
      this.cache.delete(entity + ':list');
      console.log('Invalidated cache for ' + entity + ':' + id + ' and ' + entity + ':list');
    }

    return { deleted: true, id: id };
  }

  async executeList(entity, filters, config) {
    const effectiveFilters = filters || {};

    if (this.cacheEnabled) {
      const cacheKey = entity + ':list';
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit for ' + cacheKey);
        const filtered = this.applyFilters(cached, effectiveFilters);
        const mapped = [];
        for (let i = 0; i < filtered.length; i += 1) {
          const item = filtered[i];
          const copy = {};
          const itemKeys = Object.keys(item);
          for (let j = 0; j < itemKeys.length; j += 1) {
            const field = itemKeys[j];
            copy[field] = item[field];
          }
          copy.cacheHit = true;
          mapped.push(copy);
        }
        return mapped;
      }
    }

    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || './data/' + entity;
    const fileName = storageConfig.file || entity + '.json';
    const fullPath = path.resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    const records = await this.storage.readFile(fullPath, format);
    console.log('Loaded ' + records.length + ' records for ' + entity);

    const filteredRecords = this.applyFilters(records, effectiveFilters);
    const mappedRecords = [];
    for (let i = 0; i < filteredRecords.length; i += 1) {
      const item = filteredRecords[i];
      const copy = {};
      const itemKeys = Object.keys(item);
      for (let j = 0; j < itemKeys.length; j += 1) {
        const field = itemKeys[j];
        copy[field] = item[field];
      }
      copy.cacheHit = false;
      mappedRecords.push(copy);
    }

    if (this.cacheEnabled && records.length > 0) {
      const cacheKey = entity + ':list';
      const ttl = config.cacheHints?.ttl || 300;
      const cachePayload = [];
      for (let i = 0; i < records.length; i += 1) {
        cachePayload.push(records[i]);
      }
      this.cache.set(cacheKey, cachePayload);
      console.log('Cached ' + cacheKey + ' with ' + records.length + ' records, TTL: ' + ttl + 's');
      setTimeout(function () {
        this.cache.delete(cacheKey);
        console.log('Cache expired for ' + cacheKey);
      }.bind(this), ttl * 1000);
    }

    return mappedRecords;
  }

  applyFilters(records, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return records;
    }

    const filtered = [];
    for (let i = 0; i < records.length; i += 1) {
      const record = records[i];
      let matches = true;
      const entries = Object.entries(filters);
      for (let j = 0; j < entries.length; j += 1) {
        const key = entries[j][0];
        const value = entries[j][1];
        if (value === undefined || value === null) {
          continue;
        }
        if (record[key] !== value) {
          matches = false;
          break;
        }
      }
      if (matches) {
        filtered.push(record);
      }
    }
    return filtered;
  }

  hashPassword(password) {
    return Buffer.from(password).toString('base64');
  }
}

export {
  DATASETS,
  ENTITY_CONFIGS,
  SchemaValidator,
  ActionEntity
};
