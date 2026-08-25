// id_generator.js
// Unique indexable ID generator for all entities

class id_generator {
  constructor(config = {}) {
    this.config = { prefix: "entity", ...config };
    this.counters = new Map();
  }

  generate(type = "entity") {
    if (!this.counters.has(type)) {
      this.counters.set(type, 0);
    }
    this.counters.set(type, this.counters.get(type) + 1);
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `${type}_${timestamp}_${random}`;
  }

  generate_batch(type, count) {
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(this.generate(type));
    }
    return ids;
  }

  get_count(type) {
    return this.counters.get(type) || 0;
  }

  reset() {
    this.counters.clear();
  }
}

export default id_generator;
export { id_generator };
