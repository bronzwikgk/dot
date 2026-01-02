/*
========================================================
📌 ActionValidator Utility – Static Validation v2.3.0
========================================================

🎯 Purpose
--------------------------------------------------------
Enhanced validation with proper error enforcement,
comprehensive validation for all constraint types,
JSON Schema patternProperties support, and nested
rule evaluation for complex conditions.

✨ New Features in v2.3.0 (2025-10-09)
--------------------------------------------------------
- Fixed nested object validation (edge case)
- Nested objects now validate even without validate property
- Validates nested properties correctly
- Backward compatible with v2.2.0

✨ Features in v2.2.0 (2025-10-04)
--------------------------------------------------------
- Added nested rule evaluation engine
- Support for complex condition trees (and, or, not)
- Support for all JavaScript operators (==, !=, >, <, >=, <=, in, contains)
- Variable resolution in condition expressions
- Context-based evaluation for workflow systems
- Backward compatible with v2.1.0

✨ Features in v2.1.0
--------------------------------------------------------
- Added JSON Schema patternProperties support
- Validates dynamic object keys matching regex patterns
- Enables full routes config validation (method/action enums)
- Backward compatible with v2.0.0
- Performance optimized for pattern matching

✨ Features in v2.0.0
--------------------------------------------------------
- Fixed validation enforcement (throws errors on failures)
- Enhanced format validation (email, date, UUID, etc.)
- Improved minLength/maxLength validation
- Better error messages and debugging
- Validation summary methods
- Performance improvements

📋 CHANGELOG
--------------------------------------------------------
## v2.3.0 - 2025-10-09
### Fixed
- Nested object validation now works correctly
- Nested objects validate even without validate property on parent
- Validates nested properties recursively
- Changed by: Claude (AI Assistant)

## v2.2.0 - 2025-10-04
### Added
- evaluateRule() method for nested rule evaluation
- evaluateCondition() method for single condition evaluation
- evaluateExpression() method for value extraction
- Support for complex nested conditions (and, or, not)
- Support for all comparison operators
- Context-based variable resolution
- Changed by: Claude (AI Assistant)

### Features
- Condition types: "and", "or", "not", "condition"
- Operators: ==, !=, ===, !==, >, <, >=, <=, in, contains
- Variable resolution: {{path.to.value}}
- Nested condition trees with unlimited depth
- Changed by: Claude (AI Assistant)

## v2.1.0 - 2025-10-02
### Added
- patternProperties validation support for dynamic object keys
- validatePatternProperties() method for pattern-based validation
- Full JSON Schema Draft 07 patternProperties compliance
- Routes config method/action enum validation now works
- Changed by: Claude (AI Assistant)

## v2.0.0 - 2025-09-28
### Added
- Enhanced validation with error enforcement
- Format validation (email, URL, date, UUID)
- Validation summary methods
- Changed by: Development Team

========================================================
*/

export const ACTION_VALIDATOR_VERSION = "2.3.0";

export class ActionValidator {
  // ====================================================
  // Enhanced Validation with Error Enforcement
  // ====================================================

  static validateAndThrow(data, schema, options = {}) {
    const errors = this.validate(data, schema);
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      const errorMessages = this.formatErrorMessages(errors);
      const message = options.fieldPrefix ?
        `Validation failed for ${options.fieldPrefix}: ${errorMessages}` :
        `Validation failed: ${errorMessages}`;

      const error = new Error(message);
      error.validationErrors = errors;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    return true;
  }

  static formatErrorMessages(errors) {
    const messages = [];

    for (const [field, error] of Object.entries(errors)) {
      if (field === '_general') {
        messages.push(error.message);
      } else if (typeof error === 'object' && error.message) {
        messages.push(`${field}: ${error.message}`);
      } else if (Array.isArray(error)) {
        messages.push(`${field}: Array validation errors`);
      }
    }

    return messages.join('; ');
  }

  static validate(data, schema, errors = {}) {
    if (!data) {
      errors._general = { message: "No data provided", severity: "critical" };
      return errors;
    }

    // Guard against missing schema
    if (!schema || typeof schema !== "object") {
      return errors;
    }

    // Validate direct properties (if present)
    if (schema.properties && typeof schema.properties === "object") {
      this.validateProperties(data, schema.properties, errors);
    }

    // Validate patternProperties (if present)
    if (schema.patternProperties && typeof schema.patternProperties === "object") {
      this.validatePatternProperties(data, schema.patternProperties, errors);
    }

    return errors;
  }

