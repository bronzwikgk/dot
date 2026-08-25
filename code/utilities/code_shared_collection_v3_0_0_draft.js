/**
 * @entity collection
 * @meta project: shared | file_name: code_shared_collection_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide collection operations: concatenation, slicing, windowing, filtering, and train/test splitting.
 * @changelog - 2026-08-24: 3.0.0: merged array_concatenation, array_slicing, filtering, train_test_split into one survivor
 */
export class collection_util {
  constructor(config = {}) {
    this.config = config || {};
    this.train_ratio = this.config.train_ratio ?? this.config.train_ratio ?? 0.8;
    this.test_ratio = this.config.test_ratio ?? this.config.test_ratio ?? 0.2;
    this.shuffle = this.config.shuffle || false;
    this.seed = this.config.seed ?? null;
  }

  // from array_concatenation
  concat(arrays) {
    if (!arrays || arrays.length === 0) return [];
    var result = [];
    var arrayIndex = 0;
    var arrayCount = arrays.length;
    while (arrayIndex < arrayCount) {
      var currentArray = arrays[arrayIndex];
      var elementIndex = 0;
      var elementCount = currentArray.length;
      while (elementIndex < elementCount) {
        result.push(currentArray[elementIndex]);
        elementIndex = elementIndex + 1;
      }
      arrayIndex = arrayIndex + 1;
    }
    return result;
  }
  execute(arrays) { return this.concat(arrays); }
  flatten_to_vector(matrix) {
    if (!matrix) return [];
    var result = [];
    var rowIndex = 0;
    var rowCount = matrix.length;
    while (rowIndex < rowCount) {
      var colIndex = 0;
      var colCount = matrix[rowIndex].length;
      while (colIndex < colCount) {
        result.push(matrix[rowIndex][colIndex]);
        colIndex = colIndex + 1;
      }
      rowIndex = rowIndex + 1;
    }
    return result;
  }

  // from array_slicing
  slice(array, start, end) {
    if (!array) return [];
    var safe_start = Math.max(0, start);
    var safe_end = Math.min(array.length, end);
    var result = [];
    var index = safe_start;
    while (index < safe_end) {
      result.push(array[index]);
      index = index + 1;
    }
    return result;
  }
  extract_window(array, window_size, position) {
    var start = position;
    var end = position + window_size;
    return this.slice(array, start, end);
  }
  sliding_windows(array, window_size) {
    if (!array) return [];
    if (typeof window_size !== 'number' || !Number.isFinite(window_size) || window_size <= 0) {
      throw new RangeError('sliding_windows requires a finite positive window_size, got ' + String(window_size));
    }
    var windows = [];
    var index = 0;
    var max_start = array.length - window_size;
    while (index <= max_start) {
      windows.push(this.slice(array, index, index + window_size));
      index = index + 1;
    }
    return windows;
  }

  // from filtering
  filter(items, predicate) {
    if (!items || items.length === 0) return [];
    var result = [];
    var index = 0;
    var count = items.length;
    while (index < count) {
      if (this.matches_predicate(items[index], predicate)) result.push(items[index]);
      index = index + 1;
    }
    return result;
  }
  matches_predicate(item, predicate) {
    if (!predicate) return true;
    var field_value = item[predicate.field];
    var operator = predicate.operator;
    var target_value = predicate.value;
    if (operator === 'eq') return field_value === target_value;
    if (operator === 'neq') return field_value !== target_value;
    if (operator === 'gt') return field_value > target_value;
    if (operator === 'gte') return field_value >= target_value;
    if (operator === 'lt') return field_value < target_value;
    if (operator === 'lte') return field_value <= target_value;
    if (operator === 'abs_lt') return Math.abs(field_value) < target_value;
    if (operator === 'abs_gt') return Math.abs(field_value) > target_value;
    return false;
  }
  filter_by_range(items, field, min, max) {
    var predicate = { field: field, operator: 'gte', value: min };
    var above_min = this.filter(items, predicate);
    var result = [];
    var index = 0;
    var count = above_min.length;
    while (index < count) {
      if (above_min[index][field] <= max) result.push(above_min[index]);
      index = index + 1;
    }
    return result;
  }

