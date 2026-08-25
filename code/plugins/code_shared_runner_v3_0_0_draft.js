/**
 * @entity runner
 * @meta project: shared | file_name: code_shared_runner_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective execute declared workflows in two modes: ast plans (sequential steps with conditions, jumps, termination) and dag plans (dependency-ordered tasks), nestable in both directions under one shared safety kernel.
 * @purpose_and_problem_statement execute_workflow needs one engine for both imperative flows and declarative pipelines; two separate runners could not compose and duplicated dispatch and budget logic.
 * @usage const r = new runner({ actions, validator, taskRegistry }); r.registerPlan("main", { steps: [...] }); r.registerPlan("graph", { tasks: [...] }); await r.run("main", input);
 * @timing invoked by the execute_workflow stage and by pipeline tasks that embed flows.
 * @scope_boundaries in_scope: plan registration, ast walking (conditions, next_map, terminate, decompose), dag walking (topological order, input sources, conditional skips), cross-mode nesting, shared action budget and depth cap. out_of_scope: worker implementations (registry/actions injected), parallel scheduling.
 * @dependencies validator (optional; rule gating and input resolution), actions host (optional), task registry (optional).
 * @keywords runner, workflow, dag, ast, steps, decompose, budget
 * @design_notes learned from argo workflows (steps and dag templates are siblings in one engine and nest freely in both directions) and aws step functions (named choice routing with terminal succeed and fail states plus a machine-level budget). dag conditional skips record visible skipped findings instead of vanishing; next_map jumps validate their target instead of silently rewinding.
 * @invariants sessions report status honestly; the action budget is shared across every nesting level of one root run; nesting depth is capped; unknown targets raise findings, never silent loops.
 * @changelog - 2026-08-24: 3.0.0: unified runner absorbing flow engine walking semantics and pipeline runner scheduling semantics; cross-mode decompose added; sys-04 budget made shared across nesting; depth cap added; next_map target validation added
 */
const DEFAULT_ACTION_LIMIT = 50;
const DEFAULT_DEPTH_LIMIT = 16;

export class runner {
  constructor(deps = {}) {
    this.actions = deps.actions || null;
    this.validator = deps.validator || null;
    this.taskRegistry = deps.taskRegistry || {};
    this.entityLabel = deps.entityLabel || 'Plan';
    this.limits = {
      actions: (deps.limits && deps.limits.actions) || DEFAULT_ACTION_LIMIT,
      depth: (deps.limits && deps.limits.depth) || DEFAULT_DEPTH_LIMIT
    };
    this.plans = {};
    this.activeSessions = {};
    this.sessionCounter = 0;
  }

  registerPlan(name, plan) {
    const prepared = this._preparePlan(plan);
    this.plans[name] = prepared;
    return prepared;
  }

  _preparePlan(plan) {
    if (!plan) return plan;
    const prepared = { ...plan };
    if (!prepared.kind) {
      prepared.kind = Array.isArray(prepared.steps) ? 'ast' : Array.isArray(prepared.tasks) ? 'dag' : 'unknown';
    }
    return prepared;
  }

  async run(planOrName, input = {}, parentSession = null) {
    const plan = typeof planOrName === 'string' ? this.plans[planOrName] : this._preparePlan(planOrName);
    if (!plan) {
      throw new Error(`${this.entityLabel} '${planOrName}' not found`);
    }

    const depth = parentSession ? (parentSession.depth || 0) + 1 : 0;
    if (depth > this.limits.depth) {
      throw new Error(`[SYS-05] Nesting depth exceeded (${this.limits.depth}) in ${this.entityLabel.toLowerCase()} '${typeof planOrName === 'string' ? planOrName : '<inline>'}'`);
    }

    this.sessionCounter += 1;
    const sessionId = `run_${Date.now()}_${this.sessionCounter}_d${depth}`;
    const session = {
      id: sessionId,
      status: 'running',
      kind: plan.kind,
      input,
      outputs: {},
      stepOutputs: null,
      currentStepIndex: 0,
      depth,
      parent: parentSession ? parentSession.id : null,
      budget: parentSession ? parentSession.budget : { count: 0 }
    };

    this.activeSessions[sessionId] = session;

    try {
      let result;
      if (plan.kind === 'dag') {
        result = await this._walkDag(plan, session);
      } else if (plan.kind === 'ast') {
        result = await this._walkAst(plan, session);
      } else {
        throw new Error(`[SYS-06] Plan has no steps or tasks: '${typeof planOrName === 'string' ? planOrName : '<inline>'}'`);
      }
      session.status = 'completed';
      delete this.activeSessions[sessionId];
      return result;
    } catch (error) {
      session.status = 'failed';
      session.error = error.message;
      throw error;
    }
  }

  async _walkAst(plan, session) {
    const steps = plan.steps;
    session.stepOutputs = {};
    const outputs = session.stepOutputs;
    let index = 0;

    while (index < steps.length) {
      const step = steps[index];

      if (step.conditions && !this._evaluateConditions(step.conditions, session)) {
        index += 1;
        continue;
      }

      session.budget.count += 1;
      if (session.budget.count > this.limits.actions) {
        throw new Error(`[SYS-04] Action limit exceeded in session ${session.id}`);
      }

      if (step.action === 'DECOMPOSE' && step.subflow) {
        const childInput = this._resolveInputs(step.inputs, session);
        outputs[step.stepId] = await this.run(step.subflow, childInput, session);
      } else if (step.action === 'TERMINATE') {
        session.status = 'terminated';
        delete this.activeSessions[session.id];
        return outputs;
      } else {
        outputs[step.stepId] = await this._executeAstStep(step, session);
      }

      if (step.nextMap && outputs[step.stepId] !== undefined) {
        const nextId = step.nextMap[String(outputs[step.stepId])];
        if (nextId) {
          const targetIndex = this._findStepIndex(steps, nextId);
          if (targetIndex < 0) {
            throw new Error(`[SYS-06] nextMap target '${nextId}' not found in steps`);
          }
          index = targetIndex;
          continue;
        }
      }
      index += 1;
    }
    return outputs;
  }