  // ====================================================
  // Properties Validation
  // ====================================================

  static validateProperties(data, properties, errors) {
    for (const key in properties) {
      const propertySchema = properties[key];
      const value = data[key];
      const validate = propertySchema.validate;

      // Handle nested objects and arrays FIRST (even without validate object)
      if (value !== undefined && value !== null) {
        if (propertySchema.type === "object" && propertySchema.properties) {
          const nestedErrors = {};
          this.validate(value, propertySchema, nestedErrors);
          if (Object.keys(nestedErrors).length > 0) {
            errors[key] = nestedErrors;
          }
          // Continue to next property after nested validation
          continue;
        } else if (propertySchema.type === "array" && Array.isArray(value) && propertySchema.items) {
          const arrErrors = [];
          for (let i = 0; i < value.length; i++) {
            const childErrors = {};
            this.validate(value[i], propertySchema.items, childErrors);
            if (Object.keys(childErrors).length > 0) {
              arrErrors[i] = childErrors;
            }
          }
          if (arrErrors.length > 0) {
            errors[key] = arrErrors;
          }
          // Continue to next property after array validation
          continue;
        }
      }

      // Skip validation if no validate object (for simple properties)
      if (!validate) {
        continue;
      }

      // Check required fields first
      if (validate.required && (value === undefined || value === null || value === "")) {
        errors[key] = {
          message: `${key} is required`,
          severity: "error",
          constraint: "required",
          value: value
        };
        continue;
      }

      // Only validate if value is provided
      if (value !== undefined && value !== null) {
        // Type validation
        if (!this.validateType(value, propertySchema.type)) {
          errors[key] = {
            message: `${key} must be of type ${propertySchema.type}`,
            severity: "error",
            constraint: "type",
            expected: propertySchema.type,
            actual: typeof value
          };
          continue;
        }

        // Check for schema-level enum
        if (propertySchema.enum && !this.checkEnum(value, propertySchema.enum)) {
          errors[key] = {
            message: `${key} must be one of: ${propertySchema.enum.join(", ")}`,
            severity: "error",
            constraint: "enum",
            allowedValues: propertySchema.enum,
            actual: value
          };
          continue;
        }

        // Constraint validation
        this.validateConstraints(key, value, validate, errors);
      }
    }
  }

  // ====================================================
  // PatternProperties Validation
  // ====================================================

  static validatePatternProperties(data, patternProperties, errors) {
    for (const pattern in patternProperties) {
      const propertySchema = patternProperties[pattern];

      var regex;
      try {
        regex = new RegExp(pattern);
      } catch (error) {
        console.warn(`[ActionValidator] Invalid regex pattern in schema: ${pattern}`);
        continue;
      }

      for (const key in data) {
        if (regex.test(key)) {
          const value = data[key];

          if (propertySchema.type === "object" && propertySchema.properties) {
            const nestedErrors = {};
            this.validateProperties(value, propertySchema.properties, nestedErrors);

            if (Object.keys(nestedErrors).length > 0) {
              errors[key] = nestedErrors;
            }
          } else {
            const validate = propertySchema.validate;

            if (!validate) {
              continue;
            }

            if (!this.validateType(value, propertySchema.type)) {
              errors[key] = {
                message: `${key} must be of type ${propertySchema.type}`,
                severity: "error",
                constraint: "type",
                expected: propertySchema.type,
                actual: typeof value
              };
              continue;
            }

            this.validateConstraints(key, value, validate, errors);
          }
        }
      }
    }
  }

  // ====================================================
  // Type Validation
  // ====================================================

  static validateType(value, expectedType) {
    switch (expectedType) {
      case "string": return typeof value === "string";
      case "integer": return Number.isInteger(value);
      case "number": return typeof value === "number" && !isNaN(value);
      case "boolean": return typeof value === "boolean";
      case "array": return Array.isArray(value);
      case "object": return typeof value === "object" && value !== null && !Array.isArray(value);
      default: return true;
    }
  }

  // ====================================================
  // Constraint Validation
  // ====================================================

