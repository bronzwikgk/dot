/**
 * @entity stats
 * @meta project: shared | file_name: code_shared_stats_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide statistical calculations: mean, standard deviation, standard error, confidence interval, weighted mean, z-score.
 * @changelog - 2026-08-24: 3.0.0: merged mean_calculation, standard_deviation, standard_error, confidence_interval, weighted_mean, z_score_normalization
 */
export class stats_util {
  constructor(config = {}) {
    this.config = config || {};
    this.z_critical = this.config.z_critical ?? this.config.z_critical ?? 1.96;
  }
  mean(values) {
    if (!values || values.length === 0) return 0;
    var sum = 0; var count = values.length; var index = 0;
    while (index < count) { sum = sum + values[index]; index = index + 1; }
    return sum / count;
  }
  execute(values) { return this.mean(values); }
  standard_deviation(values) {
    if (!values || values.length < 2) return 0;
    var mean = this.mean(values);
    var sum_squared_diffs = 0; var count = values.length; var index = 0;
    while (index < count) { var diff = values[index] - mean; sum_squared_diffs = sum_squared_diffs + (diff * diff); index = index + 1; }
    return Math.sqrt(sum_squared_diffs / count);
  }
  standard_error(std_dev, sample_size) {
    if (sample_size <= 0) return 0;
    return std_dev / Math.sqrt(sample_size);
  }
  confidence_interval(mean, standard_error) {
    var margin = this.z_critical * standard_error;
    return { lower: mean - margin, upper: mean + margin, midpoint: mean, width: margin * 2 };
  }
  weighted_mean(values, weights) {
    if (!values || !weights) return 0;
    if (values.length !== weights.length) return 0;
    var weighted_sum = 0; var weight_sum = 0; var index = 0; var count = values.length;
    while (index < count) { weighted_sum = weighted_sum + (values[index] * weights[index]); weight_sum = weight_sum + weights[index]; index = index + 1; }
    if (weight_sum === 0) return 0;
    return weighted_sum / weight_sum;
  }
  z_score(raw_value, mean, std_dev) {
    if (std_dev === 0) return 0;
    return (raw_value - mean) / std_dev;
  }
  z_score_batch(values, mean, std_dev) {
    if (!values || values.length === 0) return [];
    var result = []; var index = 0; var count = values.length;
    while (index < count) { result.push(this.z_score(values[index], mean, std_dev)); index = index + 1; }
    return result;
  }
  execute_batch(values, mean, std_dev) { return this.z_score_batch(values, mean, std_dev); }
}
export default stats_util;