  async _executeAstStep(step, session) {
    const action = step.action;
    const inputs = this._resolveInputs(step.inputs, session);
    if (this.actions && typeof this.actions.executeAction === 'function') {
      return await this.actions.executeAction(action, inputs);
    }
    return inputs;
  }

  async _walkDag(plan, session) {
    const tasks = plan.tasks || [];
    const ordered = this.topologicalSort(tasks);
    const results = {};
    results.input = session.input;

    for (const taskConfig of ordered) {
      if (taskConfig.conditions && !this._evaluateConditions(taskConfig.conditions, session)) {
        results[taskConfig.task_id] = { skipped: true };
        continue;
      }

      session.budget.count += 1;
      if (session.budget.count > this.limits.actions) {
        throw new Error(`[SYS-04] Action limit exceeded in session ${session.id}`);
      }

      if (taskConfig.action === 'DECOMPOSE' && taskConfig.subflow) {
        const childInput = this._resolveDagInputs(taskConfig, results);
        results[taskConfig.task_id] = await this.run(taskConfig.subflow, childInput, session);
        continue;
      }

      results[taskConfig.task_id] = await this._executeDagTask(taskConfig, session, results);
    }

    session.outputs = results;
    return results;
  }

  async _executeDagTask(taskConfig, session, results) {
    const TaskClass = this.taskRegistry[taskConfig.task_type];
    if (TaskClass) {
      const task = new TaskClass(taskConfig.parameters || {});
      const positional = this._resolveDagPositional(taskConfig, session.input, results);
      return await task.execute.apply(task, positional);
    }
    if (taskConfig.action && this.actions && typeof this.actions.executeAction === 'function') {
      const inputs = this._resolveDagInputs(taskConfig, results);
      return await this.actions.executeAction(taskConfig.action, inputs);
    }
    throw new Error('[SYS-06] Unknown DAG task type or action: ' + (taskConfig.task_type || taskConfig.action || '<missing>'));
  }

  _resolveDagPositional(taskConfig, inputData, results) {
    if (!taskConfig.input_sources) {
      return [];
    }
    const resolved = [];
    for (const source of taskConfig.input_sources) {
      if (source.source_type === 'data') {
        resolved.push(inputData[source.field]);
      } else if (source.source_type === 'task_output') {
        resolved.push(results[source.task_id]);
      } else if (source.source_type === 'config') {
        resolved.push(source.value);
      } else {
        resolved.push(null);
      }
    }
    return resolved;
  }

  _resolveDagInputs(taskConfig, results) {
    if (!taskConfig.inputs) {
      return {};
    }
    const resolved = {};
    for (const key in taskConfig.inputs) {
      const source = taskConfig.inputs[key];
      if (source && typeof source === 'object' && source.source_type === 'task_output') {
        resolved[key] = results[source.task_id];
      } else if (source && typeof source === 'object' && source.source_type === 'config') {
        resolved[key] = source.value;
      } else {
        resolved[key] = source;
      }
    }
    return resolved;
  }

  _resolveInputs(inputs, session) {
    if (!inputs) return {};
    const resolved = {};
    for (const key in inputs) {
      resolved[key] = this.validator ? this.validator.resolveValue(inputs[key], { input: session.input, stepOutputs: session.stepOutputs || {} }) : inputs[key];
    }
    return resolved;
  }

  _evaluateConditions(conditions, session) {
    if (!this.validator) return true;
    return this.validator.evaluateRule({ type: 'and', conditions }, { input: session.input, stepOutputs: session.stepOutputs || {}, depth: session.depth, actionCount: session.budget.count });
  }

  _findStepIndex(steps, stepId) {
    return steps.findIndex(s => s.stepId === stepId);
  }

  topologicalSort(tasks) {
    if (!tasks || tasks.length === 0) {
      return [];
    }
    const sorted = [];
    const state = {};
    const taskMap = {};
    for (const task of tasks) {
      if (!task.task_id) {
        throw new Error('[SYS-06] DAG task is missing task_id');
      }
      if (taskMap[task.task_id]) {
        throw new Error(`[SYS-06] Duplicate DAG task id '${task.task_id}'`);
      }
      taskMap[task.task_id] = task;
    }
    for (const task of tasks) {
      if (!state[task.task_id]) {
        this._visitTask(task.task_id, taskMap, state, sorted, []);
      }
    }
    return sorted;
  }

  _visitTask(taskId, taskMap, state, sorted, path) {
    const task = taskMap[taskId];
    if (!task) {
      throw new Error(`[SYS-06] DAG dependency '${taskId}' not found`);
    }
    if (state[taskId] === 'visiting') {
      throw new Error(`[SYS-06] DAG cycle detected: ${path.concat(taskId).join(' -> ')}`);
    }
    if (state[taskId] === 'visited') {
      return;
    }

    state[taskId] = 'visiting';
    if (task.dependencies) {
      for (const depId of task.dependencies) {
        this._visitTask(depId, taskMap, state, sorted, path.concat(taskId));
      }
    }
    state[taskId] = 'visited';
    sorted.push(task);
  }

  getSessions() {
    return Object.values(this.activeSessions);
  }
}

export default runner;
