/**
 * @entity pipeline_runner
 * @meta project: shared | file_name: code_shared_pipeline_runner_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective execute declared md pipelines by topologically sorting tasks and running them against an injected task registry.
 * @purpose_and_problem_statement pipelines are data, not code; a runner that resolves inputs and orders dependencies lets md templates execute deterministically.
 * @usage const runner = new PipelineRunner({ taskRegistry }); const results = runner.execute(pipelineConfig, inputData);
 * @timing invoked by the run_pipeline stage of the flow.
 * @scope_boundaries in_scope: topological ordering, input resolution (data, task_output, config), sequential execution. out_of_scope: task implementations (injected), parallel scheduling.
 * @dependencies none (taskRegistry injected).
 * @keywords pipeline, runner, dag, tasks
 * @invariants execution order respects dependencies; unknown task types yield error records instead of throwing; results are keyed by task_id.
 * @changelog - 2026-08-24: 3.0.0: promoted code_shared_runner_v2_2_0_draft to shared form with esm export; task registry stays injectable (no static task imports); algorithm preserved exactly
 */
export class PipelineRunner {
  constructor(config) {
    this.config = config || {};
    this.taskRegistry = this.config.taskRegistry || {};
    this.results = {};
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

export default PipelineRunner;
