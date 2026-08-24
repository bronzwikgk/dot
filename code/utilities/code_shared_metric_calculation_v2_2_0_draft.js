var MeanCalculationUtil = require('./mean_calculation_util');
var StandardDeviationUtil = require('./standard_deviation_util');

class MetricCalculationUtil {
  constructor(config) {
    this.config = config || {};
    this.meanUtil = new MeanCalculationUtil();
    this.stdUtil = new StandardDeviationUtil();
  }

  calculateAccuracy(predictions, actuals) {
    if (!predictions || !actuals || predictions.length !== actuals.length) {
      return 0;
    }
    var correct = 0;
    var total = predictions.length;
    var index = 0;
    while (index < total) {
      if (predictions[index] === actuals[index]) {
        correct = correct + 1;
      }
      index = index + 1;
    }
    return correct / total;
  }

  calculateSharpeRatio(returns, riskFreeRate) {
    if (!returns || returns.length === 0) {
      return 0;
    }
    var safeRiskFreeRate = riskFreeRate || 0;
    var excessReturns = [];
    var index = 0;
    var count = returns.length;
    while (index < count) {
      excessReturns.push(returns[index] - safeRiskFreeRate);
      index = index + 1;
    }
    var meanExcessReturn = this.meanUtil.execute(excessReturns);
    var stdExcessReturn = this.stdUtil.execute(excessReturns);
    if (stdExcessReturn === 0) {
      return 0;
    }
    return meanExcessReturn / stdExcessReturn;
  }

  calculateHitRate(signals, actualReturns, threshold) {
    if (!signals || !actualReturns || signals.length !== actualReturns.length) {
      return 0;
    }
    var safeThreshold = threshold || 0;
    var hits = 0;
    var total = 0;
    var index = 0;
    var count = signals.length;
    while (index < count) {
      if (signals[index] !== 0) {
        total = total + 1;
        var isCorrect = false;
        if (signals[index] === 1 && actualReturns[index] > safeThreshold) {
          isCorrect = true;
        }
        if (signals[index] === -1 && actualReturns[index] < -safeThreshold) {
          isCorrect = true;
        }
        if (isCorrect) {
          hits = hits + 1;
        }
      }
      index = index + 1;
    }
    if (total === 0) {
      return 0;
    }
    return hits / total;
  }

  calculateMeanAbsoluteError(predictions, actuals) {
    if (!predictions || !actuals || predictions.length !== actuals.length) {
      return 0;
    }
    var sumAbsErrors = 0;
    var index = 0;
    var count = predictions.length;
    while (index < count) {
      sumAbsErrors = sumAbsErrors + Math.abs(predictions[index] - actuals[index]);
      index = index + 1;
    }
    return sumAbsErrors / count;
  }

  calculateMeanSquaredError(predictions, actuals) {
    if (!predictions || !actuals || predictions.length !== actuals.length) {
      return 0;
    }
    var sumSquaredErrors = 0;
    var index = 0;
    var count = predictions.length;
    while (index < count) {
      var diff = predictions[index] - actuals[index];
      sumSquaredErrors = sumSquaredErrors + (diff * diff);
      index = index + 1;
    }
    return sumSquaredErrors / count;
  }

  calculateRootMeanSquaredError(predictions, actuals) {
    var mse = this.calculateMeanSquaredError(predictions, actuals);
    return Math.sqrt(mse);
  }

  calculateR2Score(predictions, actuals) {
    if (!predictions || !actuals || predictions.length !== actuals.length) {
      return 0;
    }
    var mean = this.meanUtil.execute(actuals);
    var totalSumSquares = 0;
    var residualSumSquares = 0;
    var index = 0;
    var count = predictions.length;
    while (index < count) {
      var diffActual = actuals[index] - mean;
      totalSumSquares = totalSumSquares + (diffActual * diffActual);
      var diffPredicted = actuals[index] - predictions[index];
      residualSumSquares = residualSumSquares + (diffPredicted * diffPredicted);
      index = index + 1;
    }
    if (totalSumSquares === 0) {
      return 0;
    }
    return 1 - (residualSumSquares / totalSumSquares);
  }
}

module.exports = MetricCalculationUtil;