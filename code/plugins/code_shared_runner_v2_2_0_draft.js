var tasks = require('../task/tasks');

class PipelineRunner {
  constructor(config) {
    this.config = config || {};
    this.taskRegistry = this.initializeTaskRegistry();
    this.results = {};
  }

  initializeTaskRegistry() {
    return {
      similarity_matching: tasks.SimilarityMatchingTask,
      sequential_pattern_matching: tasks.SequentialPatternMatchingTask,
      probability_estimation: tasks.ProbabilityEstimationTask,
      ranking: tasks.RankingTask,
      feature_extraction: tasks.FeatureExtractionTask,
      dimensionality_reduction: tasks.DimensionalityReductionTask,
      clustering_grouping: tasks.ClusteringGroupingTask,
      cold_start: tasks.ColdStartTask,
      scoring_rating_prediction: tasks.ScoringRatingPredictionTask,
      experiment_comparison: tasks.ExperimentComparisonTask,
      fast_retrieval: tasks.FastRetrievalTask,
      model_training: tasks.ModelTrainingTask,
      model_inference: tasks.ModelInferenceTask
    };
  }

  execute(pipelineConfig, inputData) {
    this.results = {};
    this.results.input = inputData;
    var taskOrder = this.topologicalSort(pipelineConfig.tasks);
    var index = 0;
    var count = taskOrder.length;
    while (index < count) {
      var taskConfig = taskOrder[index];
      var taskResult = this.executeTask(taskConfig, inputData);
      this.results[taskConfig.task_id] = taskResult;
      index = index + 1;
    }
    return this.results;
  }

  executeTask(taskConfig, inputData) {
    var TaskClass = this.taskRegistry[taskConfig.task_type];
    if (!TaskClass) {
      return { error: 'Unknown task type: ' + taskConfig.task_type };
    }
    var task = new TaskClass(taskConfig.parameters || {});
    var input = this.resolveInput(taskConfig, inputData);
    return task.execute.apply(task, input);
  }

  resolveInput(taskConfig, inputData) {
    if (!taskConfig.input_sources) {
      return [];
    }
    var resolved = [];
    var index = 0;
    var count = taskConfig.input_sources.length;
    while (index < count) {
      var source = taskConfig.input_sources[index];
      var value = this.resolveSource(source, inputData);
      resolved.push(value);
      index = index + 1;
    }
    return resolved;
  }

  resolveSource(source, inputData) {
    if (source.source_type === 'data') {
      return inputData[source.field];
    }
    if (source.source_type === 'task_output') {
      return this.results[source.task_id];
    }
    if (source.source_type === 'config') {
      return source.value;
    }
    return null;
  }

  topologicalSort(tasks) {
    if (!tasks || tasks.length === 0) {
      return [];
    }
    var sorted = [];
    var visited = {};
    var taskMap = {};
    var index = 0;
    var count = tasks.length;
    while (index < count) {
      taskMap[tasks[index].task_id] = tasks[index];
      index = index + 1;
    }
    index = 0;
    while (index < count) {
      var taskId = tasks[index].task_id;
      if (!visited[taskId]) {
        this.visitTask(taskId, taskMap, visited, sorted);
      }
      index = index + 1;
    }
    return sorted;
  }

  visitTask(taskId, taskMap, visited, sorted) {
    visited[taskId] = true;
    var task = taskMap[taskId];
    if (task && task.dependencies) {
      var index = 0;
      var count = task.dependencies.length;
      while (index < count) {
        var depId = task.dependencies[index];
        if (!visited[depId]) {
          this.visitTask(depId, taskMap, visited, sorted);
        }
        index = index + 1;
      }
    }
    if (task) {
      sorted.push(task);
    }
  }

  getResults() {
    return this.results;
  }

  getResult(taskId) {
    return this.results[taskId];
  }
}

module.exports = PipelineRunner;