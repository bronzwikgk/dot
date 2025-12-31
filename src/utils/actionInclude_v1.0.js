/*
Overview: Lightweight loader for the `$include` command so tab collections can pull external fragments.
Purpose: Replace ad hoc inline logic with a reusable helper that understands configurable keywords.
Audience: Developers wiring tab buttons whose `data-command` values describe includes.
Problem Addressed: Having to duplicate regex/fetch+error code across pages and needing the keyword to be configurable.
Use Cases: Tabs declare `data-command` values such as `"$include": "includes/tasks.html"` and the loader fetches their content.
Features: Configurable keyword handling, JSON/object parsing, fetch orchestration, traceable status callbacks.
Benefits: Classic include behavior centralized, consistent error handling, pluggable keyword/syntax support.
User Stories: As a maintainer I can change the keyword to `actionInclude` and every tab still loads content; as an editor I can click a tab and automatically fetch the configured fragment.
User Flow: Instantiate `ActionInclude`, call `load(button.getAttribute('data-command'), label, preview)` on click, and let it render the HTML in the preview area.
System Components: Tab buttons, preview/article, fetch API, optional status callbacks.
Edge Cases: Missing command, invalid JSON, fetch failure, network errors.
Test Cases: Valid include renders HTML, missing keyword falls back to default message, API error reports to onStatus.
Configuration: Accepts `{ keyword?: string, onStatus?: (msg) => void }`.
Schema: { keyword: string, onStatus: function }
*/
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const ACTION_INCLUDE_CONFIG = {
  keyword: '$include',
};

export class ActionInclude {
  constructor(options = {}) {
    const configKeyword = (options.keyword || ACTION_INCLUDE_CONFIG.keyword || '$include').trim();
    this.keyword = configKeyword;
    this.regex = new RegExp(`^${escapeRegex(this.keyword)}\\s*:\\s*(.+)$`);
    this.onStatus = options.onStatus || (() => {});
  console.log(`ActionInclude initialized with keyword: "${this.keyword}"`);
  }

  parse(command = '') {
    if (!command) return null;
    try {
      var parsed = JSON.parse(command);
      if (parsed && typeof parsed === 'object' && parsed[this.keyword]) {
        return parsed[this.keyword];
      }
    } catch (error) {
      // fall back to regex
    }
    var match = this.regex.exec(command);
    return match ? match[1].trim() : null;
  }

  async load(command, label, target) {
    var path = this.parse(command);
    if (!path) {
      target.innerHTML = `<h1>${label}</h1><p>Content not available.</p>`;
      return;
    }
    this.onStatus(`Loading ${label}...`);
    try {
      var response = await fetch(path);
      if (!response.ok) {
        throw new Error('Unable to load ' + path);
      }
      var html = await response.text();
      target.innerHTML = '<h1>' + label + '</h1>' + html;
      this.onStatus(`Loaded ${label}`);
    } catch (error) {
      target.innerHTML = '<p>' + error.message + '</p>';
      this.onStatus('Error loading ' + label);
    }
  }
}

export const actionInclude = new ActionInclude();
