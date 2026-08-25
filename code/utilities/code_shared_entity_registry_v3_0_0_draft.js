import {
  entity_traits,
  entity_types,
  operation_names
} from "./dataset/code_shared_validation_word_datasets_v3_0_0_draft.js";
import {
  trait_operation_pairs,
  type_trait_pairs
} from "./dataset/code_shared_entity_behavior_datasets_v3_0_0_draft.js";

class entity_registry {
  constructor(config = {}) {
    this.traits = new Map(Object.entries({ ...base_traits, ...(config.traits || {}) }));
    this.types = new Map(Object.entries({ ...base_types, ...(config.types || {}) }));
  }

  register_trait(name, operations = []) {
    assert_snake(name, "trait");
    this.traits.set(name, normalize_list(operations));
    return this.describe_trait(name);
  }

  register_type(name, traits = []) {
    assert_snake(name, "type");
    for (const trait of traits) {
      if (!this.traits.has(trait)) throw new Error(`unknown trait '${trait}'`);
    }
    this.types.set(name, normalize_list(traits));
    return this.describe_type(name);
  }

  describe_trait(name) {
    return { name, operations: normalize_list(this.traits.get(name)) };
  }

  describe_type(name) {
    const traits = normalize_list(this.types.get(name));
    return { name, traits, operations: this.operations_for_type(name) };
  }

  operations_for_type(name) {
    const out = new Set();
    for (const trait of normalize_list(this.types.get(name))) {
      for (const item of normalize_list(this.traits.get(trait))) out.add(item);
    }
    return Array.from(out).sort();
  }

  has_type(name) {
    return this.types.has(name);
  }

  list_types() {
    return Array.from(this.types.keys()).sort();
  }
}

const normalize_list = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? [...value] : [value];
};

const assert_snake = (value, label) => {
  if (!/^[a-z][a-z0-9_]*$/.test(String(value || ""))) throw new Error(`${label} must use snake_case`);
};

const operations_for_trait = (trait) => {
  return trait_operation_pairs
    .filter((pair) => pair[0] === trait)
    .map((pair) => pair[1])
    .filter((operation) => operation_names.includes(operation));
};

const traits_for_type = (type) => {
  return type_trait_pairs
    .filter((pair) => pair[0] === type)
    .map((pair) => pair[1])
    .filter((trait) => entity_traits.includes(trait));
};

const base_traits = Object.fromEntries(entity_traits.map((trait) => [trait, operations_for_trait(trait)]));
const base_types = Object.fromEntries(entity_types.map((type) => [type, traits_for_type(type)]));

export { entity_registry, base_traits, base_types };
export default entity_registry;
