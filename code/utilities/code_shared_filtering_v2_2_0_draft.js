class FilteringUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(items, predicate) {
    if (!items || items.length === 0) {
      return [];
    }
    var result = [];
    var index = 0;
    var count = items.length;
    while (index < count) {
      if (this.matchesPredicate(items[index], predicate)) {
        result.push(items[index]);
      }
      index = index + 1;
    }
    return result;
  }

  matchesPredicate(item, predicate) {
    if (!predicate) {
      return true;
    }
    var fieldValue = item[predicate.field];
    var operator = predicate.operator;
    var targetValue = predicate.value;
    if (operator === 'eq') {
      return fieldValue === targetValue;
    }
    if (operator === 'neq') {
      return fieldValue !== targetValue;
    }
    if (operator === 'gt') {
      return fieldValue > targetValue;
    }
    if (operator === 'gte') {
      return fieldValue >= targetValue;
    }
    if (operator === 'lt') {
      return fieldValue < targetValue;
    }
    if (operator === 'lte') {
      return fieldValue <= targetValue;
    }
    if (operator === 'abs_lt') {
      return Math.abs(fieldValue) < targetValue;
    }
    if (operator === 'abs_gt') {
      return Math.abs(fieldValue) > targetValue;
    }
    return false;
  }

  filterByRange(items, field, min, max) {
    var predicate = {
      field: field,
      operator: 'gte',
      value: min
    };
    var aboveMin = this.execute(items, predicate);
    var result = [];
    var index = 0;
    var count = aboveMin.length;
    while (index < count) {
      if (aboveMin[index][field] <= max) {
        result.push(aboveMin[index]);
      }
      index = index + 1;
    }
    return result;
  }
}

module.exports = FilteringUtil;