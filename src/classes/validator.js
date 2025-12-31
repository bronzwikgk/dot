// Overview: Schema validator enforcing entity field rules before persistence.
// Purpose: Ensure input adheres to entity definitions with actionable errors.
// Audience: ActionEntity before/after hooks and storage layers.
// Problem Addressed: Inconsistent validation and error bubbling.
// Use Cases: Field type checks, required enforcement, enums, min/max lengths.
// Features: Centralized validation errors with ActionError wrapping.
// Benefits: Prevents invalid records and surfaces clear guidance.
// User Stories: As a developer I receive validation errors with field details.
// User Flow: Entity invokes Validator.validate before writes.
// System Components: ActionEntity schema configs and ActionError.
// Edge Cases: Skips validation for missing optional fields and handles email formatting.
// Test Cases: Validate required fields, enums, lengths, and number bounds.
// Configuration: Depends on schema fields defined in APP_CONFIG.
// Schema: Input must match defined properties with types, enums, and constraints.

import ActionError from './actionError.js';

class Validator {
  constructor(options) {
    this.schema = options.schema;
    this.strict = options.strict;
  }

  validate(data, operation = 'create') {
    const errors = [];
    const validated = { ...data };

    Object.entries(this.schema.fields).forEach(([fieldName, fieldConfig]) => {
      const value = data[fieldName];

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

      if (value === undefined || value === null) {
        return;
      }

      if (!this.validateType(fieldName, value, fieldConfig.type)) {
        errors.push({
          field: fieldName,
          message: `Field '${fieldName}' must be of type ${fieldConfig.type}`,
          code: 'TYPE_MISMATCH'
        });
        return;
      }

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

export default Validator;
