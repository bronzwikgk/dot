/**
 * ActionEntity v1 - Complete Implementation (Fixed Version)
 * Single file with everything needed for version 1
 */

// ============================================================================
// 1. DATASETS - Validation arrays
// ============================================================================

const DATASETS = {
  action: ['create', 'read', 'update', 'delete', 'list'],
  entity: ['user_register', 'user_session', 'alarm', 'search_query', 'datatable'],
  field_types: ['string', 'number', 'boolean', 'date', 'array', 'object'],
  status_codes: ['success', 'error']
};

// ============================================================================
// 2. ENTITY CONFIGS - Sample entity configurations (FIXED)
// ============================================================================

const ENTITY_CONFIGS = {
  user_register: {
    id: 'user_register',
    name: 'User Register',
    type: 'entity',
    dbSchema: {
      properties: {
        id: { type: 'string' }, // Added ID field
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
        id: { type: 'string' }, // Added ID field
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
      format: 'json' // Changed from jsonl to json for simplicity
    }
  },

  alarm: {
    id: 'alarm',
    name: 'Alarm',
    type: 'entity',
    dbSchema: {
      properties: {
        id: { type: 'string' }, // Added ID field (not required in data)
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
      file: 'alarms.json', // Changed from CSV to JSON for simplicity
      format: 'json'
    }
  }
};

// ============================================================================
// 3. STORAGE ADAPTERS - File system operations (FIXED)
// ============================================================================

class ActionFs {
  constructor(basePath = './data') {
    this.basePath = basePath;
    this.fs = require('fs').promises;
    this.path = require('path');
  }

  async readConfig(filename) {
    try {
      // Try to read from configs directory first
      const configPath = this.path.join(this.basePath, 'configs', filename);
      const content = await this.fs.readFile(configPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      // If file doesn't exist, return from memory configs
      const entityName = filename.replace('entity_', '').replace('_config.json', '');
      return ENTITY_CONFIGS[entityName] || null;
    }
  }

  async fileExists(filePath) {
    try {
      await this.fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async createFile(filePath, content, format = 'json') {
    const dirPath = this.path.dirname(filePath);
    
    // Create directory if it doesn't exist
    await this.fs.mkdir(dirPath, { recursive: true });
    
    // Format content based on file type
    let fileContent = '';
    if (format === 'csv') {
      if (Array.isArray(content) && content.length > 0) {
        const headers = Object.keys(content[0]).join(',');
        const rows = content.map(obj => Object.values(obj).join(','));
        fileContent = [headers, ...rows].join('\n');
      } else {
        fileContent = '';
      }
    } else if (format === 'json') {
      fileContent = JSON.stringify(content, null, 2);
    } else if (format === 'jsonl') {
      if (Array.isArray(content)) {
        fileContent = content.map(item => JSON.stringify(item)).join('\n');
      } else {
        fileContent = JSON.stringify(content);
      }
    } else {
      fileContent = String(content);
    }
    
    await this.fs.writeFile(filePath, fileContent, 'utf8');
    console.log(`Created file: ${filePath}`);
  }

  async readFile(filePath, format = 'json') {
    try {
      const content = await this.fs.readFile(filePath, 'utf8');
      
      if (format === 'csv') {
        const lines = content.trim().split('\n');
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',');
        return lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index] ? values[index].trim() : '';
            });
            return obj;
          });
      } else if (format === 'json') {
        return content ? JSON.parse(content) : [];
      } else if (format === 'jsonl') {
        return content.split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line));
      }
      
      return content;
    } catch (error) {
      // Return empty array for collections
      if (format === 'json' || format === 'jsonl' || format === 'csv') {
        return [];
      }
      return null;
    }
  }

  async writeFile(filePath, data, format = 'json') {
    return this.createFile(filePath, data, format);
  }
}

// ============================================================================
// 4. SCHEMA VALIDATOR - Data validation against schemas (FIXED)
// ============================================================================

