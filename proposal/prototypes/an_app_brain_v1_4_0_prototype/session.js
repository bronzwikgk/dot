/**
 * session.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md (contract_019) work_an_app_brain_008 (context layers)
 *
 * Manages brain_session lifecycle.
 * Session tracks: user_input history, context refs, conversation turns,
 * boundary check results, and all intermediate records.
 */

const SESSION_STATUS = ['active', 'paused', 'completed', 'blocked'];

function start_session({ session_ref, context_ref }) {
  if (!session_ref) throw new Error('session_ref required');
  return {
    session_id: session_ref,
    context_ref: context_ref || null,
    status: 'active',
    turns: [],
    records: {
      ingestion: [],
      decomposition: [],
      parsing: [],
      reasoning: [],
      resolution: [],
      understanding: [],
      decision: [],
      composition: [],
      validation: [],
      boundary: [],
      score: [],
      improvement: [],
      evidence: []
    },
    created_at: new Date().toISOString()
  };
}

function add_turn(session, { user_input, response, boundary }) {
  session.turns.push({
    user_input,
    response,
    boundary_blocked: boundary ? boundary.blocked : false,
    timestamp: new Date().toISOString()
  });
}

function get_session_status(session) {
  return session.status;
}

function block_session(session, reason) {
  session.status = 'blocked';
  session.blocked_reason = reason;
}

module.exports = { start_session, add_turn, get_session_status, block_session, SESSION_STATUS };
