class ArrayConcatenationUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(arrays) {
    if (!arrays || arrays.length === 0) {
      return [];
    }
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
}

module.exports = ArrayConcatenationUtil;