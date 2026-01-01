/**
 * Minimal ActionEventV2 class for bootstrapping listener registration.
 * This version simply tracks listeners, binds them to targets, and exposes
 * a changelog for auditing.
 *
 * Change log:
 * - v0.1.0: initial implementation with addListener/bind.
 */
export class ActionEventV2 {
  constructor() {
    this.listeners = [];
    this.changeLog = [];
  }

  addListener(target, eventName, handler) {
    const listener = { target, eventName, handler };
    this.listeners.push(listener);
    this.changeLog.push(
      `[${new Date().toISOString()}] added listener ${eventName} on ${this._describeTarget(
        target
      )}`
    );
    return listener;
  }

  bind() {
    this.listeners.forEach(({ target, eventName, handler }) => {
      const resolved = this._resolveTarget(target);
      if (resolved && typeof resolved.addEventListener === "function") {
        resolved.addEventListener(eventName, handler);
      }
    });
    this.changeLog.push(
      `[${new Date().toISOString()}] bound ${this.listeners.length} listeners`
    );
  }

  _resolveTarget(name) {
    if (name === "window" && typeof window !== "undefined") {
      return window;
    }
    if (name === "document" && typeof document !== "undefined") {
      return document;
    }
    return null;
  }

  _describeTarget(target) {
    return typeof target === "string" ? target : "custom";
  }
}
