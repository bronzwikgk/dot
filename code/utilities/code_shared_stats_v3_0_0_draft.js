/**
 * @entity stats
 * @meta project: shared | file_name: code_shared_stats_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide statistical calculations: mean, standard deviation, standard error, confidence interval, weighted mean, z-score.
 * @changelog - 2026-08-24: 3.0.0: merged mean_calculation, standard_deviation, standard_error, confidence_interval, weighted_mean, z_score_normalization
 */
export class StatsUtil {
  constructor(config = {}) {
    this.config = config || {};
    this.zCritical = this.config.zCritical ?? 1.96;
  }
  mean(values) {
    if (!values || values.length === 0) return 0;
    var sum = 0; var count = values.length; var index = 0;
    while (index < count) { sum = sum + values[index]; index = index + 1; }
    return sum / count;
  }
  execute(values) { return this.mean(values); }
  standardDeviation(values) {
    if (!values || values.length < 2) return 0;
    var mean = this.mean(values);
    var sumSquaredDiffs = 0; var count = values.length; var index = 0;
    while (index < count) { var diff = values[index] - mean; sumSquaredDiffs = sumSquaredDiffs + (diff * diff); index = index + 1; }
    return Math.sqrt(sumSquaredDiffs / count);
  }
  standardError(stdDev, sampleSize) {
    if (sampleSize <= 0) return 0;
    return stdDev / Math.sqrt(sampleSize);
  }
  confidenceInterval(mean, standardError) {
    var margin = this.zCritical * standardError;
    return { lower: mean - margin, upper: mean + margin, midpoint: mean, width: margin * 2 };
  }
  weightedMean(values, weights) {
    if (!values || !weights) return 0;
    if (values.length !== weights.length) return 0;
    var weightedSum = 0; var weightSum = 0; var index = 0; var count = values.length;
    while (index < count) { weightedSum = weightedSum + (values[index] * weights[index]); weightSum = weightSum + weights[index]; index = index + 1; }
    if (weightSum === 0) return 0;
    return weightedSum / weightSum;
  }
  zScore(rawValue, mean, stdDev) {
    if (stdDev === 0) return 0;
    return (rawValue - mean) / stdDev;
  }
  zScoreBatch(values, mean, stdDev) {
    if (!values || values.length === 0) return [];
    var result = []; var index = 0; var count = values.length;
    while (index < count) { result.push(this.zScore(values[index], mean, stdDev)); index = index + 1; }
    return result;
  }
  executeBatch(values, mean, stdDev) { return this.zScoreBatch(values, mean, stdDev); }
}
export default StatsUtil;
