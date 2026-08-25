/**
 * an_memory_v1_0_0.js
 * Status: proposed
 * Owner: agent_3_agent_lang_and_memory
 * 
 * Governed memory, source trust, evidence, conflict, recall, consolidation, and forgetting.
 */

import action_entity from "./action_entity_v5_0_0.js";

class an_memory {
  constructor(config = {}) {
    this.config = { actor: "system", ...config };
    this.entities = new action_entity({ actor: this.config.actor });
  }

  store_evidence(data) {
    return this.entities.create("memory_record", {
      name: `evidence_${Date.now()}`,
      data: { ...data, status: "linked" }
    });
  }

  recall(query) {
    return this.entities.search(query, "memory_record");
  }

  link(memory_id, entity_id) {
    const memory = this.entities.read(memory_id);
    if (!memory) return null;
    this.entities.update(memory_id, {
      data: { ...memory.data, linked_to: entity_id, status: "linked" }
    });
    return memory;
  }

  consolidate(memory_ids) {
    return this.entities.create("memory_record", {
      name: `consolidated_${Date.now()}`,
      data: { source_ids: memory_ids, status: "consolidated" }
    });
  }

  forget(memory_id) {
    this.entities.update(memory_id, { data: { status: "expired" } });
  }
}

export default an_memory;
export { an_memory };
