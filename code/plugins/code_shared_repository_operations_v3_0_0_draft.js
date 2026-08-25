import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { action_entity } from "./code_shared_action_entity_v3_1_0_draft.js";

const exec_file = promisify(execFile);

class repository_operations {
  constructor(config = {}, options = {}) {
    this.config = {
      actor: config.actor || "agent_codex_an_app",
      repository_path: config.repository_path || process.cwd(),
      read_only: config.read_only !== false,
      command_timeout_ms: config.command_timeout_ms || 5000
    };
    this.entity_store = options.entity_store || new action_entity("repository_records", {
      actor: this.config.actor,
      allow_unknown_types: true,
      allow_unknown_relationship_types: true,
      allow_unknown_operations: true
    });
  }

  async inspect_status(options = {}) {
    const repository_path = options.repository_path || this.config.repository_path;
    const output = await this.run_git(["status", "--short"], repository_path);
    const changed_files = [];
    for (const line of output.stdout.split(/\r?\n/)) {
      if (line) changed_files.push(repository_operations.parse_status_line(line));
    }
    const record = {
      id: options.id || `repository_status_${Date.now()}`,
      type: "repository_status",
      name: "repository_status",
      status: "active",
      attributes: {
        repository_path,
        changed_count: changed_files.length,
        read_only: true,
        created_by: options.actor || this.config.actor,
        created_at: new Date().toISOString()
      },
      data: { changed_files }
    };
    return { ok: true, record, changed_files };
  }

  async inspect_diff(options = {}) {
    const repository_path = options.repository_path || this.config.repository_path;
    const output = await this.run_git(["diff", "--", "."], repository_path);
    return {
      ok: true,
      record: {
        id: options.id || `repository_diff_${Date.now()}`,
        type: "repository_diff",
        name: "repository_diff",
        status: "active",
        attributes: {
          repository_path,
          read_only: true,
          created_by: options.actor || this.config.actor,
          created_at: new Date().toISOString()
        },
        data: { diff_text: output.stdout }
      }
    };
  }

  create_commit_proposal(input = {}) {
    const errors = [];
    if (!input.message) errors.push("commit message is required");
    if (!Array.isArray(input.changed_files)) errors.push("changed_files must be an array");
    if (!input.reason) errors.push("reason is required");
    if (!input.validation) errors.push("validation is required");
    const proposal = {
      id: input.id || `commit_proposal_${Date.now()}`,
      type: "commit_proposal",
      name: input.name || "commit_proposal",
      status: errors.length === 0 ? "ready" : "draft",
      attributes: {
        message: input.message || "",
        reason: input.reason || "",
        risk_notes: input.risk_notes || "",
        created_by: input.actor || this.config.actor,
        created_at: new Date().toISOString()
      },
      data: {
        changed_files: input.changed_files || [],
        validation: input.validation || null,
        tests: input.tests || [],
        skipped_tests: input.skipped_tests || []
      },
      diagnostics: repository_operations.create_diagnostics(errors)
    };
    return { ok: errors.length === 0, proposal, errors };
  }

  async persist_record(record) {
    return this.entity_store.create(record);
  }

  async run_git(args, repository_path) {
    repository_operations.assert_read_only_git_args(args);
    const result = await exec_file("git", args, {
      cwd: repository_path,
      timeout: this.config.command_timeout_ms,
      maxBuffer: 1024 * 1024 * 10
    });
    return result;
  }

  static parse_status_line(line) {
    return {
      status_code: line.slice(0, 2).trim(),
      path: line.slice(3)
    };
  }

  static create_diagnostics(errors) {
    const diagnostics = [];
    for (const error of errors) diagnostics.push({ level: "error", message: error });
    return diagnostics;
  }

  static assert_read_only_git_args(args) {
    const allowed = new Set(["status", "diff", "log", "show", "rev-parse", "branch"]);
    if (!Array.isArray(args) || args.length === 0) throw new Error("git args are required");
    if (!allowed.has(args[0])) throw new Error(`git command '${args[0]}' is not allowed in read-only repository operations`);
    for (const arg of args) {
      if (String(arg).startsWith("--output") || String(arg).startsWith("--exec")) {
        throw new Error(`git arg '${arg}' is not allowed in read-only repository operations`);
      }
    }
  }
}

export { repository_operations };
export default repository_operations;
