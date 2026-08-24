var MeanCalculationUtil = require('./mean_calculation_util');

class StandardDeviationUtil {
  constructor(config) {
    this.config = config || {};
    this.meanUtil = new MeanCalculationUtil();
  }

  execute(values) {
    if (!values || values.length < 2) {
      return 0;
    }
    var mean = this.meanUtil.execute(values);
    var sumSquaredDiffs = 0;
    var count = values.length;
    var index = 0;
    while (index < count) {
      var diff = values[index] - mean;
      sumSquaredDiffs = sumSquaredDiffs + (diff * diff);
      index = index + 1;
    }
    var variance = sumSquaredDiffs / count;
    return Math.sqrt(variance);
  }
}

module.exports = StandardDeviationUtil;