class SchemaValidator {
  static validate(data, schema, isUpdate = false) {
    const errors = [];
    
    if (!schema || !schema.properties) {
      return ['Schema properties not defined'];
    }
    
    const properties = schema.properties;
    
    // Only check required fields for create, not for update
    if (!isUpdate) {
      for (const [fieldName, fieldSchema] of Object.entries(properties)) {
        const validate = fieldSchema.validate || {};
        
        if (validate.required && (data[fieldName] === undefined || data[fieldName] === null || data[fieldName] === '')) {
          errors.push(`${fieldName} is required`);
        }
      }
    }
    
    // Validate each field that exists in data (for both create and update)
    for (const [fieldName, value] of Object.entries(data)) {
      if (!properties[fieldName]) {
        errors.push(`Field ${fieldName} not allowed in schema`);
        continue;
      }
      
      const fieldSchema = properties[fieldName];
      const validate = fieldSchema.validate || {};
      const fieldType = fieldSchema.type;
      
      // Skip validation for empty values in updates
      if (isUpdate && (value === undefined || value === null)) {
        continue;
      }
      
      // Type checking
      if (fieldType && !this.checkType(value, fieldType)) {
        errors.push(`${fieldName} should be type ${fieldType}`);
      }
      
      // String validations
      if (typeof value === 'string') {
        if (validate.minLength && value.length < validate.minLength) {
          errors.push(`${fieldName} must be at least ${validate.minLength} characters`);
        }
        
        if (validate.maxLength && value.length > validate.maxLength) {
          errors.push(`${fieldName} must be at most ${validate.maxLength} characters`);
        }
        
        if (validate.format === 'email' && !this.isValidEmail(value)) {
          errors.push(`${fieldName} must be a valid email`);
        }
        
        if (validate.pattern && !new RegExp(validate.pattern).test(value)) {
          errors.push(`${fieldName} must match pattern ${validate.pattern}`);
        }
      }
      
      // Enum validation
      if (validate.enum && !validate.enum.includes(value)) {
        errors.push(`${fieldName} must be one of: ${validate.enum.join(', ')}`);
      }
    }
    
    return errors;
  }
  
