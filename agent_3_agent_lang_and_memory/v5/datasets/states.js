// states.js
// All state values as 1D arrays

export const lifecycle_status = [
  "proposed", "draft", "reviewed", "approved", "ready",
  "active", "stable", "staged", "validated", "deprecated",
  "archived", "rejected", "deferred"
]

export const execution_status = [
  "received", "parsed", "matched", "needs_clarification",
  "waiting_for_approval", "approved", "running", "completed",
  "failed", "blocked", "cancelled"
]

export const validation_status = [
  "untested", "verified", "contradicted", "deprecated",
  "blocked", "needs_review"
]

export const ui_component_state = [
  "idle", "focused", "hovered", "active", "selected",
  "editing", "dragging", "resizing", "connecting", "loading",
  "empty", "dirty", "saving", "saved", "validating",
  "valid", "warning", "error", "blocked", "disabled",
  "read_only", "pending_approval", "running", "completed",
  "failed", "cancelled", "archived"
]

export const ui_lifecycle_state = [
  "unmounted", "initializing", "mounted", "rendering",
  "rendered", "updating", "updated", "destroying"
]

export const storage_state = [
  "unsaved", "autosaving", "saved", "versioned",
  "recovering", "recovered", "revert_pending", "reverted", "failed"
]

export const provider_state = [
  "unavailable", "available", "activating", "active",
  "degraded", "failing", "disabled"
]

export const audit_state = [
  "not_checked", "in_review", "supported", "weakly_supported",
  "contradicted", "accepted", "rejected", "needs_review"
]

export const memory_state = [
  "new", "linked", "consolidated", "superseded",
  "expired", "archived"
]

export const workflow_state = [
  "draft", "validated", "running", "paused",
  "waiting_for_approval", "completed", "failed",
  "cancelled", "archived"
]
