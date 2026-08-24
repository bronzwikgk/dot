class WeightedVoteUtil {
  constructor(config) {
    this.config = config || {};
  }

  execute(labels, weights) {
    if (!labels || !weights) {
      return { winner: 0, confidence: 0, distribution: {} };
    }
    if (labels.length !== weights.length) {
      return { winner: 0, confidence: 0, distribution: {} };
    }
    var distribution = {};
    var totalWeight = 0;
    var index = 0;
    var count = labels.length;
    while (index < count) {
      var label = labels[index];
      var weight = weights[index];
      if (distribution[label] === undefined) {
        distribution[label] = 0;
      }
      distribution[label] = distribution[label] + weight;
      totalWeight = totalWeight + weight;
      index = index + 1;
    }
    if (totalWeight === 0) {
      return { winner: 0, confidence: 0, distribution: distribution };
    }
    var winner = 0;
    var maxWeight = 0;
    var keys = Object.keys(distribution);
    var keyIndex = 0;
    while (keyIndex < keys.length) {
      var key = keys[keyIndex];
      if (distribution[key] > maxWeight) {
        maxWeight = distribution[key];
        winner = parseFloat(key);
      }
      keyIndex = keyIndex + 1;
    }
    var confidence = maxWeight / totalWeight;
    return {
      winner: winner,
      confidence: confidence,
      distribution: distribution
    };
  }
}

module.exports = WeightedVoteUtil;