// Import dependencies
const express = require('express');
const Joi = require('joi');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { default: axios } = require('axios');

// Configuration Constants
const ENTITY_CONFIG = {
  user: {
    name: 'user',
    collection: 'users',
    fields: [
      { name: 'id', type: 'string', required: true, validation: Joi.string().required() },
      { name: 'name', type: 'string', required: true, validation: Joi.string().min(2).max(100).required() },
      { name: 'email', type: 'string', required: true, validation: Joi.string().email().required() },
      { name: 'age', type: 'number', required: false, validation: Joi.number().min(0).max(150).optional() },
      { name: 'roles', type: 'array', required: false, validation: Joi.array().items(Joi.string()).optional() }
    ],
    permissions: {
      admin: ['create', 'update', 'delete', 'list'],
      user: ['read', 'update_self'],
      guest: ['read']
    }
  },
  product: {
    name: 'product',
    collection: 'products',
    fields: [
      { name: 'id', type: 'string', required: true },
      { name: 'name', type: 'string', required: true },
      { name: 'price', type: 'number', required: true },
      { name: 'category', type: 'string', required: false }
    ]
  }
};

const SERVER_CONFIG = {
  name: 'ActionServer',
  version: '1.0.0',
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  http: {
    enabled: true,
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"]
        }
      }
    },
    rateLimit: {
      enabled: true,
      options: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later'
      }
    },
    routes: {
      user: {
        '/': { method: 'GET', action: 'list' },
        '/:id': { method: 'GET', action: 'get' },
        '/': { method: 'POST', action: 'create' },
        '/:id': { method: 'PUT', action: 'update' },
        '/:id': { method: 'DELETE', action: 'delete' }
      }
    }
  },
  database: {
    type: process.env.DB_TYPE || 'memory',
    connection: process.env.DB_CONNECTION || null
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  }
};

const ACTION_CONFIG = {
  basePath: './data/actions',
  defaultPermissions: ['admin'],
  validationOptions: {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  },
  hooks: {
    preAction: [],
    postAction: []
  },
  externalAPIs: {
    defaultTimeout: 5000,
    retryAttempts: 3
  }
};

const VALIDATOR_SCHEMAS = {
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),
  email: Joi.string().email().required(),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),
  search: Joi.object({
    query: Joi.string().min(1),
    fields: Joi.array().items(Joi.string())
  })
};

// Core Classes
class RequestResponseModel {
  constructor(options = {}) {
    this.success = options.success !== undefined ? options.success : true;
    this.data = options.data || null;
    this.error = options.error || null;
    this.message = options.message || '';
    this.timestamp = new Date();
    this.requestId = options.requestId || null;
    this.metadata = options.metadata || {};
    
    if (this.success && this.error) {
      this.success = false;
    }
  }

  static success(data, message = 'Operation successful') {
    return new RequestResponseModel({
      success: true,
      data,
      message
    });
  }

  static error(error, message = 'Operation failed') {
    return new RequestResponseModel({
      success: false,
      error: error.message || error,
      message
    });
  }

  toJSON() {
    return {
      success: this.success,
      data: this.data,
      error: this.error,
      message: this.message,
      timestamp: this.timestamp,
      requestId: this.requestId,
      metadata: this.metadata
    };
  }
}

class ActionEntity {
  constructor(config) {
    this.name = config.name;
    this.schema = config.schema || {};
    this.collection = config.collection;
    this.actions = new Map();
    this.hooks = new Map();
    this.validators = new Map();
    this.permissions = config.permissions || {};
    this.dataStore = new Map();
    this.lastId = 0;
    
    this.initialize();
  }

  initialize() {
    console.log(`Initializing entity: ${this.name}`);
    this.registerDefaultActions();
  }

  registerDefaultActions() {
    const defaultActions = {
      create: {
        handler: this.handleCreate.bind(this),
        validation: this.createValidationSchema('create'),
        permissions: this.permissions.create || ['admin'],
        description: 'Create a new record'
      },
      get: {
        handler: this.handleGet.bind(this),
        validation: Joi.object({ id: VALIDATOR_SCHEMAS.id.required() }),
        permissions: this.permissions.read || ['admin', 'user', 'guest'],
        description: 'Get a single record by ID'
      },
      list: {
        handler: this.handleList.bind(this),
        validation: VALIDATOR_SCHEMAS.pagination,
        permissions: this.permissions.list || ['admin', 'user'],
        description: 'List records with pagination'
      },
      update: {
        handler: this.handleUpdate.bind(this),
        validation: this.createValidationSchema('update'),
        permissions: this.permissions.update || ['admin'],
        description: 'Update an existing record'
      },
      delete: {
        handler: this.handleDelete.bind(this),
        validation: Joi.object({ id: VALIDATOR_SCHEMAS.id.required() }),
        permissions: this.permissions.delete || ['admin'],
        description: 'Delete a record'
      }
    };

    Object.entries(defaultActions).forEach(([name, config]) => {
      this.registerAction(name, config);
    });
  }

