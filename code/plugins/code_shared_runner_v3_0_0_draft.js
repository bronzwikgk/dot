/**
 * @entity runner
 * @meta project: shared | file_name: code_shared_runner_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective execute declared workflows in two modes: ast plans (sequential steps with conditions, jumps, termination) and dag plans (dependency-ordered tasks), nestable in both directions under one shared safety kernel.
 * @purpose_and_problem_statement execute_workflow needs one engine for both imperative flows and declarative pipelines; two separate runners could not compose and duplicated dispatch and budget logic.
 * @usage const r = new runner({ actions, validator, task_registry }); r.register_plan("main", { steps: [...] }); r.register_plan("graph", { tasks: [...] }); await r.run("main", input);
 * @timing invoked by the execute_workflow stage and by pipeline tasks that embed flows.
 * @scope_boundaries in_scope: plan registration, ast walking (conditions, next_map, terminate, decompose), dag walking (topological order, input sources, conditional skips), cross-mode nesting, shared action budget and depth cap. out_of_scope: worker implementations (registry/actions injected), parallel scheduling.
 * @dependencies validator (optional; rule gating and input resolution), actions host (optional), task registry (optional).
 * @keywords runner, workflow, dag, ast, steps, decompose, budget
 * @design_notes learned from argo workflows (steps and dag templates are siblings in one engine and nest freely in both directions) and aws step functions (named choice routing with terminal succeed and fail states plus a machine-level budget). dag conditional skips record visible skipped findings instead of vanishing; next_map jumps validate their target instead of silently rewinding.
 * @invariants sessions report status honestly; the action budget is shared across every nesting level of one root run; nesting depth is capped; unknown targets raise findings, never silent loops.
 * @changelog - 2026-08-24: 3.0.0: unified runner absorbing flow engine walking semantics and pipeline runner scheduling semantics; cross-mode decompose added; sys-04 budget made shared across nesting; depth cap added; next_map target validation added
 */
import { banned_words } from "../utilities/dataset/code_shared_validation_word_datasets_v3_0_0_draft.js";

const DEFAULT_ACTION_LIMIT = 50;
const DEFAULT_DEPTH_LIMIT = 16;

export class runner {
  constructor(deps = {}) {
    this.actions = deps.actions || null;
    this.validator = deps.validator || null;
    this.task_registry = deps.task_registry || {};
    this.entity_label = deps.entity_label || 'Plan';
    this.limits = {
      actions: (deps.limits && deps.limits.actions) || DEFAULT_ACTION_LIMIT,
      depth: (deps.limits && deps.limits.depth) || DEFAULT_DEPTH_LIMIT
    };
    this.plans = {};
    this.active_sessions = {};
    this.session_counter = 0;
  }

  register_plan(name, plan) {
    assert_no_banned_words([name]);
    assert_plan_has_no_banned_words(plan);
    const prepared = this._prepare_plan(plan);
    this._validate_plan_contract(prepared);
    this.plans[name] = prepared;
    return prepared;
  }

  _prepare_plan(plan) {
    if (!plan) return plan;
    const prepared = { ...plan };
    if (!prepared.kind) {
      prepared.kind = Array.isArray(prepared.steps) ? 'ast' : Array.isArray(prepared.tasks) ? 'dag' : 'unknown';
    }
    return prepared;
  }

  _validate_plan_contract(plan) {
    if (!plan) {
      throw new Error('[SYS-06] Plan is required');
    }
    if (plan.kind === 'ast') {
      if (!Array.isArray(plan.steps)) {
        throw new Error('[SYS-06] AST plan steps must be an array');
      }
      for (let index = 0; index < plan.steps.length; index += 1) {
        const step = plan.steps[index];
        if (!step || typeof step !== 'object') {
          throw new Error(`[SYS-06] AST step at index ${index} is invalid`);
        }
        if (!step.step_id) {
          throw new Error(`[SYS-06] AST step at index ${index} is missing step_id`);
        }
      }
      return;
    }
    if (plan.kind === 'dag') {
      if (!Array.isArray(plan.tasks)) {
        throw new Error('[SYS-06] DAG plan tasks must be an array');
      }
      this.topological_sort(plan.tasks);
      return;
    }
    throw new Error('[SYS-06] Plan kind must be ast or dag');
  }

