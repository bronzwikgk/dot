import { RUNTIME } from './runtime.js';

export const APP_CONFIG = {
  // Identity
  meta: {
    name: 'ActionFramework',
    version: '2.0.0',
    build: '2024.01.15',
    environment: process.env.NODE_ENV || 'development',
    instance: process.env.INSTANCE_ID || 'default'
  },

  // Runtime settings
  runtime: {
    platform: RUNTIME.platform,
    autoDetect: true,
    debug: process.env.DEBUG === 'true',
    performance: {
      monitoring: true,
      threshold: 1000, // ms
      sampling: 0.1 // 10%
    },
    security: {
      cors: {
        enabled: true,
        origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'X-Request-ID'],
        credentials: true
      },
      rateLimit: {
        enabled: true,
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
      },
      helmet: true
    }
  },

  // Entity definitions
  entities: {
    collection: {
      schema: {
        fields: {
          _id: { type: 'string', generate: 'uuid', required: true, immutable: true },
          name: { type: 'string', required: true, min: 1, max: 100, index: true },
          description: { type: 'string', max: 500 },
          schema: { 
            type: 'object', 
            required: true,
            properties: {
              fields: { type: 'array', minItems: 1, required: true }
            }
          },
          status: { type: 'string', enum: ['active', 'inactive', 'archived'], default: 'active' },
          metadata: {
            type: 'object',
            properties: {
              createdAt: { type: 'timestamp', auto: true },
              updatedAt: { type: 'timestamp', auto: true },
              createdBy: { type: 'string' },
              updatedBy: { type: 'string' }
            }
          }
        }
      },
      storage: {
        primary: 'indexeddb',
        fallback: 'file',
        options: {
          indexeddb: {
            storeName: 'collections',
            keyPath: '_id',
            indexes: [
              { name: 'name', keyPath: 'name', unique: false },
              { name: 'status', keyPath: 'status', unique: false },
              { name: 'createdAt', keyPath: 'metadata.createdAt', unique: false }
            ]
          },
          file: {
            path: './data/collections',
            format: 'json',
            encoding: 'utf8'
          }
        }
      },
      permissions: {
        create: ['admin', 'user'],
        read: ['admin', 'user', 'guest'],
        update: ['admin', 'user'],
        delete: ['admin'],
        export: ['admin', 'user']
      },
      hooks: {
        beforeCreate: ['generateId', 'validateSchema', 'setTimestamps'],
        afterCreate: ['cache', 'audit'],
        beforeUpdate: ['validateSchema', 'updateTimestamp'],
        afterUpdate: ['cache', 'audit'],
        beforeDelete: ['validateReferences'],
        afterDelete: ['clearCache', 'audit']
      }
    },

    datatable: {
      schema: {
        fields: {
          _id: { type: 'string', generate: 'uuid', required: true, immutable: true },
          name: { type: 'string', required: true, min: 1, max: 100, index: true },
          collectionId: { type: 'string', required: true, index: true, foreignKey: 'collection._id' },
          data: { type: 'array', default: [] },
          columns: { type: 'array', required: true },
          rowCount: { type: 'number', default: 0 },
          settings: {
            type: 'object',
            properties: {
              allowInsertRow: { type: 'boolean', default: true },
              allowDeleteRow: { type: 'boolean', default: true },
              pagination: { 
                type: 'object',
                properties: {
                  enabled: { type: 'boolean', default: false },
                  pageSize: { type: 'number', default: 50 }
                }
              }
            }
          },
          metadata: {
            type: 'object',
            properties: {
              createdAt: { type: 'timestamp', auto: true },
              updatedAt: { type: 'timestamp', auto: true },
              createdBy: { type: 'string' },
              updatedBy: { type: 'string' }
            }
          }
        }
      },
      storage: {
        primary: 'indexeddb',
        fallback: 'file',
        options: {
          indexeddb: {
            storeName: 'datatables',
            keyPath: '_id',
            indexes: [
              { name: 'name', keyPath: 'name', unique: false },
              { name: 'collectionId', keyPath: 'collectionId', unique: false },
              { name: 'status', keyPath: 'status', unique: false }
            ]
          },
          file: {
            path: './data/datatables',
            format: 'json',
            encoding: 'utf8'
          }
        }
      },
      permissions: {
        create: ['admin', 'user'],
        read: ['admin', 'user', 'guest'],
        update: ['admin', 'user'],
        delete: ['admin'],
        addRow: ['admin', 'user'],
        deleteRow: ['admin', 'user'],
        import: ['admin', 'user'],
        export: ['admin', 'user']
      }
    },

    user: {
      schema: {
        fields: {
          _id: { type: 'string', generate: 'uuid', required: true, immutable: true },
          username: { type: 'string', required: true, min: 3, max: 50, unique: true },
          email: { type: 'string', required: true, format: 'email', unique: true },
          passwordHash: { type: 'string', required: true, hidden: true },
          role: { type: 'string', enum: ['guest', 'user', 'manager', 'admin'], default: 'user' },
          status: { type: 'string', enum: ['active', 'inactive', 'suspended'], default: 'active' },
          profile: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              avatar: { type: 'string' }
            }
          },
          metadata: {
            type: 'object',
            properties: {
              createdAt: { type: 'timestamp', auto: true },
              updatedAt: { type: 'timestamp', auto: true },
              lastLogin: { type: 'timestamp' },
              loginCount: { type: 'number', default: 0 }
            }
          }
        }
      },
      storage: {
        primary: 'indexeddb',
        fallback: 'file',
        encrypted: true
      },
      security: {
        password: {
          minLength: 8,
          requireSpecialChar: true,
          requireNumber: true,
          requireUppercase: true
        },
        sessions: {
          maxActive: 5,
          timeout: 3600000 // 1 hour
        }
      }
    }
  },

  // Route configurations
  routes: {
    api: {
      prefix: '/api/v1',
      versioning: true,
      documentation: '/api/docs'
    },
    endpoints: [
      {
        path: '/collections',
        method: 'POST',
        action: 'collection.create',
        authentication: true,
        validation: true,
        rateLimit: { windowMs: 60000, max: 10 },
        responseType: 'json'
      },
      {
        path: '/collections',
        method: 'GET',
        action: 'collection.read',
        authentication: false,
        validation: false,
        cache: { ttl: 30000 },
        responseType: 'json'
      },
      {
        path: '/collections/:id',
        method: 'GET',
        action: 'collection.readOne',
        authentication: false,
        validation: true,
        responseType: 'json'
      },
      {
        path: '/collections/:id',
        method: 'PUT',
        action: 'collection.update',
        authentication: true,
        validation: true,
        responseType: 'json'
      },
      {
        path: '/collections/:id',
        method: 'DELETE',
        action: 'collection.delete',
        authentication: true,
        validation: true,
        responseType: 'json'
      },
      {
        path: '/datatables',
        method: 'POST',
        action: 'datatable.create',
        authentication: true,
        validation: true,
        responseType: 'json'
      },
      {
        path: '/datatables/:id/rows',
        method: 'POST',
        action: 'datatable.addRow',
        authentication: true,
        validation: true,
        responseType: 'json'
      },
      {
        path: '/datatables/:id/import/csv',
        method: 'POST',
        action: 'datatable.importCSV',
        authentication: true,
        validation: true,
        upload: { maxSize: 10485760 },
        responseType: 'json'
      }
    ]
  },

  // Storage configuration
  storage: {
    providers: {
      indexeddb: {
        enabled: RUNTIME.platform === 'browser',
        name: 'ActionFrameworkDB',
        version: 1,
        timeout: 5000
      },
      localStorage: {
        enabled: RUNTIME.platform === 'browser',
        prefix: 'af_',
        quota: 5242880 // 5MB
      },
      file: {
        enabled: RUNTIME.platform === 'node' || RUNTIME.platform === 'deno' || RUNTIME.platform === 'bun',
        basePath: './data',
        encoding: 'utf8'
      },
      memory: {
        enabled: true,
        maxItems: 1000,
        ttl: 300000 // 5 minutes
      }
    },
    fallbackOrder: ['indexeddb', 'localStorage', 'file', 'memory'],
    encryption: {
      enabled: process.env.ENABLE_ENCRYPTION === 'true',
      algorithm: 'aes-256-gcm',
      key: process.env.ENCRYPTION_KEY
    }
  },

  // Cache configuration
  cache: {
    enabled: true,
    provider: RUNTIME.platform === 'browser' ? 'localStorage' : 'memory',
    ttl: {
      default: 300000, // 5 minutes
      collections: 600000, // 10 minutes
      datatables: 300000 // 5 minutes
    },
    invalidation: {
      onUpdate: true,
      onDelete: true,
      pattern: true
    }
  },

  // Synchronization configuration
  sync: {
    enabled: true,
    strategy: 'optimistic',
    conflictResolution: 'server-wins',
    batch: {
      size: 50,
      timeout: 5000
    },
    retry: {
      attempts: 3,
      delay: 1000
    },
    offline: {
      queue: true,
      persistence: true,
      maxQueueSize: 1000
    }
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    levels: {
      error: true,
      warn: true,
      info: true,
      debug: process.env.DEBUG === 'true',
      audit: true
    },
    transports: {
      console: {
        enabled: true,
        format: process.env.NODE_ENV === 'production' ? 'json' : 'text'
      },
      file: {
        enabled: RUNTIME.platform !== 'browser',
        path: './logs',
        rotation: {
          enabled: true,
          size: '10m',
          interval: '1d'
        }
      }
    },
    context: {
      requestId: true,
      userId: true,
      sessionId: true,
      timestamp: true
    }
  },

  // Monitoring and health checks
  monitoring: {
    enabled: true,
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      status: '/status'
    },
    metrics: {
      requests: true,
      errors: true,
      latency: true,
      memory: RUNTIME.platform === 'node'
    },
    alerts: {
      enabled: true,
      thresholds: {
        errorRate: 0.05, // 5%
        latencyP95: 1000, // 1 second
        memoryUsage: 0.8 // 80%
      }
    }
  },

  // Internationalization
  i18n: {
    defaultLocale: 'en',
    supported: ['en', 'es', 'fr', 'de'],
    fallback: true,
    paths: {
      translations: './locales'
    }
  }
};

export default APP_CONFIG;
