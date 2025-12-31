// Overview: Encapsulates application errors with structured metadata and logging hooks.
// Purpose: Normalize error representation, HTTP mapping, and logging across the framework.
// Audience: Developers building and monitoring API endpoints.
// Problem Addressed: Inconsistent error metadata and handling across runtime components.
// Use Cases: Throwing validation, auth, system errors and serializing them for clients.
// Features: Error codes, localization, suggestions, stack capture, logging, serialization, retry hooks.
// Benefits: Simplifies actionable error handling and ensures consistent monitoring signals.
// User Stories: As a client I receive structured errors; as a developer I log errors centrally.
// User Flow: Actions throw ActionError, it logs via the registered framework, and serializes for responses.
// System Components: Validator, ActionFramework, monitoring, logging transports.
// Edge Cases: Querying framework helpers before registration returns safe defaults.
// Test Cases: Ensure fromError normalizes thrown errors; toJSON includes details in non-prod.
// Configuration: Relies on ERROR_CONFIG, APP_CONFIG for messages and thresholds.
// Schema: Not applicable.

import { ERROR_CONFIG } from '../config/errorConfig.js';
import { APP_CONFIG } from '../config/appConfig.js';
import { getFrameworkClass } from './frameworkRegistry.js';

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

    if (APP_CONFIG.meta.environment !== 'production') {
      base.error.details = this.details;
      base.error.stack = this.stack;
      base.error.context = this.context;
    }

    if (this.context.requestId) {
      base.requestId = this.context.requestId;
    }

    return base;
  }

  log() {
    const frameworkClass = getFrameworkClass();
    const logger = frameworkClass?.getLogger ? frameworkClass.getLogger() : console;
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

    const monitor = frameworkClass?.getMonitor ? frameworkClass.getMonitor() : null;
    if (APP_CONFIG.monitoring.enabled && monitor) {
      monitor.recordError(this);
    }
  }

  static fromError(error, context = {}) {
    if (error instanceof ActionError) {
      return error;
    }

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

export default ActionError;
