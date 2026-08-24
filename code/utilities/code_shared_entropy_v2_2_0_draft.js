class EntropyUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(probabilities) {
    if (!probabilities || probabilities.length === 0) {
      return 0;
    }
    var entropy = 0;
    var index = 0;
    var count = probabilities.length;
    while (index < count) {
      var p = probabilities[index];
      if (p > 0) {
        entropy = entropy - (p * Math.log2(p));
      }
      index = index + 1;
    }
    return entropy;
  }

  executeFromCounts(counts) {
    if (!counts || counts.length === 0) {
      return 0;
    }
    var total = 0;
    var index = 0;
    var count = counts.length;
    while (index < count) {
      total = total + counts[index];
      index = index + 1;
    }
    if (total === 0) {
      return 0;
    }
    var probabilities = [];
    index = 0;
    while (index < count) {
      probabilities.push(counts[index] / total);
      index = index + 1;
    }
    return this.execute(probabilities);
  }

  executeFromLabels(labels) {
    if (!labels || labels.length === 0) {
      return 0;
    }
    var counts = {};
    var index = 0;
    var count = labels.length;
    while (index < count) {
      var label = labels[index];
      if (counts[label] === undefined) {
        counts[label] = 0;
      }
      counts[label] = counts[label] + 1;
      index = index + 1;
    }
    var countArray = [];
    var keys = Object.keys(counts);
    var keyIndex = 0;
    while (keyIndex < keys.length) {
      countArray.push(counts[keys[keyIndex]]);
      keyIndex = keyIndex + 1;
    }
    return this.executeFromCounts(countArray);
  }
}

module.exports = EntropyUtil;