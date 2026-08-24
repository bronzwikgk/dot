class MeanCalculationUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(values) {
    if (!values || values.length === 0) {
      return 0;
    }
    var sum = 0;
    var count = values.length;
    var index = 0;
    while (index < count) {
      sum = sum + values[index];
      index = index + 1;
    }
    return sum / count;
  }
}

module.exports = MeanCalculationUtil;