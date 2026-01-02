/*
Overview: LocalStorage helper that reuses browser storage when available for visible test runs.
Purpose: Allow the LocalStorage utility to push data into the real `window.localStorage` inside browsers while keeping a fallback map for Node.
Audience: Browser testers, ActionPuppet, and automation scripts that rely on the utility behaving like native storage.
Problem Addressed: Previous helper used an internal map only, so browser tests saw no storage entries despite the utility running.
Use Cases: Persist keys in the actual browser storage, read them back, remove entries, clear storage, and iterate keys.
Features: Transparent detection of `window.localStorage`, consistent logging, and support for both real and in-memory storage stores.
Benefits: Makes browser validation observable (via Application/Local Storage), keeps Node-friendly behavior, and maintains earlier logging.
User Stories: As a tester I can run the utility from a page and see my records show up in DevTools because it writes into the real storage.
User Flow: The utility detects whether it can use `window.localStorage`, performs the same setItem/getItem/removeItem/clear operations, and logs each action for diagnostics.
System Components: Browser/localStorage API, fallback Map, and console logging.
Edge Cases: Falls back to the Map when the DOM is absent, handles stringifying non-string values when needed.
Test Cases: ActionTestPuppet, ActionBrowserTest, and manual browser pages confirm each helper writes to storage and respects the dataset metadata.
Configuration:
- version: v1.0.2
- status: inprogress
- agent: KW-wonderAgent
Schema:
- type: object
- properties:
  - storage: object
  - keys: array
*/

class LocalStorageUtility {
  constructor() {
    this.storage = new Map();
    this.useWindowStorage = typeof window !== 'undefined' && window.localStorage;
  }

  _getStorage() {
    return this.useWindowStorage ? window.localStorage : this.storage;
  }

  _formatValue(value) {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }

  async setItem(key, value) {
    var storage = this._getStorage();
    var payload = this._formatValue(value);
    console.log('[LocalStorageUtility] setItem', key, payload);
    if (this.useWindowStorage) {
      storage.setItem(key, payload);
    } else {
      storage.set(key, payload);
    }
    console.log('[LocalStorageUtility] storage size', this.length);
    return this.length;
  }

  async getItem(key) {
    var storage = this._getStorage();
    console.log('[LocalStorageUtility] getItem', key);
    if (this.useWindowStorage) {
      return storage.getItem(key);
    }
    return storage.get(key);
  }

  async removeItem(key) {
    var storage = this._getStorage();
    console.log('[LocalStorageUtility] removeItem', key);
    var result;
    if (this.useWindowStorage) {
      result = storage.getItem(key) !== null;
      storage.removeItem(key);
    } else {
      result = storage.delete(key);
    }
    console.log('[LocalStorageUtility] remove result', result);
    return result;
  }

  async clear() {
    var storage = this._getStorage();
    console.log('[LocalStorageUtility] clear');
    if (this.useWindowStorage) {
      storage.clear();
    } else {
      storage.clear();
    }
    console.log('[LocalStorageUtility] storage cleared');
    return true;
  }

  async key(index) {
    console.log('[LocalStorageUtility] key', index);
    if (this.useWindowStorage) {
      return window.localStorage.key(index);
    }
    var keys = Array.from(this.storage.keys());
    return keys[index];
  }

  get length() {
    var size = this.useWindowStorage ? window.localStorage.length : this.storage.size;
    console.log('[LocalStorageUtility] length', size);
    return size;
  }
}

const DATASET_LOCALSTORAGE_METHODS_IMPLEMENTED = [
  '1setItem',
  '2getItem',
  '3removeItem',
  '4clear',
  '5key',
  '6length'
];

const DATASET_LOCALSTORAGE_METHODS_TESTED = [
  '1setItem',
  '2getItem',
  '3removeItem',
  '4clear',
  '5key',
  '6length'
];

const DATASET_LOCALSTORAGE_METHODS_PROPOSED = [
  '1setItem',
  '2getItem',
  '3removeItem',
  '4clear',
  '5key',
  '6length'
];

const DATASET_LOCALSTORAGE_METHODS_ROADMAP = [
  '7snapshot',
  '8batchSet',
  '9keyMigration',
  '10durableCache',
  '11eventStream'
];

export {
  LocalStorageUtility,
  DATASET_LOCALSTORAGE_METHODS_IMPLEMENTED,
  DATASET_LOCALSTORAGE_METHODS_TESTED,
  DATASET_LOCALSTORAGE_METHODS_PROPOSED,
  DATASET_LOCALSTORAGE_METHODS_ROADMAP
};
