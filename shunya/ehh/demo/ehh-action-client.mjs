/*
Overview: Browser helper module that exposes ActionClient, ActionEvent, and ActionView so the v1 manifest flow can be exercised from HTML.
Purpose: Provide the UI glue to call the backend APIs, respond to buttons, and render output per the manifest’s request/response contract.
Audience: Front-end testers who want a document demonstrating the shared runtime and HTTP client flows.
Problem Addressed: There was no browser demo showing how ActionEvent/View/Client interact with the ActionApp endpoints.
Use Cases: Render a form, bind buttons, call `/api/v1/users` and `/api/v1/user-sessions`, and display the responses.
Features: Simple templating, event wiring, ActionClient fetch helper, and log area updates.
Benefits: Keeps the same class names, demonstrates ActionEvent/ActionView, verifies the HTTP service, and aids QA.
User Stories: "As a reviewer I can click ‘Create user’ and see the JSON response," and "As a tester I can inspect the logs for success/failure."
User Flow: Instantiate ActionClient, render the form, bind ActionEvent listeners, call the API, and update the view with responses.
System Components: ActionClient, ActionEvent, ActionView, form controls, log container.
Edge Cases: Handles fetch failures, missing inputs, and response errors.
Test Cases: Create user/session via buttons, observe success/failure statuses, inspect logs.
Configuration: Points at `http://localhost:4173`.
Schema: User register requires username/email/password/role; session needs tokens, expires, and status.
*/

export class ActionEvent {
  constructor() {
    this.listeners = [];
  }

  add(target, eventName, handler) {
    this.listeners.push({ target, eventName, handler });
    target.addEventListener(eventName, handler);
  }
}

export class ActionView {
  constructor(rootId) {
    this.rootId = rootId;
  }

  render(html) {
    const root = document.getElementById(this.rootId);
    if (!root) {
      return;
    }
    root.innerHTML = html;
  }

  append(text) {
    const root = document.getElementById(this.rootId);
    if (!root) {
      return;
    }
    const entry = document.createElement('p');
    entry.textContent = text;
    root.appendChild(entry);
  }
}

export class ActionClient {
  constructor(baseUrl = 'http://localhost:4173') {
    this.baseUrl = baseUrl;
  }

  request(path, method, body) {
    return fetch(`${this.baseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    }).then(response => response.json());
  }

  createUser(payload) {
    return this.request('/api/v1/users', 'POST', payload);
  }

  createSession(payload) {
    return this.request('/api/v1/user-sessions', 'POST', payload);
  }
}
