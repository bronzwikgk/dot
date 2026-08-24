class StandardErrorUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(stdDev, sampleSize) {
    if (sampleSize <= 0) {
      return 0;
    }
    return stdDev / Math.sqrt(sampleSize);
  }
}

module.exports = StandardErrorUtil;