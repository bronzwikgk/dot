class EuclideanDistanceUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(vectorA, vectorB) {
    if (!vectorA || !vectorB) {
      return 0;
    }
    if (vectorA.length !== vectorB.length) {
      return 0;
    }
    var sumSquaredDiffs = 0;
    var index = 0;
    var count = vectorA.length;
    while (index < count) {
      var diff = vectorA[index] - vectorB[index];
      sumSquaredDiffs = sumSquaredDiffs + (diff * diff);
      index = index + 1;
    }
    return Math.sqrt(sumSquaredDiffs);
  }

  executeBatch(targetVector, candidateVectors) {
    var distances = [];
    var index = 0;
    var count = candidateVectors.length;
    while (index < count) {
      distances.push(this.execute(targetVector, candidateVectors[index]));
      index = index + 1;
    }
    return distances;
  }
}

module.exports = EuclideanDistanceUtil;