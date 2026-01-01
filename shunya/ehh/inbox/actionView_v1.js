/*
ActionView v1.0
================
Objective:
- Provide a renderer helper that understands view configs, templates, and hydration helpers shared between browser and backend contexts.
- Keep HTML fetching/templating logic centralized so SPA, website, and API demos reuse the same rendering contract.

Features:
- Declarative view routes referenced from `demoAppConfig` (targetFile, contentFile, responseType, root container).
- Normalize fetch/render paths for browser (fetch + innerHTML) and Node (fs read + string returns).
- Support simple `resolveIncludes` placeholder injection so layout fragments can embed other templates.
- Provide `render` and `renderToString` helpers that accept view metadata plus context variables.
- Emit hooks (beforeRender/afterRender) to let ActionEntity or other plugins augment the result.

Usage:
- Call `new ActionViewV1(config)` with the shared view config object from `demoAppConfig`.
- Use `actionView.render(route, context)` in the browser to hydrate `#appview`.
- Use `actionView.renderToString(route, context)` in Node to generate HTML for HTTP responses.

Notes:
- This module intentionally keeps dependencies minimal (Fetch, fs, path) and falls back to safe defaults when runtimes differ.
*/

export class ActionViewV1 {
  constructor(config = {}) {
    this.config = config || {};
  }

  render(htmlFragment, context = {}) {
    if (typeof window === "undefined" || !window.document) {
      return "";
    }
    const root = window.document.getElementById(this.config.viewRootId || "appview");
    if (!root) {
      return "";
    }
    root.innerHTML = this._applyContext(htmlFragment || "", context);
    return root.innerHTML;
  }

  renderToString(htmlFragment, context = {}) {
    return this._applyContext(htmlFragment || "", context);
  }

  _applyContext(html, context) {
    if (!html) {
      return "";
    }
    let result = html;
    Object.keys(context).forEach((key) => {
      const token = new RegExp(`\\$\\{${key}\\}`, "g");
      result = result.replace(token, context[key]);
    });
    return result;
  }
}