  createValidationSchema(actionType) {
    if (!ENTITY_CONFIG[this.name]?.fields) return Joi.object();
    
    const fields = ENTITY_CONFIG[this.name].fields;
    const schema = {};
    
    fields.forEach(field => {
      if (field.validation) {
        if (actionType === 'create' && field.required) {
          schema[field.name] = field.validation.required();
        } else if (actionType === 'update') {
          schema[field.name] = field.validation.optional();
        }
      }
    });
    
    if (actionType === 'create') {
      return Joi.object(schema).min(1);
    }
    
    return Joi.object(schema).min(1);
  }

  registerAction(name, config) {
    this.actions.set(name, {
      name,
      handler: config.handler,
      validation: config.validation,
      permissions: config.permissions,
      description: config.description
    });
    console.log(`Registered action: ${this.name}.${name}`);
  }

  async execute(actionName, data, context = {}) {
    const action = this.actions.get(actionName);
    
    if (!action) {
      throw new Error(`Action ${actionName} not found for entity ${this.name}`);
    }

    await this.validatePermissions(action, context);
    await this.validateInput(action, data);
    
    await this.executeHook('pre', actionName, { data, context });
    const result = await action.handler(data, context);
    await this.executeHook('post', actionName, { data, context, result });
    
    return result;
  }

  async validatePermissions(action, context) {
    if (action.permissions) {
      const userRoles = context?.user?.roles || ['guest'];
      const hasPermission = action.permissions.some(role => 
        userRoles.includes(role)
      );
      
      if (!hasPermission) {
        throw new Error(`Insufficient permissions for action ${action.name}`);
      }
    }
  }

  async validateInput(action, data) {
    if (action.validation) {
      const { error, value } = action.validation.validate(data, ACTION_CONFIG.validationOptions);
      if (error) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      return value;
    }
    return data;
  }

  async executeHook(hookType, actionName, hookData) {
    const hook = this.hooks.get(`${hookType}_${actionName}`);
    if (hook) {
      await hook(hookData);
    }
  }

  async handleCreate(data, context) {
    const id = (++this.lastId).toString();
    const record = {
      id,
      ...data,
      createdAt: new Date(),
      createdBy: context.user?.id,
      updatedAt: new Date()
    };
    
    this.dataStore.set(id, record);
    return RequestResponseModel.success(record, `${this.name} created successfully`);
  }

  async handleGet(data) {
    const record = this.dataStore.get(data.id);
    if (!record) {
      throw new Error(`${this.name} not found`);
    }
    return RequestResponseModel.success(record, `${this.name} retrieved successfully`);
  }

  async handleList(data) {
    const { page = 1, limit = 10 } = data;
    const startIndex = (page - 1) * limit;
    const records = Array.from(this.dataStore.values());
    
    const paginatedRecords = records.slice(startIndex, startIndex + limit);
    
    return RequestResponseModel.success({
      items: paginatedRecords,
      pagination: {
        page,
        limit,
        total: records.length,
        pages: Math.ceil(records.length / limit)
      }
    }, `${this.name} list retrieved successfully`);
  }

  async handleUpdate(data, context) {
    const record = this.dataStore.get(data.id);
    if (!record) {
      throw new Error(`${this.name} not found`);
    }
    
    const updatedRecord = {
      ...record,
      ...data,
      updatedAt: new Date(),
      updatedBy: context.user?.id
    };
    
    this.dataStore.set(data.id, updatedRecord);
    return RequestResponseModel.success(updatedRecord, `${this.name} updated successfully`);
  }

  async handleDelete(data) {
    if (!this.dataStore.has(data.id)) {
      throw new Error(`${this.name} not found`);
    }
    
    this.dataStore.delete(data.id);
    return RequestResponseModel.success(null, `${this.name} deleted successfully`);
  }

  addHook(hookType, actionName, hookFunction) {
    this.hooks.set(`${hookType}_${actionName}`, hookFunction);
  }
}

class ActionServer {
  constructor(config = SERVER_CONFIG) {
    this.config = config;
    this.entities = new Map();
    this.middlewares = [];
    this.httpService = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('Initializing ActionServer...');
    await this.loadEntities();
    
    if (this.config.http.enabled) {
      await this.initializeHttpService();
    }
    
    this.isInitialized = true;
    console.log('ActionServer initialized successfully');
  }

  async loadEntities() {
    for (const entityName in ENTITY_CONFIG) {
      const entityConfig = ENTITY_CONFIG[entityName];
      const entity = new ActionEntity(entityConfig);
      this.entities.set(entityName, entity);
      console.log(`Loaded entity: ${entityName}`);
    }
  }

