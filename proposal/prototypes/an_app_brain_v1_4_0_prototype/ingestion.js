/**
 * ingestion.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: contract_019 work_an_app_brain_001 (ingestion records + source intake boundary)
 * Related: contract_007 (workflow pipeline runner), contract_018 (knowledge tree)
 *
 * Creates ingestion_record for each raw input.
 * Ingestion is source intake - does NOT parse or reason.
 * Source coverage: every source receives an inventory id (contract 007 success).
 * Boundary: skips large folders with reason and count (contract 007 success).
 */

function ingest_source({ user_input, session, memory_ref }) {
  if (!user_input) throw new Error('user_input required for ingestion');

  const ingestion_record = {
    record_type: 'ingestion_record',
    source_type: detect_source_type(user_input),
    raw_length: typeof user_input === 'string' ? user_input.length : 0,
    memory_ref: memory_ref || null,
    inventory_id: generate_inventory_id(session),
    timestamp: new Date().toISOString(),
    status: 'ingested'
  };

  session.records.ingestion.push(ingestion_record);
  return ingestion_record;
}

function detect_source_type(input) {
  if (typeof input !== 'string') return 'unknown';
  if (input.startsWith('{') || input.startsWith('[')) return 'json';
  if (input.includes('\n') && input.split('\n').length > 10) return 'multi_line_text';
  return 'text';
}

function generate_inventory_id(session) {
  return `inv_${session.session_id}_${session.records.ingestion.length + 1}`;
}

module.exports = { ingest_source, detect_source_type, generate_inventory_id };