  static validateConstraints(fieldName, value, constraints, errors) {
    // String length constraints
    if (constraints.minLength !== undefined) {
      if (typeof value === "string" && value.length < constraints.minLength) {
        errors[fieldName] = {
          message: `${fieldName} must be at least ${constraints.minLength} characters long`,
          severity: "error",
          constraint: "minLength",
          expected: constraints.minLength,
          actual: value.length
        };
        return;
      }
    }

    if (constraints.maxLength !== undefined) {
      if (typeof value === "string" && value.length > constraints.maxLength) {
        errors[fieldName] = {
          message: `${fieldName} must be at most ${constraints.maxLength} characters long`,
          severity: "error",
          constraint: "maxLength",
          expected: constraints.maxLength,
          actual: value.length
        };
        return;
      }
    }

    // Numeric constraints
    if (constraints.minimum !== undefined) {
      if (typeof value === "number" && value < constraints.minimum) {
        errors[fieldName] = {
          message: `${fieldName} must be at least ${constraints.minimum}`,
          severity: "error",
          constraint: "minimum",
          expected: constraints.minimum,
          actual: value
        };
        return;
      }
    }

    if (constraints.maximum !== undefined) {
      if (typeof value === "number" && value > constraints.maximum) {
        errors[fieldName] = {
          message: `${fieldName} must be at most ${constraints.maximum}`,
          severity: "error",
          constraint: "maximum",
          expected: constraints.maximum,
          actual: value
        };
        return;
      }
    }

    // Pattern validation
    if (constraints.pattern) {
      if (typeof value === "string" && !this.checkPattern(value, constraints.pattern)) {
        errors[fieldName] = {
          message: `${fieldName} does not match the required pattern`,
          severity: "error",
          constraint: "pattern",
          pattern: constraints.pattern,
          value: value
        };
        return;
      }
    }

    // Enum validation
    if (constraints.enum) {
      if (!this.checkEnum(value, constraints.enum)) {
        errors[fieldName] = {
          message: `${fieldName} must be one of: ${constraints.enum.join(", ")}`,
          severity: "error",
          constraint: "enum",
          allowedValues: constraints.enum,
          actual: value
        };
        return;
      }
    }

    // Format validation
    if (constraints.format) {
      const formatValid = this.validateFormat(value, constraints.format);
      if (!formatValid.valid) {
        errors[fieldName] = {
          message: `${fieldName} ${formatValid.message}`,
          severity: "error",
          constraint: "format",
          format: constraints.format,
          value: value
        };
        return;
      }
    }

    // Array constraints
    if (Array.isArray(value)) {
      if (constraints.minItems !== undefined && value.length < constraints.minItems) {
        errors[fieldName] = {
          message: `${fieldName} must have at least ${constraints.minItems} items`,
          severity: "error",
          constraint: "minItems"
        };
        return;
      }

      if (constraints.maxItems !== undefined && value.length > constraints.maxItems) {
        errors[fieldName] = {
          message: `${fieldName} must have at most ${constraints.maxItems} items`,
          severity: "error",
          constraint: "maxItems"
        };
        return;
      }

      if (constraints.uniqueItems === true && !this.checkUniqueItems(value)) {
        errors[fieldName] = {
          message: `${fieldName} must contain unique items only`,
          severity: "error",
          constraint: "uniqueItems"
        };
        return;
      }
    }
  }

  // ====================================================
  // Format Validation
  // ====================================================

  static validateFormat(value, format) {
    if (typeof value !== "string") {
      return { valid: false, message: "must be a string for format validation" };
    }

    switch (format) {
      case "email":
        return this.checkEmailFormat(value) ?
          { valid: true } :
          { valid: false, message: "is not a valid email address" };

      case "url":
        return this.checkUrlFormat(value) ?
          { valid: true } :
          { valid: false, message: "is not a valid URL" };

      case "date":
        return this.checkDateFormat(value) ?
          { valid: true } :
          { valid: false, message: "is not a valid date (YYYY-MM-DD format)" };

      case "date-time":
        return this.checkDateTimeFormat(value) ?
          { valid: true } :
          { valid: false, message: "is not a valid date-time (ISO 8601 format)" };

      case "uuid":
        return this.checkUuidFormat(value) ?
          { valid: true } :
          { valid: false, message: "is not a valid UUID" };

      default:
        return { valid: true };
    }
  }

  // ====================================================
  // Enhanced Format Validation Methods
  // ====================================================