  async initializeHttpService() {
    const httpService = new HttpService(this.config.http);
    await httpService.initialize(this);
    this.httpService = httpService;
    
    for (const [entityName, entity] of this.entities) {
      this.registerEntityRoutes(entityName, entity);
    }
  }

  registerEntityRoutes(entityName, entity) {
    const routes = this.config.http.routes[entityName] || {};
    
    Object.entries(routes).forEach(([routePath, routeConfig]) => {
      this.httpService.app[routeConfig.method.toLowerCase()](
        `/api/${entityName}${routePath}`,
        async (req, res) => {
          try {
            const context = this.createContext(req);
            const data = this.extractRequestData(req, routeConfig);
            
            const result = await entity.execute(routeConfig.action, data, context);
            
            const response = new RequestResponseModel({
              success: true,
              data: result.data,
              message: result.message,
              requestId: context.requestId
            });
            
            res.json(response);
          } catch (error) {
            const response = new RequestResponseModel({
              success: false,
              error: error.message,
              message: `Failed to execute ${entityName}.${routeConfig.action}`,
              requestId: req.id
            });
            
            res.status(error.statusCode || 500).json(response);
          }
        }
      );
      
      console.log(`Registered route: ${routeConfig.method} /api/${entityName}${routePath}`);
    });
  }

  createContext(req) {
    return {
      user: req.user || { id: 'anonymous', roles: ['guest'] },
      requestId: req.id,
      ip: req.ip,
      timestamp: new Date(),
      headers: req.headers
    };
  }

  extractRequestData(req, routeConfig) {
    switch (routeConfig.method) {
      case 'GET':
        return { ...req.query, ...req.params };
      case 'POST':
      case 'PUT':
      case 'PATCH':
        return { ...req.body, ...req.params };
      case 'DELETE':
        return { ...req.params, ...req.query };
      default:
        return {};
    }
  }

  getEntity(entityName) {
    const entity = this.entities.get(entityName);
    if (!entity) {
      throw new Error(`Entity ${entityName} not found`);
    }
    return entity;
  }

  async executeAction(entityName, actionName, data = {}, context = {}) {
    const entity = this.getEntity(entityName);
    return await entity.execute(actionName, data, context);
  }

  async start() {
    await this.initialize();
    
    if (this.httpService) {
      return this.httpService.start();
    }
    
    console.log('ActionServer running (HTTP disabled)');
    return this;
  }
}

// Helper Classes
class ActionValidator {
  static validate(schema, data) {
    return schema.validate(data, ACTION_CONFIG.validationOptions);
  }

  static createMiddleware(schema) {
    return (req, res, next) => {
      const data = req.method === 'GET' ? req.query : req.body;
      const { error, value } = this.validate(schema, data);
      
      if (error) {
        const response = new RequestResponseModel({
          success: false,
          error: error.details.map(d => d.message).join(', '),
          message: 'Validation failed',
          requestId: req.id
        });
        
        return res.status(400).json(response);
      }
      
      req.validatedData = value;
      next();
    };
  }

  static createEntityValidators(entityConfig) {
    const validators = {};
    
    if (entityConfig.fields) {
      const createSchema = {};
      const updateSchema = {};
      
      entityConfig.fields.forEach(field => {
        if (field.validation) {
          if (field.required) {
            createSchema[field.name] = field.validation.required();
          } else {
            createSchema[field.name] = field.validation.optional();
          }
          updateSchema[field.name] = field.validation.optional();
        }
      });
      
      validators.create = Joi.object(createSchema).min(1);
      validators.update = Joi.object(updateSchema).min(1);
    }
    
    validators.get = Joi.object({ id: VALIDATOR_SCHEMAS.id.required() });
    validators.list = VALIDATOR_SCHEMAS.pagination;
    validators.delete = Joi.object({ id: VALIDATOR_SCHEMAS.id.required() });
    
    return validators;
  }
}

class ActionFs {
  constructor(config = ACTION_CONFIG) {
    this.config = config;
    this.basePath = config.basePath || './data';
  }