  static checkType(value, expectedType) {
    if (expectedType === 'array') return Array.isArray(value);
    if (expectedType === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value);
    if (expectedType === 'date') {
      if (typeof value === 'string') {
        return !isNaN(Date.parse(value));
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

// ============================================================================
// 5. ACTION ENTITY - Main class (FIXED)
// ============================================================================

class ActionEntity {
  constructor(config = {}) {
    // 1. STORE_CONFIG
    this.config = config;
    
    // 2. STORE_DATASETS
    this.actions = config.dataset?.action || DATASETS.action;
    this.entities = config.dataset?.entity || DATASETS.entity;
    
    // 3. INITIALIZE_STORAGE_ADAPTER
    this.storage = new ActionFs(config.storage?.basePath || './data');
    
    // 4. LOAD_ENTITY_CONFIGS
    this.entityConfigs = {};
    
    // 5. INITIALIZE_CACHE
    this.cacheEnabled = config.cache !== false;
    this.cache = new Map();
    
    // 6. SET_READY_FLAG
    this.ready = false;
  }
  
  async initialize() {
    console.log('Initializing ActionEntity...');
    
    // Create configs directory if it doesn't exist
    const fs = require('fs').promises;
    const path = require('path');
    await fs.mkdir(path.join(this.storage.basePath, 'configs'), { recursive: true });
    
    // Load all entity configs
    for (const entityName of this.entities) {
      try {
        // First, save config to file for future use
        const config = ENTITY_CONFIGS[entityName];
        if (config) {
          const configPath = path.join(this.storage.basePath, 'configs', `entity_${entityName}_config.json`);
          await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
        }
        
        // STORE_CONFIG
        this.entityConfigs[entityName] = config || {};
        
        // INITIALIZE_STORAGE_FILES
        const storageConfig = config?.storage || {};
        const storagePath = storageConfig.path || `./data/${entityName}`;
        const fileName = storageConfig.file || `${entityName}.json`;
        const fullPath = path.resolve(storagePath, fileName);
        const format = storageConfig.format || 'json';
        
        const fileExists = await this.storage.fileExists(fullPath);
        
        if (!fileExists) {
          console.log(`Creating storage for ${entityName} at ${fullPath}...`);
          
          // CREATE_FILE based on format
          let initialContent = [];
          if (format === 'csv' && config?.dbSchema?.properties) {
            // Create CSV with headers from schema
            const headers = Object.keys(config.dbSchema.properties);
            initialContent = [{}]; // Empty object to write headers
          }
          
          await this.storage.createFile(fullPath, initialContent, format);
        }
      } catch (error) {
        console.error(`Failed to initialize entity ${entityName}:`, error.message);
      }
    }
    
    console.log(`Loaded ${Object.keys(this.entityConfigs).length} entity configs`);
    this.ready = true;
    return this;
  }
  
  async processRequest(request) {
    if (!this.ready) {
      throw new Error('ActionEntity not initialized. Call initialize() first.');
    }
    
    const { entity, action, data, id } = request;
    const response = {
      success: false,
      data: null,
      meta: {
        entity,
        action,
        timestamp: new Date().toISOString(),
        cacheHit: false
      },
      error: null
    };
    
    try {
      // 1. RECEIVE_REQUEST - Validate entity
      if (!this.entities.includes(entity)) {
        throw new Error(`Unknown entity: ${entity}`);
      }
      
      if (!this.actions.includes(action)) {
        throw new Error(`Unknown action: ${action}`);
      }
      
      // 2. LOAD_ENTITY_CONFIG
      const entityConfig = this.entityConfigs[entity];
      if (!entityConfig) {
        throw new Error(`Config not loaded for entity: ${entity}`);
      }
      
      // 3. VALIDATE_DATA (with isUpdate flag for update operations)
      if (action !== 'delete' && action !== 'list' && data !== undefined) {
        const isUpdate = action === 'update';
        const validationErrors = SchemaValidator.validate(data, entityConfig.dbSchema, isUpdate);
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }
      }
      
      // 4. EXECUTE_ACTION
      let result;
      switch (action) {
        case 'create':
          result = await this.executeCreate(entity, data, entityConfig);
          break;
        case 'read':
          if (!id) throw new Error('ID required for read action');
          result = await this.executeRead(entity, id, entityConfig);
          break;
        case 'update':
          if (!id) throw new Error('ID required for update action');
          result = await this.executeUpdate(entity, id, data, entityConfig);
          break;
        case 'delete':
          if (!id) throw new Error('ID required for delete action');
          result = await this.executeDelete(entity, id, entityConfig);
          break;
        case 'list':
          result = await this.executeList(entity, data || {}, entityConfig);
          break;
        default:
          throw new Error(`Unsupported action: ${action}`);
      }
      
      // 7. RETURN_RESPONSE
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
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  async executeCreate(entity, data, config) {
    // GENERATE_ID
    const id = this.generateId();
    
    // ADD_TIMESTAMPS
    const now = new Date().toISOString();
    const record = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    // RUN_BEFORE_HOOKS (simplified)
    if (config.hooks?.beforeCreate?.includes('hashPassword') && record.password) {
      record.password = this.hashPassword(record.password);
    }
    
    // LOAD_STORAGE
    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || `./data/${entity}`;
    const fileName = storageConfig.file || `${entity}.json`;
    const fullPath = require('path').resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    
    const records = await this.storage.readFile(fullPath, format);
    
    // APPEND_RECORD
    records.push(record);
    
    // SAVE_STORAGE
    await this.storage.writeFile(fullPath, records, format);
    console.log(`Created ${entity} record with ID: ${id}`);
    
    // RUN_AFTER_HOOKS
    const returnRecord = { ...record };
    if (config.hooks?.afterCreate?.includes('stripPassword')) {
      delete returnRecord.password;
    }
    
    // UPDATE_CACHE
    if (this.cacheEnabled) {
      // Invalidate list cache
      this.cache.delete(`${entity}:list`);
    }
    
    return returnRecord;
  }
  
  async executeRead(entity, id, config) {
    // CHECK_CACHE
    if (this.cacheEnabled) {
      const cacheKey = `${entity}:${id}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`Cache hit for ${entity}:${id}`);
        return { ...cached, cacheHit: true };
      }
    }
    
    // LOAD_STORAGE
    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || `./data/${entity}`;
    const fileName = storageConfig.file || `${entity}.json`;
    const fullPath = require('path').resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    
    const records = await this.storage.readFile(fullPath, format);
    
    // FIND_RECORD
    const record = records.find(r => r.id === id);
    if (!record) {
      throw new Error(`Record not found: ${id}`);
    }
    
    // SET_CACHE
    if (this.cacheEnabled) {
      const cacheKey = `${entity}:${id}`;
      const ttl = config.cacheHints?.ttl || 300;
      this.cache.set(cacheKey, { ...record, cacheHit: false });
      console.log(`Cached ${entity}:${id} with TTL: ${ttl}s`);
      
      // Simple TTL cleanup
      setTimeout(() => {
        this.cache.delete(cacheKey);
        console.log(`Cache expired for ${entity}:${id}`);
      }, ttl * 1000);
    }
    
    return { ...record, cacheHit: false };
  }
  
  async executeUpdate(entity, id, data, config) {
    // GET_EXISTING
    const existingResult = await this.executeRead(entity, id, config);
    const existing = existingResult.cacheHit ? existingResult : existingResult;
    
    // MERGE_DATA
    const now = new Date().toISOString();
    const updatedRecord = {
      ...existing,
      ...data,
      updatedAt: now,
      id // Ensure ID doesn't change
    };
    
    // LOAD_STORAGE
    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || `./data/${entity}`;
    const fileName = storageConfig.file || `${entity}.json`;
    const fullPath = require('path').resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    
    const records = await this.storage.readFile(fullPath, format);
    
    // REPLACE_IN_STORAGE
    const index = records.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Record not found for update: ${id}`);
    }
    
    records[index] = updatedRecord;
    
    // SAVE_STORAGE
    await this.storage.writeFile(fullPath, records, format);
    console.log(`Updated ${entity} record: ${id}`);
    
    // INVALIDATE_CACHE
    if (this.cacheEnabled) {
      this.cache.delete(`${entity}:${id}`);
      this.cache.delete(`${entity}:list`);
      console.log(`Invalidated cache for ${entity}:${id} and ${entity}:list`);
    }
    
    return updatedRecord;
  }
  
  async executeDelete(entity, id, config) {
    // GET_EXISTING (verify exists)
    await this.executeRead(entity, id, config);
    
    // LOAD_STORAGE
    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || `./data/${entity}`;
    const fileName = storageConfig.file || `${entity}.json`;
    const fullPath = require('path').resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    
    const records = await this.storage.readFile(fullPath, format);
    
    // REMOVE_FROM_STORAGE
    const filteredRecords = records.filter(r => r.id !== id);
    
    if (filteredRecords.length === records.length) {
      throw new Error(`Record not found for deletion: ${id}`);
    }
    
    // SAVE_STORAGE
    await this.storage.writeFile(fullPath, filteredRecords, format);
    console.log(`Deleted ${entity} record: ${id}`);
    
    // INVALIDATE_CACHE
    if (this.cacheEnabled) {
      this.cache.delete(`${entity}:${id}`);
      this.cache.delete(`${entity}:list`);
      console.log(`Invalidated cache for ${entity}:${id} and ${entity}:list`);
    }
    
    return { deleted: true, id };
  }
  
  async executeList(entity, filters = {}, config) {
    // CHECK_CACHE
    if (this.cacheEnabled) {
      const cacheKey = `${entity}:list`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`Cache hit for ${entity}:list`);
        // Apply filters to cached data
        const filtered = this.applyFilters(cached, filters);
        return filtered.map(item => ({ ...item, cacheHit: true }));
      }
    }
    
    // LOAD_STORAGE
    const storageConfig = config.storage || {};
    const storagePath = storageConfig.path || `./data/${entity}`;
    const fileName = storageConfig.file || `${entity}.json`;
    const fullPath = require('path').resolve(storagePath, fileName);
    const format = storageConfig.format || 'json';
    
    const records = await this.storage.readFile(fullPath, format);
    console.log(`Loaded ${records.length} records for ${entity}`);
    
    // APPLY_FILTERS
    const filteredRecords = this.applyFilters(records, filters);
    
    // SET_CACHE
    if (this.cacheEnabled && records.length > 0) {
      const cacheKey = `${entity}:list`;
      const ttl = config.cacheHints?.ttl || 300;
      this.cache.set(cacheKey, records);
      console.log(`Cached ${entity}:list with ${records.length} records, TTL: ${ttl}s`);
      
      setTimeout(() => {
        this.cache.delete(cacheKey);
        console.log(`Cache expired for ${entity}:list`);
      }, ttl * 1000);
    }
    
    return filteredRecords.map(item => ({ ...item, cacheHit: false }));
  }
  
  applyFilters(records, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return records;
    }
    
    return records.filter(record => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null) return true;
        return record[key] === value;
      });
    });
  }
  
  hashPassword(password) {
    // Simple hash for demo
    return Buffer.from(password).toString('base64');
  }
}

