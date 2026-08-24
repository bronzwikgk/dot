/**
 * @entity flow
 * @meta project: shared | file_name: code_shared_flow_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective execute declared flows of steps with conditions, branching, subflow recursion, and a hard action limit.
 * @purpose_and_problem_statement execute_workflow intent needs one engine that runs step graphs safely; ad-hoc loops had no recursion depth or action budget control.
 * @usage const engine = new FlowEngine({ actions: app, validator }); engine.registerFlow("demo", { steps: [...] }); await engine.executeFlow("demo", input);
 * @timing used by the execute_workflow pipeline stage.
 * @scope_boundaries in_scope: session lifecycle, condition gating, nextMap branching, DECOMPOSE subflows, TERMINATE, SYS-04 action limit. out_of_scope: what actions do (injected via deps.actions).
 * @dependencies validator (rule evaluation and input resolution); actions host (executeAction).
 * @keywords flow, workflow, session, subflow, branch
 * @invariants sessions track status honestly; action count never exceeds the SYS-04 ceiling; failed sessions record their error.
 * @changelog - 2026-08-24: 3.0.0: promoted ActionFlowEngine_v1_1_0 to shared class form; service-locator lookup (app.getUtil) replaced by injected deps { actions, validator }; behavior otherwise preserved exactly
 */
export class FlowEngine {
  constructor(deps = {}) {
    this.actions = deps.actions || null;
    this.validator = deps.validator || null;
    this.version = '3.0.0';
    this.registeredFlows = {};
    this.activeSessions = {};
  }

  registerFlow(name, definition) {
    this.registeredFlows[name] = definition;
  }

  async executeFlow(name, input, parentSession = null) {
    const definition = this.registeredFlows[name];
    if (!definition) {
      throw new Error(`Flow '${name}' not found`);
    }

    const depth = parentSession ? (parentSession.depth || 0) + 1 : 0;
    const sessionId = `flow_${Date.now()}_d${depth}_${Object.keys(this.activeSessions).length}`;
    const session = {
      id: sessionId,
      status: 'running',
      input: input,
      stepOutputs: {},
      currentStepIndex: 0,
      depth: depth,
      actionCount: 0,
      parent: parentSession ? parentSession.id : null
    };

    this.activeSessions[sessionId] = session;

    try {
      const steps = definition.steps;
      while (session.currentStepIndex < steps.length) {
        const step = steps[session.currentStepIndex];

        if (step.conditions && !this._evaluateConditions(step.conditions, session)) {
          session.currentStepIndex++;
          continue;
        }

        session.actionCount++;
        if (session.actionCount > 50) {
          throw new Error(`[SYS-04] Action limit exceeded in session ${session.id}`);
        }

        if (step.action === 'DECOMPOSE' && step.subflow) {
          const result = await this.executeFlow(step.subflow, this._resolveInputs(step.inputs, session), session);
          session.stepOutputs[step.stepId] = result;
        } else if (step.action === 'TERMINATE') {
          session.status = 'terminated';
          return session.stepOutputs;
        } else {
          const result = await this._executeStep(step, session);
          session.stepOutputs[step.stepId] = result;
        }

        if (step.nextMap && session.stepOutputs[step.stepId] !== undefined) {
          const nextId = step.nextMap[String(session.stepOutputs[step.stepId])];
          if (nextId) {
            session.currentStepIndex = this._findStepIndex(steps, nextId);
            continue;
          }
        }
        session.currentStepIndex++;
      }
      session.status = 'completed';
      return session.stepOutputs;
    } catch (error) {
      session.status = 'failed';
      session.error = error.message;
      throw error;
    }
  }

  async _executeStep(step, session) {
    const action = step.action;
    const inputs = this._resolveInputs(step.inputs, session);
    if (this.actions && typeof this.actions.executeAction === 'function') {
      return await this.actions.executeAction(action, inputs);
    }
    return inputs;
  }

  _resolveInputs(inputs, session) {
    if (!inputs) return {};
    const resolved = {};
    for (const key in inputs) {
      resolved[key] = this.validator ? this.validator.resolveValue(inputs[key], { input: session.input, stepOutputs: session.stepOutputs }) : inputs[key];
    }
    return resolved;
  }

  _evaluateConditions(conditions, session) {
    if (!this.validator) return true;
    return this.validator.evaluateRule({ type: 'and', conditions }, { input: session.input, stepOutputs: session.stepOutputs, depth: session.depth, actionCount: session.actionCount });
  }

  _findStepIndex(steps, stepId) {
    return steps.findIndex(s => s.stepId === stepId);
  }
}

export default FlowEngine;
