import crypto from "node:crypto";
import path from "node:path";
import { ourActionLang_Tokenizer_v2_2_0_ready_Gem } from "../utilities/code_shared_tokenizer_v2_2_0_draft.js";
import { ourActionLang_Parser_v2_2_0_ready_Gem } from "../utilities/code_shared_parser_v2_2_0_draft.js";
import { ourActionLang_Compiler_v2_2_0_ready_Gem } from "../utilities/code_shared_compiler_v2_2_0_draft.js";
import { ourActionLang_Resolver_v2_2_0_ready_Gem } from "../utilities/code_shared_resolver_v2_2_0_draft.js";
import { ourActionLang_ValidationPipeline_v2_2_0_ready_Gem } from "../utility/ValidationPipeline_ourActionLang_v2_2_0_ready_Gem.js";
import { ourActionLang_Transformer_v2_2_0_ready_Gem } from "../utilities/code_shared_transformer_v2_2_0_draft.js";
import { ourActionLang_Config_v2_2_0_ready_Gem } from "../../config/Config_ourActionLang_v2_2_0_ready_Gem.js";

export class ourActionLang_Runtime_v2_2_0_ready_Gem {
  constructor(options = {}) {
    this.config = options.config ?? ourActionLang_Config_v2_2_0_ready_Gem;
    this.tokenizer =
      options.tokenizer ?? new ourActionLang_Tokenizer_v2_2_0_ready_Gem(this.config);
    this.parser =
      options.parser ?? new ourActionLang_Parser_v2_2_0_ready_Gem(this.config);
    this.compiler =
      options.compiler ?? new ourActionLang_Compiler_v2_2_0_ready_Gem(this.config);
    this.resolver =
      options.resolver ?? new ourActionLang_Resolver_v2_2_0_ready_Gem(this.config);
    this.validationPipeline =
      options.validationPipeline ??
      new ourActionLang_ValidationPipeline_v2_2_0_ready_Gem(this.config);
    this.transformer =
      options.transformer ?? new ourActionLang_Transformer_v2_2_0_ready_Gem(this.config);
    this.backend = options.backend ?? null;
  }

  static async createWithDefaultBackend(options = {}) {
    const storagePath =
      options.storagePath ??
      path.resolve(process.cwd(), "logs", "entity_records_ourActionLang.json");

    const [{ ActionFlowEngine }, { ActionEntity }, { ActionValidator }] = await Promise.all([
      import("../../../code/plugin/v3_ActionFlowEngine_v1_0_0_ready_shunya/ActionFlowEngine_v1_0_0_ready_shunya.js"),
      import("../../../code/plugin/v3_ActionEntity_v1_0_0_ready_shunya/ActionEntity_v1_0_0_ready_shunya.js"),
      import("../../../code/plugin/v3_ActionValidator_v1_0_0_ready_shunya/ActionValidator_v1_0_0_ready_shunya.js")
    ]);

    let puppet = null;
    if (options.enablePuppet) {
      const { ActionPuppetNoDriver } = await import(
        "../../../code/plugin/v3_ActionPuppet_NoDriver_v1_0_0_ready_shunya/ActionPuppet_NoDriver_v1_0_0_ready_shunya.js"
      );
      puppet = new ActionPuppetNoDriver(options.puppetOptions ?? {});
    }

    const domainConfig = {
      defaults: { storagePath },
      datasets: {
        entities: ["note"],
        requirements: []
      }
    };

    const entity = new ActionEntity(domainConfig);
    const validator = new ActionValidator(domainConfig);
    const flowEngine = new ActionFlowEngine({
      entity,
      validator,
      config: options.flowConfig ?? {},
      puppet
    });

    const backend = {
      async execute(command, payload) {
        return flowEngine.runFlow(command, payload);
      }
    };

    return new ourActionLang_Runtime_v2_2_0_ready_Gem({ ...options, backend });
  }

  tokenize(input) {
    return this.tokenizer.tokenize(input);
  }

  parse(tokens) {
    return this.parser.parse(tokens);
  }

  compile(ast) {
    return this.compiler.compile(ast);
  }

