class WeightedMeanUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(values, weights) {
    if (!values || !weights) {
      return 0;
    }
    if (values.length !== weights.length) {
      return 0;
    }
    var weightedSum = 0;
    var weightSum = 0;
    var index = 0;
    var count = values.length;
    while (index < count) {
      weightedSum = weightedSum + (values[index] * weights[index]);
      weightSum = weightSum + weights[index];
      index = index + 1;
    }
    if (weightSum === 0) {
      return 0;
    }
    return weightedSum / weightSum;
  }
}

module.exports = WeightedMeanUtil;