  async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async saveEntityData(entityName, data, filename = 'data.json') {
    const entityPath = path.join(this.basePath, entityName);
    await this.ensureDirectory(entityPath);
    
    const filePath = path.join(entityPath, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return { success: true, path: filePath };
  }

  async loadEntityData(entityName, filename = 'data.json') {
    const filePath = path.join(this.basePath, entityName, filename);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async backupEntity(entityName) {
    const data = await this.loadEntityData(entityName);
    if (!data) return { success: false, message: 'No data to backup' };
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `backup-${timestamp}.json`;
    
    await this.saveEntityData(entityName, data, backupFilename);
    return { success: true, backupFile: backupFilename };
  }
}

class HttpService {
  constructor(config = SERVER_CONFIG.http) {
    this.config = config;
    this.app = express();
    this.server = null;
    this.actionServer = null;
  }

  async initialize(actionServer) {
    this.actionServer = actionServer;
    
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors(this.config.cors));
    this.app.use(helmet(this.config.helmet));
    
    if (this.config.rateLimit.enabled) {
      const limiter = rateLimit(this.config.rateLimit.options);
      this.app.use('/api/', limiter);
    }
    
    this.app.use((req, res, next) => {
      req.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      console.log(`[${new Date().toISOString()}] ${req.id} ${req.method} ${req.url}`);
      next();
    });
    
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date(),
        service: SERVER_CONFIG.name,
        version: SERVER_CONFIG.version
      });
    });
    
    this.app.use('*', (req, res) => {
      const response = new RequestResponseModel({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        requestId: req.id
      });
      
      res.status(404).json(response);
    });
    
    this.app.use((error, req, res, next) => {
      console.error(`[ERROR] ${req.id}:`, error);
      
      const response = new RequestResponseModel({
        success: false,
        error: error.message,
        message: 'Internal server error',
        requestId: req.id
      });
      
      res.status(error.status || 500).json(response);
    });
    
    return this;
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(SERVER_CONFIG.port, () => {
        console.log(`${SERVER_CONFIG.name} running on port ${SERVER_CONFIG.port}`);
        console.log(`Environment: ${SERVER_CONFIG.environment}`);
        console.log(`Health check: http://localhost:${SERVER_CONFIG.port}/health`);
        resolve(this.server);
      });
      
      this.server.on('error', reject);
    });
  }

  async callExternalAPI(apiConfig, data = {}) {
    try {
      const config = {
        method: apiConfig.method || 'GET',
        url: apiConfig.url,
        headers: apiConfig.headers || {},
        data: apiConfig.method !== 'GET' ? data : undefined,
        params: apiConfig.method === 'GET' ? data : undefined,
        timeout: apiConfig.timeout || ACTION_CONFIG.externalAPIs.defaultTimeout
      };
      
      if (apiConfig.auth) {
        if (apiConfig.auth.type === 'bearer') {
          config.headers.Authorization = `Bearer ${apiConfig.auth.token}`;
        } else if (apiConfig.auth.type === 'basic') {
          const credentials = Buffer.from(
            `${apiConfig.auth.username}:${apiConfig.auth.password}`
          ).toString('base64');
          config.headers.Authorization = `Basic ${credentials}`;
        }
      }
      
      const response = await axios(config);
      
      return new RequestResponseModel({
        success: true,
        data: response.data,
        message: 'External API call successful'
      });
    } catch (error) {
      return new RequestResponseModel({
        success: false,
        error: error.message,
        data: error.response?.data,
        message: 'External API call failed'
      });
    }
  }
}

// Example Usage
const EXTERNAL_API_CONFIG = {
  weather: {
    url: 'https://api.weather.com/v1/current',
    method: 'GET',
    auth: {
      type: 'bearer',
      token: process.env.WEATHER_API_KEY
    },
    timeout: 10000
  }
};

// Initialize and start the server
async function main() {
  try {
    const actionServer = new ActionServer();
    
    // Add custom hooks to user entity
    const userEntity = actionServer.getEntity('user');
    userEntity.addHook('pre', 'create', async ({ data }) => {
      console.log('Before creating user:', data.email);
      data.createdAt = new Date();
    });
    
    userEntity.addHook('post', 'create', async ({ result }) => {
      console.log('User created successfully:', result.data.id);
    });
    
    // Start the server
    await actionServer.start();
    
    // Example: Execute action programmatically
    const context = {
      user: { id: 'admin-1', roles: ['admin'] }
    };
    
    const createResult = await actionServer.executeAction(
      'user',
      'create',
      {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        roles: ['user']
      },
      context
    );
    
    console.log('Create result:', createResult);
    
    // Example: Use file system helper
    const actionFs = new ActionFs();
    await actionFs.saveEntityData('users', { test: 'data' });
    
    // Example: Use HTTP service for external API
    if (actionServer.httpService) {
      const weatherResult = await actionServer.httpService.callExternalAPI(
        EXTERNAL_API_CONFIG.weather,
        { city: 'London' }
      );
      console.log('Weather API result:', weatherResult);
    }
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Export everything
module.exports = {
  RequestResponseModel,
  ActionEntity,
  ActionServer,
  ActionValidator,
  ActionFs,
  HttpService,
  ENTITY_CONFIG,
  SERVER_CONFIG,
  ACTION_CONFIG,
  VALIDATOR_SCHEMAS,
  EXTERNAL_API_CONFIG,
  main
};

// Start if this is the main module
if (require.main === module) {
  main();
}