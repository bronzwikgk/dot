/**
 * code_shared_guided_tour_v4_0_0_draft.js
 * Status: active
 * Owner: agent_codex_an_app
 * Contract: v4_missing_012, v4_missing_031
 *
 * Tour entity, step dataset, highlight CSS policy, and tour navigation.
 */

class guided_tour {
  constructor(config = {}) {
    this.config = { strict: config.strict !== false, ...config };
    this.tours = new Map();
    this.steps = new Map();
    this.active_tour = null;
    this.current_step = 0;
  }

  register_tour(id, { title, description } = {}) {
    this.tours.set(id, { id, title: title || id, description: description || '', created_at: new Date().toISOString() });
    return { ok: true };
  }

  add_step(tour_id, step_id, { target, title, content, position } = {}) {
    if (!this.tours.has(tour_id)) return { ok: false, errors: [`tour '${tour_id}' not found`] };
    this.steps.set(step_id, { tour_id, step_id: step_id, target: target || '', title: title || '', content: content || '', position: position || 0, highlight: true, created_at: new Date().toISOString() });
    return { ok: true };
  }

  start_tour(tour_id) {
    if (!this.tours.has(tour_id)) return { ok: false, errors: [`tour '${tour_id}' not found`] };
    this.active_tour = tour_id;
    this.current_step = 0;
    const steps = this.get_steps(tour_id);
    return { ok: true, tour: this.tours.get(tour_id), step_count: steps.length };
  }

  next_step() {
    if (!this.active_tour) return { ok: false, errors: ['no active tour'] };
    const steps = this.get_steps(this.active_tour);
    if (this.current_step >= steps.length - 1) return { ok: false, errors: ['tour complete'] };
    this.current_step++;
    return { ok: true, step: steps[this.current_step], step_index: this.current_step };
  }

  prev_step() {
    if (!this.active_tour) return { ok: false, errors: ['no active tour'] };
    if (this.current_step <= 0) return { ok: false, errors: ['at first step'] };
    this.current_step--;
    const steps = this.get_steps(this.active_tour);
    return { ok: true, step: steps[this.current_step], step_index: this.current_step };
  }

  skip_tour() {
    this.active_tour = null;
    this.current_step = 0;
    return { ok: true };
  }

  get_steps(tour_id) {
    return [...this.steps.values()].filter((s) => s.tour_id === tour_id).sort((a, b) => a.position - b.position);
  }

  get_current_step() {
    if (!this.active_tour) return null;
    const steps = this.get_steps(this.active_tour);
    return steps[this.current_step] || null;
  }

  list_tours() { return [...this.tours.values()]; }
}

export { guided_tour };