// ============================================================================
// 6. USAGE EXAMPLE (FIXED)
// ============================================================================

async function runExample() {
  console.log('\n=== ActionEntity v1 Fixed Example ===\n');
  
  // Create ActionEntity instance
  const actionEntity = new ActionEntity({
    dataset: {
      action: DATASETS.action,
      entity: DATASETS.entity.slice(0, 3) // Just test with first 3 entities
    },
    storage: {
      basePath: './data'
    },
    cache: true
  });
  
  // Initialize
  await actionEntity.initialize();
  
  // Example 1: Create a user
  console.log('\n1. Creating user...');
  const createRequest = {
    entity: 'user_register',
    action: 'create',
    data: {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      userId: 'user_001',
      role: 'user'
    }
  };
  
  const createResponse = await actionEntity.processRequest(createRequest);
  console.log('Create Response:', JSON.stringify(createResponse, null, 2));
  
  if (createResponse.success) {
    const userId = createResponse.data.id;
    
    // Example 2: Create a session for the user
    console.log('\n2. Creating user session...');
    const sessionRequest = {
      entity: 'user_session',
      action: 'create',
      data: {
        sessionId: 'session_123',
        userId: 'user_001',
        username: 'john_doe',
        token: 'token_abc',
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      }
    };
    
    const sessionResponse = await actionEntity.processRequest(sessionRequest);
    console.log('Session Response:', JSON.stringify(sessionResponse, null, 2));
    
    // Example 3: Create an alarm
    console.log('\n3. Creating alarm...');
    const alarmRequest = {
      entity: 'alarm',
      action: 'create',
      data: {
        message: 'System temperature high',
        severity: 'high',
        status: 'active'
      }
    };
    
    const alarmResponse = await actionEntity.processRequest(alarmRequest);
    console.log('Alarm Response:', JSON.stringify(alarmResponse, null, 2));
    
    // Example 4: List all alarms
    console.log('\n4. Listing alarms...');
    const listAlarmsRequest = {
      entity: 'alarm',
      action: 'list',
      data: {}
    };
    
    const listAlarmsResponse = await actionEntity.processRequest(listAlarmsRequest);
    console.log(`Found ${listAlarmsResponse.data?.length || 0} alarms`);
    
    // Example 5: List all users
    console.log('\n5. Listing users...');
    const listUsersRequest = {
      entity: 'user_register',
      action: 'list',
      data: {}
    };
    
    const listUsersResponse = await actionEntity.processRequest(listUsersRequest);
    console.log(`Found ${listUsersResponse.data?.length || 0} users`);
    
    // Example 6: Update the alarm
    if (alarmResponse.success) {
      const alarmId = alarmResponse.data.id;
      console.log('\n6. Updating alarm...');
      const updateAlarmRequest = {
        entity: 'alarm',
        action: 'update',
        id: alarmId,
        data: {
          status: 'acknowledged',
          acknowledgedAt: new Date().toISOString()
        }
      };
      
      const updateAlarmResponse = await actionEntity.processRequest(updateAlarmRequest);
      console.log('Update Alarm Response:', JSON.stringify(updateAlarmResponse, null, 2));
    }
  }
}

// ============================================================================
// 7. EXPORTS
// ============================================================================

module.exports = {
  ActionEntity,
  SchemaValidator,
  ActionFs,
  DATASETS,
  ENTITY_CONFIGS
};

// Run example if this file is executed directly
if (require.main === module) {
  const fs = require('fs').promises;
  const path = require('path');
  
  // Clean up and create fresh data directory
  async function setup() {
    try {
      // Remove old data directory
      await fs.rm('./data', { recursive: true, force: true });
      console.log('Cleaned up old data directory');
      
      // Create fresh directory
      await fs.mkdir('./data', { recursive: true });
      console.log('Created fresh data directory');
      
      // Run the example
      await runExample();
    } catch (error) {
      console.error('Setup error:', error);
    }
  }
  
  setup().catch(console.error);
}