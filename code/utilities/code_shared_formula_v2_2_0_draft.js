/**
 * @file FORMULA_PROCESSOR.js
 * @description A formula parser and evaluator for the an_app project. Supports arithmetic,
 *   cell references, functions, string operations, comparisons, logical operators, and ranges.
 *   UMD pattern exports window.FORMULA_PROCESSOR.
 * @project an_app
 * @version 1.0.0
 * @status draft
 * @author an_app team
 * @created 2026-08-22
 * @modified 2026-08-22
 * @license MIT
 * @requires none
 * @module FORMULA_PROCESSOR
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FORMULA_PROCESSOR = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Token types for the lexer
   */
  const TOKEN_TYPES = {
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    IDENTIFIER: 'IDENTIFIER',
    OPERATOR: 'OPERATOR',
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    COLON: 'COLON',
    COMMA: 'COMMA',
    CELL_REF: 'CELL_REF',
    EOF: 'EOF'
  };

  /**
   * Operator precedence
   */
  const PRECEDENCE = {
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
    '%': 3,
    '^': 4,
    '=': 1,
    '!=': 1,
    '<': 1,
    '>': 1,
    '<=': 1,
    '>=': 1,
    '&': 2
  };

  /**
   * Built-in functions
   */
  const FUNCTIONS = {
    SUM: function (args) {
      return args.flat().reduce(function (a, b) { return a + Number(b); }, 0);
    },
    AVG: function (args) {
      var flat = args.flat().map(Number);
      return flat.reduce(function (a, b) { return a + b; }, 0) / flat.length;
    },
    COUNT: function (args) {
      return args.flat().filter(function (v) { return v !== null && v !== undefined && v !== ''; }).length;
    },
    MIN: function (args) {
      return Math.min.apply(null, args.flat().map(Number));
    },
    MAX: function (args) {
      return Math.max.apply(null, args.flat().map(Number));
    },
    IF: function (args) {
      return args[0] ? args[1] : (args[2] !== undefined ? args[2] : false);
    },
    CONCAT: function (args) {
      return args.flat().join('');
    },
    UPPER: function (args) {
      return String(args[0]).toUpperCase();
    },
    LOWER: function (args) {
      return String(args[0]).toLowerCase();
    },
    TRIM: function (args) {
      return String(args[0]).trim();
    },
    LEN: function (args) {
      return String(args[0]).length;
    },
    LEFT: function (args) {
      return String(args[0]).substring(0, args[1] || 1);
    },
    RIGHT: function (args) {
      var str = String(args[0]);
      var n = args[1] || 1;
      return str.substring(str.length - n);
    },
    MID: function (args) {
      return String(args[0]).substring(args[1] - 1, args[1] - 1 + (args[2] || 1));
    },
    NOW: function () {
      return new Date().toISOString();
    },
    TODAY: function () {
      return new Date().toISOString().split('T')[0];
    },
    ABS: function (args) {
      return Math.abs(Number(args[0]));
    },
    ROUND: function (args) {
      var num = Number(args[0]);
      var places = args[1] || 0;
      var factor = Math.pow(10, places);
      return Math.round(num * factor) / factor;
    },
    FLOOR: function (args) {
      return Math.floor(Number(args[0]));
    },
    CEIL: function (args) {
      return Math.ceil(Number(args[0]));
    },
    AND: function (args) {
      return args.flat().every(Boolean);
    },
    OR: function (args) {
      return args.flat().some(Boolean);
    },
    NOT: function (args) {
      return !args[0];
    }
  };

  /**
   * Convert column letter to index (A=0, B=1, ..., Z=25, AA=26, ...)
   */
  function column_to_index(col) {
    col = col.toUpperCase();
    var index = 0;
    for (var i = 0; i < col.length; i++) {
      index = index * 26 + (col.charCodeAt(i) - 64);
    }
    return index - 1;
  }

  /**
   * Convert index to column letter
   */
  function index_to_column(index) {
    if (!Number.isFinite(index)) {
      throw new RangeError('index_to_column requires a finite index, got ' + String(index));
    }
    var col = '';
    index += 1;
    while (index > 0) {
      var mod = (index - 1) % 26;
      col = String.fromCharCode(65 + mod) + col;
      index = Math.floor((index - 1) / 26);
    }
    return col;
  }

  /**
   * Expand a range like A1:A3 into array of cell references
   */
  function expand_range(range_str) {
    var parts = range_str.split(':');
    var start_match = parts[0].match(/^([A-Z]+)(\d+)$/i);
    var end_match = parts[1].match(/^([A-Z]+)(\d+)$/i);
    if (!start_match || !end_match) return [range_str];

    var start_col = column_to_index(start_match[1]);
    var start_row = parseInt(start_match[2], 10) - 1;
    var end_col = column_to_index(end_match[1]);
    var end_row = parseInt(end_match[2], 10) - 1;

    var cells = [];
    var min_col = Math.min(start_col, end_col);
    var max_col = Math.max(start_col, end_col);
    var min_row = Math.min(start_row, end_row);
    var max_row = Math.max(start_row, end_row);

    for (var r = min_row; r <= max_row; r++) {
      for (var c = min_col; c <= max_col; c++) {
        cells.push(index_to_column(c) + (r + 1));
      }
    }
    return cells;
  }

  /**
   * Resolve a cell reference to its value from context
   */
  function resolve_cell(ref, context) {
    if (!context || !context.cells) return 0;
    var key = ref.toUpperCase();
    if (context.cells[key] !== undefined) {
      return context.cells[key];
    }
    return 0;
  }

  /**
   * Resolve a range to array of values
   */
  function resolve_range(range_str, context) {
    var cells = expand_range(range_str);
    return cells.map(function (cell) {
      return resolve_cell(cell, context);
    });
  }

  /**
   * Lexer: tokenize a formula string
   */
  function tokenize(formula) {
    var tokens = [];
    var i = 0;
    var len = formula.length;

    while (i < len) {
      var ch = formula[i];

      if (ch === ' ') {
        i++;
        continue;
      }

      if (ch === '"') {
        var str = '';
        i++;
        while (i < len && formula[i] !== '"') {
          str += formula[i];
          i++;
        }
        i++;
        tokens.push({ type: TOKEN_TYPES.STRING, value: str });
        continue;
      }

      if (ch === '(') {
        tokens.push({ type: TOKEN_TYPES.LPAREN, value: '(' });
        i++;
        continue;
      }

      if (ch === ')') {
        tokens.push({ type: TOKEN_TYPES.RPAREN, value: ')' });
        i++;
        continue;
      }

      if (ch === ':') {
        tokens.push({ type: TOKEN_TYPES.COLON, value: ':' });
        i++;
        continue;
      }

      if (ch === ',') {
        tokens.push({ type: TOKEN_TYPES.COMMA, value: ',' });
        i++;
        continue;
      }

      if (ch === '^') {
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: '^' });
        i++;
        continue;
      }

      if ('+-*/%'.indexOf(ch) !== -1) {
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: ch });
        i++;
        continue;
      }

      if (ch === '=' && formula[i + 1] !== '=') {
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: '=' });
        i++;
        continue;
      }

      if (ch === '!' && formula[i + 1] === '=') {
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: '!=' });
        i += 2;
        continue;
      }

      if (ch === '<' && formula[i + 1] === '=') {
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: '<=' });
        i += 2;
        continue;
      }

      if (ch === '>' && formula[i + 1] === '=') {
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: '>=' });
        i += 2;
        continue;
      }

      if (ch === '<') {
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: '<' });
        i++;
        continue;
      }

      if (ch === '>') {
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: '>' });
        i++;
        continue;
      }

      if (ch === '&') {
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: '&' });
        i++;
        continue;
      }

      if (/[0-9.]/.test(ch)) {
        var num = '';
        while (i < len && /[0-9.]/.test(formula[i])) {
          num += formula[i];
          i++;
        }
        tokens.push({ type: TOKEN_TYPES.NUMBER, value: parseFloat(num) });
        continue;
      }

      if (/[A-Za-z_]/.test(ch)) {
        var ident = '';
        while (i < len && /[A-Za-z0-9_]/.test(formula[i])) {
          ident += formula[i];
          i++;
        }

        if (i < len && formula[i] === '(') {
          tokens.push({ type: TOKEN_TYPES.IDENTIFIER, value: ident.toUpperCase() });
        } else if (/^[A-Za-z]+\d+$/.test(ident)) {
          tokens.push({ type: TOKEN_TYPES.CELL_REF, value: ident.toUpperCase() });
        } else {
          tokens.push({ type: TOKEN_TYPES.IDENTIFIER, value: ident.toUpperCase() });
        }
        continue;
      }

      i++;
    }

    tokens.push({ type: TOKEN_TYPES.EOF, value: null });
    return tokens;
  }

  /**
   * Parser: build AST from tokens
   */
  function parse(tokens) {
    var pos = 0;

    function peek() {
      return tokens[pos];
    }

    function advance() {
      var token = tokens[pos];
      pos++;
      return token;
    }

    function expect(type) {
      var token = peek();
      if (token.type !== type) {
        throw new Error('Expected ' + type + ' but got ' + token.type);
      }
      return advance();
    }

    function parse_primary() {
      var token = peek();

      if (token.type === TOKEN_TYPES.NUMBER) {
        advance();
        return { type: 'number', value: token.value };
      }

      if (token.type === TOKEN_TYPES.STRING) {
        advance();
        return { type: 'string', value: token.value };
      }

      if (token.type === TOKEN_TYPES.CELL_REF) {
        advance();
        if (peek().type === TOKEN_TYPES.COLON) {
          advance();
          var end_ref = advance().value;
          return { type: 'range', value: token.value + ':' + end_ref };
        }
        return { type: 'cell', value: token.value };
      }

      if (token.type === TOKEN_TYPES.LPAREN) {
        advance();
        var expr = parse_expression();
        expect(TOKEN_TYPES.RPAREN);
        return expr;
      }

      if (token.type === TOKEN_TYPES.IDENTIFIER) {
        advance();
        if (token.value === 'AND' || token.value === 'OR' || token.value === 'NOT') {
          expect(TOKEN_TYPES.LPAREN);
          var args = [];
          while (peek().type !== TOKEN_TYPES.RPAREN) {
            args.push(parse_expression());
            if (peek().type === TOKEN_TYPES.COMMA) {
              advance();
            }
          }
          expect(TOKEN_TYPES.RPAREN);
          return { type: 'function', name: token.value, args: args };
        }

        expect(TOKEN_TYPES.LPAREN);
        var func_args = [];
        if (peek().type !== TOKEN_TYPES.RPAREN) {
          func_args.push(parse_expression());
          while (peek().type === TOKEN_TYPES.COMMA) {
            advance();
            func_args.push(parse_expression());
          }
        }
        expect(TOKEN_TYPES.RPAREN);
        return { type: 'function', name: token.value, args: func_args };
      }

      if (token.type === TOKEN_TYPES.OPERATOR && (token.value === '-' || token.value === '+')) {
        advance();
        var operand = parse_primary();
        return { type: 'unary', operator: token.value, operand: operand };
      }

      throw new Error('Unexpected token: ' + token.value);
    }

    function parse_expression(min_prec) {
      if (min_prec === undefined) min_prec = 0;

      var left = parse_primary();

      while (peek().type === TOKEN_TYPES.OPERATOR && (PRECEDENCE[peek().value] || 0) > min_prec) {
        var op_token = advance();
        var right = parse_expression(PRECEDENCE[op_token.value] || 0);
        left = {
          type: 'binary',
          operator: op_token.value,
          left: left,
          right: right
        };
      }

      return left;
    }

    var ast = parse_expression();
    return ast;
  }

  /**
   * Evaluate AST with context (cell values)
   */
  function evaluate(ast, context) {
    if (!ast) return null;

    switch (ast.type) {
      case 'number':
        return ast.value;

      case 'string':
        return ast.value;

      case 'cell':
        return resolve_cell(ast.value, context);

      case 'range':
        return resolve_range(ast.value, context);

      case 'unary':
        var val = evaluate(ast.operand, context);
        if (ast.operator === '-') return -Number(val);
        if (ast.operator === '+') return Number(val);
        return val;

      case 'binary':
        var left = evaluate(ast.left, context);
        var right = evaluate(ast.right, context);

        switch (ast.operator) {
          case '+':
            if (typeof left === 'string' || typeof right === 'string') {
              return String(left) + String(right);
            }
            return Number(left) + Number(right);
          case '-': return Number(left) - Number(right);
          case '*': return Number(left) * Number(right);
          case '/': return Number(left) / Number(right);
          case '%': return Number(left) % Number(right);
          case '^': return Math.pow(Number(left), Number(right));
          case '&': return String(left) + String(right);
          case '=': return left == right;
          case '!=': return left != right;
          case '<': return Number(left) < Number(right);
          case '>': return Number(left) > Number(right);
          case '<=': return Number(left) <= Number(right);
          case '>=': return Number(left) >= Number(right);
          default: return null;
        }

      case 'function':
        var func = FUNCTIONS[ast.name];
        if (!func) throw new Error('Unknown function: ' + ast.name);
        var func_args = ast.args.map(function (arg) {
          return evaluate(arg, context);
        });
        return func(func_args);

      default:
        return null;
    }
  }

  /**
   * Parse a formula string into an AST
   */
  function parse_formula(formula_string) {
    var tokens = tokenize(formula_string);
    return parse(tokens);
  }

  /**
   * Evaluate a formula string directly
   */
  function evaluate_formula(formula_string, context) {
    var ast = parse_formula(formula_string);
    return evaluate(ast, context);
  }

  /**
   * Format a result value for display
   */
  function format_result(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'number') {
      if (Number.isInteger(value)) return value.toString();
      return parseFloat(value.toFixed(10)).toString();
    }
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  }

  return {
    parse_formula: parse_formula,
    evaluate: evaluate,
    evaluate_formula: evaluate_formula,
    format_result: format_result,
    FUNCTIONS: FUNCTIONS,
    expand_range: expand_range,
    column_to_index: column_to_index,
    index_to_column: index_to_column,
    tokenize: tokenize
  };
});
