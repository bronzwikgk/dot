class SortingUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(items, order) {
    if (!items || items.length === 0) {
      return [];
    }
    var result = [];
    var index = 0;
    var count = items.length;
    while (index < count) {
      result.push(items[index]);
      index = index + 1;
    }
    var sorted = this.bubbleSort(result, order);
    return sorted;
  }

  bubbleSort(arr, order) {
    var n = arr.length;
    var i = 0;
    while (i < n) {
      var j = 0;
      while (j < n - i - 1) {
        var shouldSwap = false;
        if (order === 'desc') {
          shouldSwap = arr[j] < arr[j + 1];
        } else {
          shouldSwap = arr[j] > arr[j + 1];
        }
        if (shouldSwap) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
        j = j + 1;
      }
      i = i + 1;
    }
    return arr;
  }

  sortByKey(items, key, order) {
    if (!items || items.length === 0) {
      return [];
    }
    var result = [];
    var index = 0;
    var count = items.length;
    while (index < count) {
      result.push(items[index]);
      index = index + 1;
    }
    var sorted = this.bubbleSortByKey(result, key, order);
    return sorted;
  }

  bubbleSortByKey(arr, key, order) {
    var n = arr.length;
    var i = 0;
    while (i < n) {
      var j = 0;
      while (j < n - i - 1) {
        var valA = arr[j][key];
        var valB = arr[j + 1][key];
        var shouldSwap = false;
        if (order === 'desc') {
          shouldSwap = valA < valB;
        } else {
          shouldSwap = valA > valB;
        }
        if (shouldSwap) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
        j = j + 1;
      }
      i = i + 1;
    }
    return arr;
  }
}

module.exports = SortingUtil;