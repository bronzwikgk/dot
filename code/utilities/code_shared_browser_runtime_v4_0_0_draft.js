class browser_runtime {
  constructor(config = {}) {
    this.config = browser_runtime.normalize_config(config);
    this.boot_markers = [];
    this.page_errors = [];
    this.listeners = new Set();
  }

  load_definition_file(config = {}) {
    const definition = config.definition || null;
    if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
      return browser_runtime.result(false, null, ["definition is required"]);
    }
    if (!definition.mount_target_id) return browser_runtime.result(false, null, ["mount_target_id is required"]);
    return browser_runtime.result(true, definition, []);
  }

  resolve_mount_target(config = {}) {
    const doc = config.document_ref || this.config.document_ref;
    const mount_target_id = config.mount_target_id || this.config.mount_target_id;
    if (!mount_target_id) return browser_runtime.result(false, null, ["mount_target_id is required"]);
    if (!doc || !browser_runtime.is_callable(doc.getElementById)) {
      return browser_runtime.result(false, null, ["document_ref with getElementById is required"]);
    }
    const element = doc.getElementById(mount_target_id);
    if (!element) return browser_runtime.result(false, null, [`mount target '${mount_target_id}' not found`]);
    return { ok: true, data: { type: "mount_target", id: mount_target_id, element }, errors: [] };
  }

  create_app_instance(config = {}) {
    if (!browser_runtime.is_callable(config.create)) return browser_runtime.result(false, null, ["create callback is required"]);
    try {
      return browser_runtime.result(true, config.create(config), []);
    } catch (error) {
      return browser_runtime.result(false, null, [browser_runtime.error_message(error)]);
    }
  }

  resolve_default_view_frame(config = {}) {
    const frame = config.view_frame || this.config.view_frame || {};
    const data = {
      type: "view_frame",
      id: frame.id || "view_frame_default",
      mount_target_id: frame.mount_target_id || config.mount_target_id || this.config.mount_target_id,
      layout: frame.layout || "browser_shell",
      status: "ready"
    };
    if (!data.mount_target_id) return browser_runtime.result(false, null, ["view frame mount target is required"]);
    return browser_runtime.result(true, data, []);
  }

  resolve_default_listeners(config = {}) {
    const listeners = browser_runtime.normalize_list(config.listeners || this.config.listeners).map((listener, index) => ({
      type: "listener_record",
      id: listener.id || `listener_${index + 1}`,
      event_name: listener.event_name,
      selector: listener.selector || null,
      status: "ready"
    }));
    const errors = listeners.filter((listener) => !listener.event_name).map((listener) => `${listener.id} event_name is required`);
    return browser_runtime.result(errors.length === 0, listeners, errors);
  }

  attach_listener(config = {}) {
    if (!config.event_name) return browser_runtime.result(false, null, ["event_name is required"]);
    const key = `${config.selector || "window"}:${config.event_name}`;
    if (this.listeners.has(key)) return browser_runtime.result(true, { type: "listener_record", key, attached: false, reason: "already_attached" }, []);
    this.listeners.add(key);
    return browser_runtime.result(true, { type: "listener_record", key, attached: true }, []);
  }

  write_boot_marker(config = {}) {
    const status = config.status || "started";
    const marker = {
      type: "boot_marker",
      status,
      ready: status === "ready",
      failed: status === "failed",
      timestamp: this.config.clock(),
      detail: config.detail || null
    };
    this.boot_markers.push(marker);
    const target = config.window_ref || this.config.window_ref;
    if (target) target[this.config.marker_name] = marker;
    return browser_runtime.result(true, marker, []);
  }

  report_boot_error(config = {}) {
    const message = browser_runtime.error_message(config.error || config.message || "boot failed");
    return this.write_boot_marker({ status: "failed", detail: message, window_ref: config.window_ref });
  }

  wait_app_ready(config = {}) {
    const marker = config.marker || (this.config.window_ref ? this.config.window_ref[this.config.marker_name] : null);
    if (!marker) return browser_runtime.result(false, null, ["boot marker is missing"]);
    if (marker.failed) return browser_runtime.result(false, null, ["boot failed"]);
    if (marker.ready === true || marker.status === "ready") return browser_runtime.result(true, { type: "readiness_record", status: "ready" }, []);
    return browser_runtime.result(false, null, ["app is not ready"]);
  }

  record_boot_marker(config = {}) {
    return this.write_boot_marker(config);
  }

  record_page_error(config = {}) {
    const record = {
      type: "page_error",
      message: browser_runtime.error_message(config.error || config.message || "page error"),
      timestamp: this.config.clock()
    };
    this.page_errors.push(record);
    return browser_runtime.result(true, record, []);
  }

  guard_benchmark(config = {}) {
    const readiness = this.wait_app_ready(config);
    if (!readiness.ok) {
      return browser_runtime.result(false, {
        type: "benchmark_guard",
        status: "blocked",
        reason: readiness.errors.join("; ")
      }, readiness.errors);
    }
    return browser_runtime.result(true, { type: "benchmark_guard", status: "ready" }, []);
  }

  create_browser_test_report(config = {}) {
    const checks = {
      ready: Boolean(config.ready),
      page_errors: this.page_errors.length,
      browser: config.browser || "unknown",
      viewport: config.viewport || null
    };
    return browser_runtime.result(checks.ready && checks.page_errors === 0, {
      type: "browser_test_run",
      status: checks.ready && checks.page_errors === 0 ? "passed" : "failed",
      checks
    }, checks.page_errors === 0 ? [] : ["page errors captured"]);
  }

  static normalize_config(config = {}) {
    return {
      marker_name: config.marker_name || "__an_app_boot_marker__",
      mount_target_id: config.mount_target_id || "an_app_mount",
      document_ref: config.document_ref || null,
      window_ref: config.window_ref || null,
      view_frame: config.view_frame || null,
      listeners: browser_runtime.normalize_list(config.listeners),
      clock: browser_runtime.is_callable(config.clock) ? config.clock : () => new Date().toISOString()
    };
  }

  static normalize_list(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  static clone_value(value) {
    if (value === undefined) return undefined;
    if (value && value.nodeType) return { nodeType: value.nodeType, id: value.id || null };
    return JSON.parse(JSON.stringify(value));
  }

  static result(ok, data, errors) {
    return { ok, data: browser_runtime.clone_value(data), errors: errors || [] };
  }

  static error_message(error) {
    return error && error.message ? error.message : String(error);
  }

  static is_callable(value) {
    const tag = Object.prototype.toString.call(value);
    return tag === "[object Function]" || tag === "[object AsyncFunction]";
  }
}

export { browser_runtime };
export default browser_runtime;