  async process(input, options = {}) {
    const execute = options.execute === true;
    const continueOnError = options.continueOnError === true;
    const mode = options.mode === "strict" ? "strict" : "tolerant";
    const rollbackOnError =
      options.rollbackOnError === true || (mode === "strict" && options.rollbackOnError !== false);
    const trace_id = options.traceId ?? this.generateTraceId();
    const inputEnvelope = this.buildInputEnvelope(input, options, trace_id);
    const stageDurationsMs = {};

    const directiveParseStartedAt = Date.now();
    const directiveAst = this.parser.parseDirectives(inputEnvelope.rawInput);
    stageDurationsMs.directive_parse = Date.now() - directiveParseStartedAt;

    let tokens = [];
    let ast;
    let parseMode;

    if (directiveAst.children.length > 0) {
      ast = directiveAst;
      parseMode = "directive";
    } else {
      const tokenizeStartedAt = Date.now();
      tokens = this.tokenize(inputEnvelope.normalizedInput);
      stageDurationsMs.tokenize = Date.now() - tokenizeStartedAt;

      const parseStartedAt = Date.now();
      ast = this.parse(tokens);
      stageDurationsMs.parse = Date.now() - parseStartedAt;
      parseMode = "intent";
    }

    this.attachAstSourceMetadata(ast, inputEnvelope);

    const transformStartedAt = Date.now();
    const transforms = this.transformer.transform(ast);
    stageDurationsMs.transform = Date.now() - transformStartedAt;

    const resolveStartedAt = Date.now();
    const resolveReport = this.resolver.resolve(ast);
    stageDurationsMs.resolve = Date.now() - resolveStartedAt;
    const warnings = [...resolveReport.warnings];
    const ambiguities = [...resolveReport.ambiguities];
    const recovery_actions = [];

    if (resolveReport.graph.hasCycle) {
      const cycleWarning = {
        stage: "resolve",
        code: "DEPENDENCY_CYCLE",
        message: "Cycle detected in dependency graph",
        cyclePaths: resolveReport.graph.cyclePaths
      };
      if (mode === "strict") {
        resolveReport.errors.push(cycleWarning);
      } else {
        warnings.push(cycleWarning);
        recovery_actions.push({
          stage: "resolve",
          action: "drop_cycle_edges",
          message: "Proceeding in tolerant mode; cycle noted for remediation"
        });
      }
    }

    const compileStartedAt = Date.now();
    const plan = this.compile(ast);
    stageDurationsMs.compile = Date.now() - compileStartedAt;

    const validateStartedAt = Date.now();
    const validation = this.validationPipeline.validate(ast, plan);
    stageDurationsMs.validate = Date.now() - validateStartedAt;

    const result = {
      input,
      trace_id,
      mode,
      parseMode,
      inputEnvelope,
      tokens,
      ast,
      transforms,
      resolve: resolveReport,
      validation,
      plan,
      executed: false,
      backendAvailable: Boolean(this.backend),
      success: validation.pass && resolveReport.errors.length === 0,
      results: [],
      errors: [...resolveReport.errors, ...validation.errors],
      warnings: [...warnings, ...validation.warnings],
      ambiguities,
      recovery_actions,
      metrics: {
        stage_durations_ms: stageDurationsMs,
        counters: {
          token_count: tokens.length,
          ast_nodes: Array.isArray(ast.children) ? ast.children.length : 0,
          plan_actions: plan.length
        }
      }
    };

    if (mode === "strict" && result.errors.length > 0) {
      result.success = false;
      result.metrics.counters.error_count = result.errors.length;
      result.metrics.counters.warning_count = result.warnings.length;
      return result;
    }

    if (mode === "tolerant" && result.errors.length > 0) {
      recovery_actions.push({
        stage: "validate",
        action: "continue_with_partial_plan",
        message: "Continuing with available plan in tolerant mode"
      });
    }

    if (!execute) {
      result.metrics.counters.error_count = result.errors.length;
      result.metrics.counters.warning_count = result.warnings.length;
      return result;
    }

    if (!this.backend || typeof this.backend.execute !== "function") {
      result.success = false;
      result.errors.push({
        stage: "execute",
        command: null,
        message: "Execution backend is not configured"
      });
      result.metrics.counters.error_count = result.errors.length;
      result.metrics.counters.warning_count = result.warnings.length;
      return result;
    }

    result.executed = true;
    const executionStartedAt = Date.now();
    const executedActions = [];

    for (const action of plan) {
      try {
        const output = await this.backend.execute(action.command, action.payload, action);
        executedActions.push(action);
        result.results.push({
          command: action.command,
          payload: action.payload,
          output
        });
      } catch (error) {
        result.success = false;
        result.errors.push({
          stage: "execute",
          command: action.command,
          message: error instanceof Error ? error.message : String(error)
        });

        if (rollbackOnError) {
          await this.tryRollback(result, executedActions, {
            failedCommand: action.command,
            message: error instanceof Error ? error.message : String(error)
          });
        }
        if (!continueOnError) break;
      }
    }

    stageDurationsMs.execute = Date.now() - executionStartedAt;
    result.metrics.counters.error_count = result.errors.length;
    result.metrics.counters.warning_count = result.warnings.length;

    return result;
  }

  buildInputEnvelope(input, options, traceId) {
    const rawInput = typeof input === "string" ? input : "";
    return {
      run_id: options.runId ?? traceId,
      trace_id: traceId,
      source_type: options.sourceType ?? "text",
      source_path: options.sourcePath ?? null,
      rawInput,
      normalizedInput: rawInput.trim()
    };
  }

  attachAstSourceMetadata(ast, inputEnvelope) {
    if (!ast || typeof ast !== "object") {
      return;
    }
    ast.meta = {
      ...(ast.meta ?? {}),
      inputSource: {
        type: inputEnvelope.source_type,
        path: inputEnvelope.source_path,
        run_id: inputEnvelope.run_id,
        trace_id: inputEnvelope.trace_id
      }
    };
  }

  generateTraceId() {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `trace_${Date.now()}`;
  }

  async tryRollback(result, executedActions, errorContext) {
    if (!this.backend || typeof this.backend.rollback !== "function") {
      result.recovery_actions.push({
        stage: "rollback",
        action: "skipped",
        reason: "No backend rollback handler configured",
        context: errorContext
      });
      return;
    }

    try {
      const rollbackOutput = await this.backend.rollback({
        trace_id: result.trace_id,
        mode: result.mode,
        executedActions,
        errorContext
      });
      result.recovery_actions.push({
        stage: "rollback",
        action: "executed",
        result: rollbackOutput ?? { ok: true }
      });
    } catch (rollbackError) {
      result.errors.push({
        stage: "rollback",
        code: "ROLLBACK_FAILED",
        message: rollbackError instanceof Error ? rollbackError.message : String(rollbackError)
      });
      result.recovery_actions.push({
        stage: "rollback",
        action: "failed",
        message: rollbackError instanceof Error ? rollbackError.message : String(rollbackError)
      });
    }
  }
}

export default ourActionLang_Runtime_v2_2_0_ready_Gem;