  // from train_test_split
  split(data) {
    if (!data || data.length === 0) return { train: [], test: [], train_indices: [], test_indices: [] };
    var indices = [];
    var index = 0;
    var count = data.length;
    while (index < count) { indices.push(index); index = index + 1; }
    if (this.shuffle) indices = this.shuffle_array(indices);
    var split_point = Math.floor(data.length * this.train_ratio);
    var train_indices = [];
    var test_indices = [];
    index = 0;
    while (index < indices.length) {
      if (index < split_point) train_indices.push(indices[index]);
      else test_indices.push(indices[index]);
      index = index + 1;
    }
    var train = [];
    var train_idx_index = 0;
    while (train_idx_index < train_indices.length) { train.push(data[train_indices[train_idx_index]]); train_idx_index = train_idx_index + 1; }
    var test = [];
    var test_idx_index = 0;
    while (test_idx_index < test_indices.length) { test.push(data[test_indices[test_idx_index]]); test_idx_index = test_idx_index + 1; }
    return { train: train, test: test, train_indices: train_indices, test_indices: test_indices };
  }
  shuffle_array(array) {
    var result = [];
    var index = 0;
    var count = array.length;
    while (index < count) { result.push(array[index]); index = index + 1; }
    var random = this.seed === null || this.seed === undefined ? Math.random : this._seeded_random(this.seed);
    var current_index = result.length - 1;
    while (current_index > 0) {
      var random_index = Math.floor(random() * (current_index + 1));
      var temp = result[current_index];
      result[current_index] = result[random_index];
      result[random_index] = temp;
      current_index = current_index - 1;
    }
    return result;
  }
  _seeded_random(seed) {
    var state = Number(seed);
    if (!Number.isFinite(state)) {
      state = String(seed).split('').reduce(function (total, ch) { return total + ch.charCodeAt(0); }, 0);
    }
    state = Math.abs(Math.floor(state)) % 2147483647;
    if (state === 0) state = 1;
    return function () {
      state = (state * 16807) % 2147483647;
      return (state - 1) / 2147483646;
    };
  }
  split_with_labels(data, labels) {
    if (!data || data.length === 0) return { train_data: [], test_data: [], train_labels: [], test_labels: [], train_indices: [], test_indices: [] };
    var indices = [];
    var index = 0;
    var count = data.length;
    while (index < count) { indices.push(index); index = index + 1; }
    if (this.shuffle) indices = this.shuffle_array(indices);
    var split_point = Math.floor(data.length * this.train_ratio);
    var train_indices = [];
    var test_indices = [];
    index = 0;
    while (index < indices.length) {
      if (index < split_point) train_indices.push(indices[index]);
      else test_indices.push(indices[index]);
      index = index + 1;
    }
    var train_data = [];
    var train_labels = [];
    var train_idx_index = 0;
    while (train_idx_index < train_indices.length) {
      train_data.push(data[train_indices[train_idx_index]]);
      if (labels && labels.length > train_indices[train_idx_index]) train_labels.push(labels[train_indices[train_idx_index]]);
      train_idx_index = train_idx_index + 1;
    }
    var test_data = [];
    var test_labels = [];
    var test_idx_index = 0;
    while (test_idx_index < test_indices.length) {
      test_data.push(data[test_indices[test_idx_index]]);
      if (labels && labels.length > test_indices[test_idx_index]) test_labels.push(labels[test_indices[test_idx_index]]);
      test_idx_index = test_idx_index + 1;
    }
    return { train_data: train_data, test_data: test_data, train_labels: train_labels, test_labels: test_labels, train_indices: train_indices, test_indices: test_indices };
  }
  execute_with_labels(data, labels) { return this.split_with_labels(data, labels); }
}
export default collection_util;
