/**
 * an_app_brain.js v1.4.0
 * Status: proposed
 * Owner: agent_lang_and_memory
 * Contract: shared_detail_contract_019_an_app_brain_domain_v1_0_0_proposed.md
 *
 * Coordination layer for thinking-like behavior inside An App.
 * This is NOT a duplicate parser, memory, bot, or runner.
 * Reuses: an_app_lang (parse), an_memory + knowledge_tree (memory),
 * an_bot (session), agent_improvement_cycle (score/improve),
 * workflow_pipeline_runner (stage flow).
 */

const { start_session } = require('./session.js');
const { ingest_source } = require('./ingestion.js');
const { decompose_source } = require('./decomposition.js');
const { parse_request } = require('./parsing.js');
const { reason_about_request, resolve_reference } = require('./reasoning.js');
const { understand_request, compose_response } = require('./composition.js');
const { validate_reasoning, check_boundary } = require('./validation.js');
const { run_recursion_step } = require('./recursion.js');
const { score_result, create_improvement_proposal } = require('./learning.js');
const { record_evidence, audit_brain_session } = require('./audit.js');
const { read_context, update_context } = require('./context.js');
const { decide_next_action } = require('./decision.js');
const { create_knowledge_base_record, create_knowledge_fact, create_knowledge_formula, create_knowledge_provenance } = require('./knowledge.js');
const { create_failure_record, create_pattern_record } = require('./failure_and_pattern.js');

const VERSION = 'v1.4.0';
const STATUS = 'proposed';

/**
 * Run full brain pipeline for a user input within a session.
 * Contract 019: start_brain_session -> ingest -> decompose -> parse -> reason -> resolve -> understand -> decide -> compose -> validate -> score -> audit
 * Each step produces a record stored in the session.
 */
async function brain_pipeline({ user_input, session_ref, context_ref, memory_ref, rule_set_ref, score_policy, approval_policy, boundary_policy, recursion_policy }) {
  const session = await start_session({ session_ref, context_ref });

  const ingestion = await ingest_source({ user_input, session, memory_ref });
  const decomposition = await decompose_source({ ingestion, session, recursion_policy });
  const parsed = await parse_request({ decomposition, session, rule_set_ref });
  const reasoning = await reason_about_request({ parsed, session, memory_ref, context_ref });
  const resolution = await resolve_reference({ reasoning, session, context_ref });
  const understanding = await understand_request({ resolution, session, context_ref });
  const decision = await decide_next_action({ understanding, session, approval_policy });
  const composition = await compose_response({ decision, session, reasoning });
  const validation = await validate_reasoning({ reasoning, composition, session, boundary_policy });
  const boundary = await check_boundary({ validation, session, boundary_policy });

  if (boundary.blocked) {
    return { session, boundary, response: boundary.fallback_honest };
  }

  const score = await score_result({ composition, session, score_policy });
  const improvement = await create_improvement_proposal({ score, session });
  await record_evidence({ session, ingestion, reasoning, composition });
  const audit = await audit_brain_session({ session });

  return { session, composition, score, improvement, audit };
}

module.exports = {
  brain_pipeline,
  start_session,
  ingest_source,
  decompose_source,
  parse_request,
  reason_about_request,
  resolve_reference,
  understand_request,
  decide_next_action,
  compose_response,
  validate_reasoning,
  check_boundary,
  run_recursion_step,
  score_result,
  create_improvement_proposal,
  record_evidence,
  audit_brain_session,
  read_context,
  update_context,
  create_knowledge_base_record,
  create_knowledge_fact,
  create_knowledge_formula,
  create_knowledge_provenance,
  create_failure_record,
  create_pattern_record,
  VERSION,
  STATUS
};
