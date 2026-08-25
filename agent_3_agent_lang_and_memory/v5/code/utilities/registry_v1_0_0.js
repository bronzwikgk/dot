// registry.js
// Entity type registry

class registry {
  constructor(config = {}) {
    this.config = config;
    this.types = new Map();
    this.instances = new Map();
  }

  register_type(type_name, definition) {
    this.types.set(type_name, definition);
    return { ok: true, type: type_name };
  }

  get_type(type_name) {
    return this.types.get(type_name) || null;
  }

  list_types() {
    return Array.from(this.types.keys());
  }

  register_instance(id, entity) {
    this.instances.set(id, entity);
    return { ok: true, id };
  }

  get_instance(id) {
    return this.instances.get(id) || null;
  }

  list_instances(type) {
    if (!type) return Array.from(this.instances.values());
    return Array.from(this.instances.values()).filter(e => e.type === type);
  }

  remove_instance(id) {
    return this.instances.delete(id);
  }
}

export default registry;
export { registry };
