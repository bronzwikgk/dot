class CosineSimilarityUtil {
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
    var dotProduct = 0;
    var magnitudeA = 0;
    var magnitudeB = 0;
    var index = 0;
    var count = vectorA.length;
    while (index < count) {
      dotProduct = dotProduct + (vectorA[index] * vectorB[index]);
      magnitudeA = magnitudeA + (vectorA[index] * vectorA[index]);
      magnitudeB = magnitudeB + (vectorB[index] * vectorB[index]);
      index = index + 1;
    }
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }
    return dotProduct / (magnitudeA * magnitudeB);
  }

  executeBatch(targetVector, candidateVectors) {
    var similarities = [];
    var index = 0;
    var count = candidateVectors.length;
    while (index < count) {
      similarities.push(this.execute(targetVector, candidateVectors[index]));
      index = index + 1;
    }
    return similarities;
  }
}

module.exports = CosineSimilarityUtil;