/**
 * @entity collection
 * @meta project: shared | file_name: code_shared_collection_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide collection operations: concatenation, slicing, windowing, filtering, and train/test splitting.
 * @changelog - 2026-08-24: 3.0.0: merged array_concatenation, array_slicing, filtering, train_test_split into one survivor
 */
export class CollectionUtil {
  constructor(config = {}) {
    this.config = config || {};
    this.trainRatio = this.config.trainRatio ?? 0.8;
    this.testRatio = this.config.testRatio ?? 0.2;
    this.shuffle = this.config.shuffle || false;
    this.seed = this.config.seed || null;
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
  flattenToVector(matrix) {
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
    var safeStart = Math.max(0, start);
    var safeEnd = Math.min(array.length, end);
    var result = [];
    var index = safeStart;
    while (index < safeEnd) {
      result.push(array[index]);
      index = index + 1;
    }
    return result;
  }
  extractWindow(array, windowSize, position) {
    var start = position;
    var end = position + windowSize;
    return this.slice(array, start, end);
  }
  slidingWindows(array, windowSize) {
    if (!array) return [];
    if (typeof windowSize !== 'number' || !Number.isFinite(windowSize) || windowSize <= 0) {
      throw new RangeError('slidingWindows requires a finite positive windowSize, got ' + String(windowSize));
    }
    var windows = [];
    var index = 0;
    var maxStart = array.length - windowSize;
    while (index <= maxStart) {
      windows.push(this.slice(array, index, index + windowSize));
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
      if (this.matchesPredicate(items[index], predicate)) result.push(items[index]);
      index = index + 1;
    }
    return result;
  }
  matchesPredicate(item, predicate) {
    if (!predicate) return true;
    var fieldValue = item[predicate.field];
    var operator = predicate.operator;
    var targetValue = predicate.value;
    if (operator === 'eq') return fieldValue === targetValue;
    if (operator === 'neq') return fieldValue !== targetValue;
    if (operator === 'gt') return fieldValue > targetValue;
    if (operator === 'gte') return fieldValue >= targetValue;
    if (operator === 'lt') return fieldValue < targetValue;
    if (operator === 'lte') return fieldValue <= targetValue;
    if (operator === 'abs_lt') return Math.abs(fieldValue) < targetValue;
    if (operator === 'abs_gt') return Math.abs(fieldValue) > targetValue;
    return false;
  }
  filterByRange(items, field, min, max) {
    var predicate = { field: field, operator: 'gte', value: min };
    var aboveMin = this.filter(items, predicate);
    var result = [];
    var index = 0;
    var count = aboveMin.length;
    while (index < count) {
      if (aboveMin[index][field] <= max) result.push(aboveMin[index]);
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
    if (this.shuffle) indices = this.shuffleArray(indices);
    var splitPoint = Math.floor(data.length * this.trainRatio);
    var trainIndices = [];
    var testIndices = [];
    index = 0;
    while (index < indices.length) {
      if (index < splitPoint) trainIndices.push(indices[index]);
      else testIndices.push(indices[index]);
      index = index + 1;
    }
    var train = [];
    var trainIdxIndex = 0;
    while (trainIdxIndex < trainIndices.length) { train.push(data[trainIndices[trainIdxIndex]]); trainIdxIndex = trainIdxIndex + 1; }
    var test = [];
    var testIdxIndex = 0;
    while (testIdxIndex < testIndices.length) { test.push(data[testIndices[testIdxIndex]]); testIdxIndex = testIdxIndex + 1; }
    return { train: train, test: test, train_indices: trainIndices, test_indices: testIndices };
  }
  shuffleArray(array) {
    var result = [];
    var index = 0;
    var count = array.length;
    while (index < count) { result.push(array[index]); index = index + 1; }
    var currentIndex = result.length - 1;
    while (currentIndex > 0) {
      var randomIndex = Math.floor(Math.random() * (currentIndex + 1));
      var temp = result[currentIndex];
      result[currentIndex] = result[randomIndex];
      result[randomIndex] = temp;
      currentIndex = currentIndex - 1;
    }
    return result;
  }
  splitWithLabels(data, labels) {
    if (!data || data.length === 0) return { train_data: [], test_data: [], train_labels: [], test_labels: [], train_indices: [], test_indices: [] };
    var indices = [];
    var index = 0;
    var count = data.length;
    while (index < count) { indices.push(index); index = index + 1; }
    if (this.shuffle) indices = this.shuffleArray(indices);
    var splitPoint = Math.floor(data.length * this.trainRatio);
    var trainIndices = [];
    var testIndices = [];
    index = 0;
    while (index < indices.length) {
      if (index < splitPoint) trainIndices.push(indices[index]);
      else testIndices.push(indices[index]);
      index = index + 1;
    }
    var trainData = [];
    var trainLabels = [];
    var trainIdxIndex = 0;
    while (trainIdxIndex < trainIndices.length) {
      trainData.push(data[trainIndices[trainIdxIndex]]);
      if (labels && labels.length > trainIndices[trainIdxIndex]) trainLabels.push(labels[trainIndices[trainIdxIndex]]);
      trainIdxIndex = trainIdxIndex + 1;
    }
    var testData = [];
    var testLabels = [];
    var testIdxIndex = 0;
    while (testIdxIndex < testIndices.length) {
      testData.push(data[testIndices[testIdxIndex]]);
      if (labels && labels.length > testIndices[testIdxIndex]) testLabels.push(labels[testIndices[testIdxIndex]]);
      testIdxIndex = testIdxIndex + 1;
    }
    return { train_data: trainData, test_data: testData, train_labels: trainLabels, test_labels: testLabels, train_indices: trainIndices, test_indices: testIndices };
  }
  executeWithLabels(data, labels) { return this.splitWithLabels(data, labels); }
}
export default CollectionUtil;
