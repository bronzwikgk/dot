/*
Overview: LocalStorage helper with per-operation console traces for browser testing.
Purpose: Offer the same synchronous key-value API plus logging so testers can trace set/get/remove/clear events inside DevTools.
Audience: Browser automation workflows and manual testers verifying LocalStorage integrations.
Problem Addressed: Lack of visibility into the LocalStorage shim when executing the HTML tester or Puppeteer scripts.
Use Cases: Persist keys, retrieve values, track removals, clear caches, and report the current key set.
Features: `setItem`, `getItem`, `removeItem`, `clear`, `key`, and `length` plus dataset metadata and roadmaps.
Benefits: Immediate console visibility with no external tooling required.
User Stories: As a QA engineer I can watch Console output for each LocalStorage helper call.
User Flow: Initialize the utility, call methods, and see logs describing the action performed.
System Components: In-memory map, console logging, and synchronous access semantics.
Edge Cases: Logs invalid key attempts and ensures the storage size is exposed after each mutation.
Test Cases: Browser tester sequences run by the HTML page or ActionPuppet before/after each step.
Configuration:
- version: v1.0.1
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
  }

  async setItem(key, value) {
    console.log('[LocalStorageUtility] setItem', key, value);
    this.storage.set(key, value);
    console.log('[LocalStorageUtility] storage size', this.storage.size);
    return this.storage.size;
  }

  async getItem(key) {
    console.log('[LocalStorageUtility] getItem', key);
    return this.storage.get(key);
  }

  async removeItem(key) {
    console.log('[LocalStorageUtility] removeItem', key);
    var result = this.storage.delete(key);
    console.log('[LocalStorageUtility] remove result', result);
    return result;
  }

  async clear() {
    console.log('[LocalStorageUtility] clear');
    this.storage.clear();
    console.log('[LocalStorageUtility] storage cleared');
    return true;
  }

  async key(index) {
    console.log('[LocalStorageUtility] key', index);
    const keys = Array.from(this.storage.keys());
    return keys[index];
  }

  get length() {
    console.log('[LocalStorageUtility] length', this.storage.size);
    return this.storage.size;
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
