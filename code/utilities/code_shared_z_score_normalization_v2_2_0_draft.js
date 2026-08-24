class ZScoreNormalizationUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(rawValue, mean, stdDev) {
    if (stdDev === 0) {
      return 0;
    }
    return (rawValue - mean) / stdDev;
  }

  executeBatch(values, mean, stdDev) {
    var result = [];
    var index = 0;
    var count = values.length;
    while (index < count) {
      result.push(this.execute(values[index], mean, stdDev));
      index = index + 1;
    }
    return result;
  }
}

module.exports = ZScoreNormalizationUtil;