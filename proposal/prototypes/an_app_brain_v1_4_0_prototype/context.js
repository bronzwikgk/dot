/**
 * context.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: contract_019 work_an_app_brain_008 (context layers and boundary checks)
 * Related: contract_011 (an_bot_agent), contract_012 (an_memory_reasoning)
 *
 * Manages 7-layer context model:
 * System, Organization, Project, Domain, Session, Conversation, Entity.
 * Context resolution declares which layer used (contract 019 validation).
 */

const CONTEXT_LAYERS = ['system', 'organization', 'project', 'domain', 'session', 'conversation', 'entity'];

function read_context({ session, layer, ref }) {
  if (!layer || !CONTEXT_LAYERS.includes(layer)) {
    throw new Error('valid context layer required: ' + CONTEXT_LAYERS.join(', '));
  }

  const context_record = {
    record_type: 'context_record',
    layer,
    ref: ref || null,
    session_id: session.session_id,
    action: 'read',
    timestamp: new Date().toISOString()
  };

  return context_record;
}

function update_context({ session, layer, ref, data }) {
  if (!layer || !CONTEXT_LAYERS.includes(layer)) {
    throw new Error('valid context layer required: ' + CONTEXT_LAYERS.join(', '));
  }

  const context_record = {
    record_type: 'context_record',
    layer,
    ref: ref || null,
    data: data || null,
    session_id: session.session_id,
    action: 'update',
    timestamp: new Date().toISOString()
  };

  return context_record;
}

module.exports = { read_context, update_context, CONTEXT_LAYERS };
