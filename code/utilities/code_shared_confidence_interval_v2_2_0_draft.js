class ConfidenceIntervalUtil {
  constructor(config) {
    this.config = config || {};
    this.zCritical = (config && config.zCritical) || 1.96;
  }

  execute(mean, standardError) {
    var margin = this.zCritical * standardError;
    return {
      lower: mean - margin,
      upper: mean + margin,
      midpoint: mean,
      width: margin * 2
    };
  }
}

module.exports = ConfidenceIntervalUtil;