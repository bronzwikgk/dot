/**
 * workflow_system_v1_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Stage, step, task, condition, approval gate, rollback, audit, and pipeline execution.
 */

import action_entity from "./action_entity_v5_0_0.js";

class workflow_system {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.entities = new action_entity({ actor: this.config.actor });
  }

  create_workflow(config = {}) {
    return this.entities.create("workflow", {
      name: config.name || "untitled_workflow",
      data: { stages: config.stages || [], status: "draft" }
    });
  }

  create_stage(workflow_id, config = {}) {
    return this.entities.create("stage", {
      name: config.name || "untitled_stage",
      data: { workflow_id, order: config.order || 0, status: "draft" }
    });
  }

  run_workflow(workflow_id) {
    const workflow = this.entities.read(workflow_id);
    if (!workflow) return null;
    this.entities.update(workflow_id, { data: { ...workflow.data, status: "running" } });
    return workflow;
  }

  complete_workflow(workflow_id) {
    this.entities.update(workflow_id, { data: { status: "completed" } });
  }

  pause_workflow(workflow_id) {
    this.entities.update(workflow_id, { data: { status: "paused" } });
  }
}

export default workflow_system;
export { workflow_system };