  async run(plan_or_name, input = {}, parent_session = null) {
    if (typeof plan_or_name === 'string') assert_no_banned_words([plan_or_name]);
    const plan = typeof plan_or_name === 'string' ? this.plans[plan_or_name] : this._prepare_plan(plan_or_name);
    if (!plan) {
      throw new Error(`${this.entity_label} '${plan_or_name}' not found`);
    }

    const depth = parent_session ? (parent_session.depth || 0) + 1 : 0;
    if (depth > this.limits.depth) {
      throw new Error(`[SYS-05] Nesting depth exceeded (${this.limits.depth}) in ${this.entity_label.toLowerCase()} '${typeof plan_or_name === 'string' ? plan_or_name : '<inline>'}'`);
    }

    this.session_counter += 1;
    const session_id = `run_${Date.now()}_${this.session_counter}_d${depth}`;
    const session = {
      id: session_id,
      status: 'running',
      kind: plan.kind,
      input,
      outputs: {},
      step_outputs: null,
      current_step_index: 0,
      depth,
      parent: parent_session ? parent_session.id : null,
      budget: parent_session ? parent_session.budget : { count: 0 }
    };

    this.active_sessions[session_id] = session;

    try {
      let result;
      if (plan.kind === 'dag') {
        result = await this._walk_dag(plan, session);
      } else if (plan.kind === 'ast') {
        result = await this._walk_ast(plan, session);
      } else {
        throw new Error(`[SYS-06] Plan has no steps or tasks: '${typeof plan_or_name === 'string' ? plan_or_name : '<inline>'}'`);
      }
      if (session.status === 'running') session.status = 'completed';
      delete this.active_sessions[session_id];
      return result;
    } catch (error) {
      session.status = 'failed';
      session.error = error.message;
      throw error;
    }
  }

  async _walk_ast(plan, session) {
    const steps = Array.isArray(plan.steps) ? plan.steps : [];
    session.step_outputs = {};
    const outputs = session.step_outputs;
    let index = 0;

    while (index < steps.length) {
      const step = steps[index];
      if (!step || typeof step !== 'object') {
        throw new Error(`[SYS-06] AST step at index ${index} is invalid`);
      }
      if (!step.step_id) {
        throw new Error(`[SYS-06] AST step at index ${index} is missing step_id`);
      }

      if (step.conditions && !this._evaluate_conditions(step.conditions, session)) {
        index += 1;
        continue;
      }

      session.budget.count += 1;
      if (session.budget.count > this.limits.actions) {
        throw new Error(`[SYS-04] Action limit exceeded in session ${session.id}`);
      }

      if (step.action === 'DECOMPOSE' && step.subflow) {
        const child_input = this._resolve_inputs(step.inputs, session);
        outputs[step.step_id] = await this.run(step.subflow, child_input, session);
      } else if (step.action === 'TERMINATE') {
        session.status = 'terminated';
        delete this.active_sessions[session.id];
        return outputs;
      } else {
        outputs[step.step_id] = await this._execute_ast_step(step, session);
      }

      if (step.next_map) {
        const output_key = Object.prototype.hasOwnProperty.call(outputs, step.step_id) ? String(outputs[step.step_id]) : "undefined";
        const next_id = step.next_map[output_key];
        if (next_id) {
          const target_index = this._find_step_index(steps, next_id);
          if (target_index < 0) {
            throw new Error(`[SYS-06] next_map target '${next_id}' not found in steps`);
          }
          index = target_index;
          continue;
        }
      }
      index += 1;
    }
    return outputs;
  }

  async _execute_ast_step(step, session) {
    const action = step.action;
    assert_no_banned_words([action, step.step_id]);
    const inputs = this._resolve_inputs(step.inputs, session);
    if (this.actions && typeof this.actions.execute_action === 'function') {
      return await this.actions.execute_action(action, inputs);
    }
    return inputs;
  }

  async _walk_dag(plan, session) {
    const tasks = plan.tasks || [];
    const ordered = this.topological_sort(tasks);
    const results = {};
    results.input = session.input;

    for (const task_config of ordered) {
      if (task_config.conditions && !this._evaluate_conditions(task_config.conditions, session)) {
        results[task_config.task_id] = { skipped: true };
        continue;
      }

      session.budget.count += 1;
      if (session.budget.count > this.limits.actions) {
        throw new Error(`[SYS-04] Action limit exceeded in session ${session.id}`);
      }

      if (task_config.action === 'DECOMPOSE' && task_config.subflow) {
        const child_input = this._resolve_dag_inputs(task_config, results);
        results[task_config.task_id] = await this.run(task_config.subflow, child_input, session);
        continue;
      }

      results[task_config.task_id] = await this._execute_dag_task(task_config, session, results);
    }

    session.outputs = results;
    return results;
  }

