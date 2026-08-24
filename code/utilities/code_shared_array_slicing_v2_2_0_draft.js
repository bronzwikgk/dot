class ArraySlicingUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(array, start, end) {
    if (!array) {
      return [];
    }
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
    return this.execute(array, start, end);
  }

  slidingWindows(array, windowSize) {
    if (!array) {
      return [];
    }
    if (typeof windowSize !== 'number' || !Number.isFinite(windowSize) || windowSize <= 0) {
      throw new RangeError('slidingWindows requires a finite positive windowSize, got ' + String(windowSize));
    }
    var windows = [];
    var index = 0;
    var maxStart = array.length - windowSize;
    while (index <= maxStart) {
      windows.push(this.execute(array, index, index + windowSize));
      index = index + 1;
    }
    return windows;
  }
}

module.exports = ArraySlicingUtil;