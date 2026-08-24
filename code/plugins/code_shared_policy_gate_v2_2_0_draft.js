import { inferEntityFromCommand } from "./CLI_ourActionLang_v2_2_0_ready_Gem.js";

export function evaluatePlanPolicy(plan, options = {}) {
  const actor = options.actor ?? "system";
  const mode = options.mode ?? "strict";
  const policyRows = Array.isArray(options.policyRows) ? options.policyRows : [];
  const defaultDeny = options.defaultDeny !== false;

  const decisions = [];
  const actions = Array.isArray(plan) ? plan : [];

  for (let i = 0; i < actions.length; i += 1) {
    const action = actions[i];
    const actionName = action?.command ?? "unknown_action";
    const entity = inferEntityFromCommand(actionName);

    const matched = policyRows.find((row) => {
      const actorMatch = row.actor === actor || row.actor === "*";
      const actionMatch = row.action === actionName || row.action === "*";
      const entityMatch = row.entity === entity || row.entity === "*";
      const modeAllowed = !Array.isArray(row.modes) || row.modes.length === 0 || row.modes.includes(mode);
      return actorMatch && actionMatch && entityMatch && modeAllowed;
    });

    if (matched) {
      decisions.push({
        action: actionName,
        entity,
        actor,
        allow: matched.allow === true,
        policy_rule_id: matched.id ?? "POLICY_MATCH",
        reason: matched.reason ?? (matched.allow === true ? "allowed" : "denied")
      });
      continue;
    }

    decisions.push({
      action: actionName,
      entity,
      actor,
      allow: !defaultDeny,
      policy_rule_id: "POLICY_DEFAULT",
      reason: defaultDeny ? "no_matching_policy" : "default_allow"
    });
  }

  const denied = decisions.filter((entry) => entry.allow !== true);
  return {
    pass: denied.length === 0,
    decisions,
    denied
  };
}

export default evaluatePlanPolicy;