  async _execute_dag_task(task_config, session, results) {
    assert_no_banned_words([task_config.task_id, task_config.task_type, task_config.action]);
    const task_class = this.task_registry[task_config.task_type];
    if (task_class) {
      const task = new task_class(task_config.parameters || {});
      const positional = this._resolve_dag_positional(task_config, session.input, results);
      return await task.execute.apply(task, positional);
    }
    if (task_config.action && this.actions && typeof this.actions.execute_action === 'function') {
      const inputs = this._resolve_dag_inputs(task_config, results);
      return await this.actions.execute_action(task_config.action, inputs);
    }
    throw new Error('[SYS-06] Unknown DAG task type or action: ' + (task_config.task_type || task_config.action || '<missing>'));
  }

  _resolve_dag_positional(task_config, input_data, results) {
    if (!task_config.input_sources) {
      return [];
    }
    const resolved = [];
    for (const source of task_config.input_sources) {
      if (!source || typeof source !== 'object') {
        resolved.push(null);
        continue;
      }
      if (source.source_type === 'data') {
        resolved.push(input_data[source.field]);
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

  _resolve_dag_inputs(task_config, results) {
    if (!task_config.inputs) {
      return {};
    }
    const resolved = {};
    for (const key in task_config.inputs) {
      const source = task_config.inputs[key];
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

  _resolve_inputs(inputs, session) {
    if (!inputs || typeof inputs !== "object") return {};
    const resolved = {};
    for (const key in inputs) {
      resolved[key] = resolve_input_value(inputs[key], { input: session.input, step_outputs: session.step_outputs || {} }, this.validator);
    }
    return resolved;
  }

  _evaluate_conditions(conditions, session) {
    if (!this.validator) return true;
    return this.validator.evaluate_rule({ type: 'and', conditions }, { input: session.input, step_outputs: session.step_outputs || {}, depth: session.depth, action_count: session.budget.count });
  }

  _find_step_index(steps, step_id) {
    return steps.findIndex(s => s && s.step_id === step_id);
  }

  topological_sort(tasks) {
    if (!tasks || tasks.length === 0) {
      return [];
    }
    const sorted = [];
    const state = {};
    const task_map = {};
    for (const task of tasks) {
      if (!task || typeof task !== 'object') {
        throw new Error('[SYS-06] DAG task is invalid');
      }
      if (!task.task_id) {
        throw new Error('[SYS-06] DAG task is missing task_id');
      }
      if (task_map[task.task_id]) {
        throw new Error(`[SYS-06] Duplicate DAG task id '${task.task_id}'`);
      }
      task_map[task.task_id] = task;
    }
    for (const task of tasks) {
      if (!state[task.task_id]) {
        this._visit_task(task.task_id, task_map, state, sorted, []);
      }
    }
    return sorted;
  }

  _visit_task(task_id, task_map, state, sorted, path) {
    const task = task_map[task_id];
    if (!task) {
      throw new Error(`[SYS-06] DAG dependency '${task_id}' not found`);
    }
    if (state[task_id] === 'visiting') {
      throw new Error(`[SYS-06] DAG cycle detected: ${path.concat(task_id).join(' -> ')}`);
    }
    if (state[task_id] === 'visited') {
      return;
    }

    state[task_id] = 'visiting';
    if (task.dependencies) {
      for (const dep_id of task.dependencies) {
        this._visit_task(dep_id, task_map, state, sorted, path.concat(task_id));
      }
    }
    state[task_id] = 'visited';
    sorted.push(task);
  }

  get_sessions() {
    return Object.values(this.active_sessions);
  }
}

function assert_plan_has_no_banned_words(plan) {
  if (!plan) return;
  const values = [];
  for (const step of plan.steps || []) {
    if (!step || typeof step !== "object") continue;
    values.push(step.step_id, step.action, step.subflow);
  }
  for (const task of plan.tasks || []) {
    if (!task || typeof task !== "object") continue;
    values.push(task.task_id, task.task_type, task.action, task.subflow, ...(task.dependencies || []));
  }
  assert_no_banned_words(values);
}

function assert_no_banned_words(values) {
  const found = (values || []).filter((value) => {
    const normalized = String(value || "").toLowerCase();
    const parts = normalized.split(/[^a-z0-9]+/).filter(Boolean);
    return banned_words.some((word) => normalized === word || parts.includes(word));
  });
  if (found.length > 0) throw new Error("[SYS-06] banned vocabulary in runner plan: " + found.join(", "));
}

function resolve_input_value(value, context, validator) {
  if (validator && typeof validator.resolve_value === "function") return validator.resolve_value(value, context);
  if (typeof value !== "string") return value;
  if (!value.startsWith("{{") || !value.endsWith("}}")) return value;
  const clean_path = value.slice(2, -2).trim();
  return clean_path.split(".").reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[part];
  }, context);
}

export default runner;