  static checkEmailFormat(value) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(value);
  }

  static checkUrlFormat(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  static checkDateFormat(value) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) return false;

    const date = new Date(value);
    return date instanceof Date && !isNaN(date) && date.toISOString().substr(0, 10) === value;
  }

  static checkDateTimeFormat(value) {
    try {
      const date = new Date(value);
      return date instanceof Date && !isNaN(date) && date.toISOString() === value;
    } catch {
      return false;
    }
  }

  static checkUuidFormat(value) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  // ====================================================
  // Utility Methods
  // ====================================================

  static checkPattern(value, pattern) {
    try {
      return new RegExp(pattern).test(value);
    } catch {
      return false;
    }
  }

  static checkEnum(value, allowedValues) {
    return Array.isArray(allowedValues) && allowedValues.includes(value);
  }

  static checkUniqueItems(array) {
    if (!Array.isArray(array)) return false;
    const seen = new Set();
    for (const item of array) {
      const key = typeof item === 'object' ? JSON.stringify(item) : item;
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  }

  // ====================================================
  // ✨ NEW in v2.2.0: Nested Rule Evaluation Engine
  // ====================================================

  /**
   * Evaluate a rule or condition tree
   *
   * @param {object} rule - Rule definition
   * @param {object} context - Evaluation context (contains variables)
   * @param {any} expectedOutput - Expected output type (optional)
   * @param {string} nextStep - Next step identifier (optional)
   * @param {object} options - Additional options (optional)
   * @returns {boolean} - Evaluation result
   *
   * Rule Structure:
   * {
   *   type: "and" | "or" | "not" | "condition",
   *   conditions: [...],  // For and/or/not types
   *   left: any,         // For condition type
   *   operator: string,  // For condition type
   *   right: any         // For condition type
   * }
   */
  static evaluateRule(rule, context, expectedOutput, nextStep, options) {
    if (!rule || typeof rule !== 'object') {
      return true;
    }

    const ruleType = rule.type || 'condition';

    switch (ruleType) {
      case 'and':
        return this.evaluateAndRule(rule, context);

      case 'or':
        return this.evaluateOrRule(rule, context);

      case 'not':
        return this.evaluateNotRule(rule, context);

      case 'condition':
        return this.evaluateCondition(rule, context);

      default:
        console.warn(`[ActionValidator] Unknown rule type: ${ruleType}`);
        return true;
    }
  }

  /**
   * Evaluate AND rule (all conditions must be true)
   */
  static evaluateAndRule(rule, context) {
    if (!rule.conditions || !Array.isArray(rule.conditions)) {
      return true;
    }

    for (let i = 0; i < rule.conditions.length; i++) {
      const condition = rule.conditions[i];
      const result = this.evaluateRule(condition, context);
      if (!result) {
        return false;
      }
    }

    return true;
  }

  /**
   * Evaluate OR rule (at least one condition must be true)
   */
  static evaluateOrRule(rule, context) {
    if (!rule.conditions || !Array.isArray(rule.conditions)) {
      return false;
    }

    for (let i = 0; i < rule.conditions.length; i++) {
      const condition = rule.conditions[i];
      const result = this.evaluateRule(condition, context);
      if (result) {
        return true;
      }
    }

    return false;
  }

  /**
   * Evaluate NOT rule (inverts nested condition)
   */
  static evaluateNotRule(rule, context) {
    if (!rule.condition) {
      return true;
    }

    const result = this.evaluateRule(rule.condition, context);
    return !result;
  }

  /**
   * Evaluate single condition
   *
   * @param {object} condition - Condition definition
   * @param {object} context - Evaluation context
   * @returns {boolean} - Evaluation result
   *
   * Condition Structure:
   * {
   *   left: "{{path.to.value}}" or literal,
   *   operator: "==", "!=", ">", "<", ">=", "<=", "in", "contains",
   *   right: "{{path.to.value}}" or literal
   * }
   */
  static evaluateCondition(condition, context) {
    if (!condition || typeof condition !== 'object') {
      return true;
    }

    const left = this.evaluateExpression(condition.left, context);
    const right = this.evaluateExpression(condition.right, context);
    const operator = condition.operator;

    if (!operator) {
      console.warn('[ActionValidator] Condition missing operator');
      return true;
    }

    return this.compareValues(left, operator, right);
  }

  /**
   * Evaluate expression (resolve variables or return literal)
   *
   * @param {any} expression - Expression to evaluate
   * @param {object} context - Evaluation context
   * @returns {any} - Resolved value
   *
   * Supports:
   * - Literals: "string", 123, true, null
   * - Variables: "{{path.to.value}}"
   */
  static evaluateExpression(expression, context) {
    if (expression === null || expression === undefined) {
      return expression;
    }

    if (typeof expression !== 'string') {
      return expression;
    }

    // Check if expression contains variable syntax
    const variableMatch = expression.match(/^{{\s*([^}]+)\s*}}$/);
    if (!variableMatch) {
      return expression;
    }

    // Extract path
    const path = variableMatch[1].trim();

    // Resolve path in context
    return this.resolveContextPath(path, context);
  }

  /**
   * Resolve path in context object
   *
   * @param {string} path - Dot-separated path (e.g., "user.profile.name")
   * @param {object} context - Context object
   * @returns {any} - Resolved value or undefined
   */
  static resolveContextPath(path, context) {
    if (!context || typeof context !== 'object') {
      return undefined;
    }

    const parts = path.split('.');
    let value = context;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Compare two values using operator
   *
   * @param {any} left - Left value
   * @param {string} operator - Comparison operator
   * @param {any} right - Right value
   * @returns {boolean} - Comparison result
   */
  static compareValues(left, operator, right) {
    switch (operator) {
      case '==':
        return left == right;

      case '!=':
        return left != right;

      case '===':
        return left === right;

      case '!==':
        return left !== right;

      case '>':
        return left > right;

      case '<':
        return left < right;

      case '>=':
        return left >= right;

      case '<=':
        return left <= right;

      case 'in':
        if (Array.isArray(right)) {
          return right.includes(left);
        }
        if (typeof right === 'object' && right !== null) {
          return left in right;
        }
        return false;

      case 'contains':
        if (Array.isArray(left)) {
          return left.includes(right);
        }
        if (typeof left === 'string' && typeof right === 'string') {
          return left.includes(right);
        }
        return false;

      default:
        console.warn(`[ActionValidator] Unknown operator: ${operator}`);
        return false;
    }
  }

  // ====================================================
  // RBAC Validation
  // ====================================================

  static validateRole(role, rbac) {
    if (!rbac) return true;

    if (Array.isArray(rbac)) {
      if (!rbac.includes(role)) {
        throw new Error(`Access denied: role '${role}' not permitted`);
      }
      return true;
    }

    if (typeof rbac === "object") {
      const permissions = rbac[role] || [];
      if (!permissions || permissions.length === 0) {
        throw new Error(`Access denied: role '${role}' not permitted`);
      }
      return true;
    }

    return true;
  }

  static validateAttributes(body, abac) {
    if (!abac) return true;
    if (!body || typeof body !== "object") {
      throw new Error("Invalid body for attribute-based validation");
    }

    for (const [attr, rules] of Object.entries(abac)) {
      const value = body[attr];

      if (rules.required && value === undefined) {
        throw new Error(`Missing required attribute '${attr}'`);
      }

      if (rules.enum && !rules.enum.includes(value)) {
        throw new Error(
          `Invalid value for '${attr}', must be one of: ${rules.enum.join(", ")}`
        );
      }

      if (rules.type && typeof value !== rules.type) {
        throw new Error(`Invalid type for '${attr}', expected ${rules.type}`);
      }
    }
    return true;
  }

  // ====================================================
  // Validation Statistics and Debugging
  // ====================================================

  static getValidationSummary(data, schema) {
    const errors = this.validate(data, schema);
    const fieldCount = schema.properties ? Object.keys(schema.properties).length : 0;
    const errorCount = Object.keys(errors).length;

    return {
      totalFields: fieldCount,
      validatedFields: Object.keys(data || {}).length,
      errorCount: errorCount,
      isValid: errorCount === 0,
      errors: errors
    };
  }

  static debugValidation(data, schema, fieldName = null) {
    console.log('=== ActionValidator Debug ===');
    console.log('Schema:', JSON.stringify(schema, null, 2));
    console.log('Data:', JSON.stringify(data, null, 2));

    if (fieldName && schema.properties && schema.properties[fieldName]) {
      console.log(`Field ${fieldName} schema:`, JSON.stringify(schema.properties[fieldName], null, 2));
      console.log(`Field ${fieldName} value:`, data[fieldName]);
    }

    const summary = this.getValidationSummary(data, schema);
    console.log('Validation Summary:', summary);
    console.log('=== End Debug ===');

    return summary;
  }
}

console.log(`✅ ActionValidator v${ACTION_VALIDATOR_VERSION} Loaded (with nested validation fix)`);
