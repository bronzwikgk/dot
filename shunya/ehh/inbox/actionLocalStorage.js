export class ActionLocalStorage {
  constructor(namespace = "ehh_v104") {
    this.namespace = namespace;
  }

  _prefixed(key) {
    return `${this.namespace}:${key}`;
  }

  setItem(key, value) {
    const payload = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(this._prefixed(key), payload);
  }

  getItem(key) {
    const raw = window.localStorage.getItem(this._prefixed(key));
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  removeItem(key) {
    window.localStorage.removeItem(this._prefixed(key));
  }

  clear() {
    const prefix = `${this.namespace}:`;
    const toRemove = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        toRemove.push(key);
      }
    }
    toRemove.forEach((key) => window.localStorage.removeItem(key));
  }

  listKeysWithPrefix(suffix) {
    const namespacePrefix = `${this.namespace}:`;
    const matches = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(namespacePrefix)) {
        const candidate = key.slice(namespacePrefix.length);
        if (candidate.startsWith(suffix)) {
          matches.push(candidate);
        }
      }
    }
    return matches;
  }
}
