import { gui_action_names } from "./dataset/code_shared_ui_word_datasets_v3_0_0_draft.js";

class cell_command_language {
  constructor(config = {}) {
    this.config = cell_command_language.normalize_config(config);
  }

  parse_command_text(config = {}) {
    const text = String(config.text || "").trim();
    if (!text) return cell_command_language.result(false, null, ["text is required"]);
    const intent = this.classify_command_intent({ text });
    const slots = this.extract_command_slots({ text, intent: intent.data });
    const plan = this.create_execution_plan({ text, intent: intent.data, slots: slots.data });
    return cell_command_language.result(plan.ok, {
      type: "command_parse",
      text,
      intent: intent.data,
      slots: slots.data,
      plan: plan.data,
      confidence: intent.data.confidence,
      evidence: intent.data.evidence
    }, plan.errors);
  }

  classify_command_intent(config = {}) {
    const text = String(config.text || "").toLowerCase();
    const candidates = [];
    if (text.includes("run all")) candidates.push(["run_all", 0.95, "contains run all"]);
    if (text.includes("run") || text.includes("execute")) candidates.push(["run_cell", 0.82, "contains run or execute"]);
    if (text.includes("search") || text.includes("find")) candidates.push(["search_next", 0.72, "contains search or find"]);
    if (text.includes("clear")) candidates.push(["blur_editor", 0.68, "contains clear"]);
    if (text.includes("markdown")) candidates.push(["run_cell", 0.74, "contains markdown"]);
    if (text.includes("code")) candidates.push(["run_cell", 0.74, "contains code"]);
    if (text.includes("note") || text.includes("natural")) candidates.push(["run_cell", 0.7, "contains note or natural"]);
    const approved = cell_command_language.merge_candidates(candidates.filter((candidate) => this.config.approved_actions.includes(candidate[0])));
    if (approved.length === 0) {
      return cell_command_language.result(true, {
        type: "intent_record",
        intent: "clarify",
        command_name: null,
        confidence: 0.2,
        evidence: ["no approved command matched"],
        needs_clarification: true
      }, []);
    }
    approved.sort((a, b) => b[1] - a[1]);
    const top = approved[0];
    const second = approved[1];
    const ambiguous = Boolean(second && top[1] - second[1] < 0.12);
    return cell_command_language.result(true, {
      type: "intent_record",
      intent: ambiguous ? "clarify" : top[0],
      command_name: ambiguous ? null : top[0],
      confidence: ambiguous ? 0.45 : top[1],
      evidence: approved.map((candidate) => candidate[2]),
      needs_clarification: ambiguous
    }, []);
  }

  extract_command_slots(config = {}) {
    const text = String(config.text || "");
    const lowered = text.toLowerCase();
    const slots = [];
    let cell_type = "natural_language";
    if (lowered.includes("markdown")) cell_type = "markdown";
    if (lowered.includes("code")) cell_type = "code";
    slots.push({ type: "slot_record", name: "cell_type", value: cell_type });
    slots.push({ type: "slot_record", name: "content", value: text });
    return cell_command_language.result(true, slots, []);
  }

  create_execution_plan(config = {}) {
    const intent = config.intent || {};
    if (intent.needs_clarification) {
      return cell_command_language.result(true, {
        type: "execution_plan",
        status: "clarification_required",
        command_name: null,
        steps: []
      }, []);
    }
    const command_name = intent.command_name;
    if (!this.config.approved_actions.includes(command_name)) {
      return cell_command_language.result(false, null, [`command '${command_name}' is not approved`]);
    }
    const plan = {
      type: "execution_plan",
      status: "ready",
      command_name,
      cell_language_record: {
        type: "cell_language_record",
        cell_type: cell_command_language.slot_value(config.slots, "cell_type") || "natural_language"
      },
      steps: [{ step_id: `${command_name}_step`, action: command_name }]
    };
    return this.validate_execution_plan({ plan });
  }

  validate_execution_plan(config = {}) {
    const plan = config.plan || {};
    const errors = [];
    if (plan.status === "clarification_required") return cell_command_language.result(true, plan, []);
    if (plan.type !== "execution_plan") errors.push("plan type must be execution_plan");
    if (!this.config.approved_actions.includes(plan.command_name)) errors.push("plan command is not approved");
    if (!Array.isArray(plan.steps) || plan.steps.length === 0) errors.push("plan steps are required");
    return cell_command_language.result(errors.length === 0, errors.length === 0 ? plan : null, errors);
  }

  static slot_value(slots = [], name) {
    for (const slot of slots || []) {
      if (slot.name === name) return slot.value;
    }
    return null;
  }

  static merge_candidates(candidates = []) {
    const merged = new Map();
    for (const candidate of candidates) {
      const existing = merged.get(candidate[0]);
      if (!existing) {
        merged.set(candidate[0], [candidate[0], candidate[1], candidate[2]]);
        continue;
      }
      existing[1] = Math.min(0.99, Math.max(existing[1], candidate[1]) + 0.03);
      existing[2] = `${existing[2]}; ${candidate[2]}`;
    }
    return Array.from(merged.values());
  }

  static normalize_config(config = {}) {
    return {
      approved_actions: Array.isArray(config.approved_actions) ? config.approved_actions : gui_action_names
    };
  }

  static result(ok, data, errors) {
    return { ok, data: cell_command_language.clone_value(data), errors: errors || [] };
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }
}

export { cell_command_language };
export default cell_command_language;
