class PmiUtil {
  constructor(config) {
    this.config = config || {};
    this.base = config.base || 2;
  }

  execute(pAb, pA, pB) {
    if (pA <= 0 || pB <= 0 || pAb <= 0) {
      return 0;
    }
    var pmiValue = Math.log(pAb / (pA * pB)) / Math.log(this.base);
    return pmiValue;
  }

  executeFromCounts(countA, countB, countAB, totalCount) {
    if (totalCount <= 0) {
      return 0;
    }
    var pA = countA / totalCount;
    var pB = countB / totalCount;
    var pAb = countAB / totalCount;
    return this.execute(pAb, pA, pB);
  }

  executeNormalized(pAb, pA, pB) {
    var pmiValue = this.execute(pAb, pA, pB);
    var maxPmi = -Math.log(Math.min(pA, pB)) / Math.log(this.base);
    if (maxPmi <= 0) {
      return 0;
    }
    return pmiValue / maxPmi;
  }
}

module.exports = PmiUtil;