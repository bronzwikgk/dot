export const ERROR_CONFIG = {
  categories: {
    validation: {
      code: 'VAL',
      level: 'warn',
      recoverable: true,
      defaultMessage: 'Validation failed',
      suggestions: ['Check input data', 'Review schema requirements']
    },
    authentication: {
      code: 'AUTH',
      level: 'error',
      recoverable: false,
      defaultMessage: 'Authentication required',
      suggestions: ['Login required', 'Check session token']
    },
    authorization: {
      code: 'PERM',
      level: 'error',
      recoverable: false,
      defaultMessage: 'Permission denied',
      suggestions: ['Check user roles', 'Request access from admin']
    },
    database: {
      code: 'DB',
      level: 'error',
      recoverable: true,
      defaultMessage: 'Database operation failed',
      suggestions: ['Check connection', 'Verify data integrity']
    },
    network: {
      code: 'NET',
      level: 'error',
      recoverable: true,
      defaultMessage: 'Network error occurred',
      suggestions: ['Check internet connection', 'Retry operation']
    },
    system: {
      code: 'SYS',
      level: 'critical',
      recoverable: false,
      defaultMessage: 'System error',
      suggestions: ['Contact administrator', 'Check system logs']
    },
    business: {
      code: 'BIZ',
      level: 'info',
      recoverable: true,
      defaultMessage: 'Business rule violation',
      suggestions: ['Review business rules', 'Check constraints']
    }
  },
  httpStatus: {
    VAL_001: 400,
    AUTH_001: 401,
    AUTH_002: 403,
    PERM_001: 403,
    DB_001: 500,
    NET_001: 503,
    SYS_001: 500,
    BIZ_001: 409
  },
  messages: {
    en: {
      VAL_001: 'Please check your input data',
      VAL_002: 'Required field is missing',
      VAL_003: 'Invalid format detected',
      AUTH_001: 'Please log in to continue',
      AUTH_002: 'Session expired, please login again',
      PERM_001: 'You don\'t have permission for this action',
      DB_001: 'Database operation failed',
      NET_001: 'Network connection issue',
      SYS_001: 'Internal system error',
      BIZ_001: 'Business rule violation'
    },
    es: {
      VAL_001: 'Por favor verifica tus datos',
      AUTH_001: 'Por favor inicia sesión para continuar'
    }
  },
  strategies: {
    retry: {
      maxAttempts: 3,
      delay: 1000,
      backoff: 'exponential'
    },
    fallback: {
      enabled: true,
      defaultResponse: { success: false, message: 'Operation failed' }
    },
    logging: {
      enabled: true,
      level: 'error',
      format: 'json'
    },
    notification: {
      enabled: true,
      ui: true,
      console: true
    }
  }
};

export default ERROR_CONFIG;
