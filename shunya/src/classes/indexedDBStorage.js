// Overview: Browser storage adapter leveraging IndexedDB for entity persistence.
// Purpose: Provide asynchronous CRUD helpers backed by IndexedDB stores.
// Audience: Storage orchestrators needing offline-friendly persistence.
// Problem Addressed: Lack of structured persistence layer in browser-hosted entities.
// Use Cases: Creating, reading, updating, and deleting records in a typed object store.
// Features: Transactional access, schema-aware indexes, filter helpers.
// Benefits: Reliable persistence with query filters and error handling.
// User Stories: As an entity I persist data locally in IndexedDB.
// User Flow: Storage provider initializes, performs transactions, and resolves Promises.
// System Components: ActionEntity, CacheManager, IndexedDB browser API.
// Edge Cases: Handles unsupported environments by rejecting initialization.
// Test Cases: Validate CRUD flows, index creation, and filter application.
// Configuration: Requires dbName, storeName, version, indexes via options.
// Schema: Object store with keyPath, indexes derived from provided definitions.

class IndexedDBStorage {
  constructor(options) {
    this.options = options;
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(this.options.dbName, this.options.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(this.options.storeName)) {
          const store = db.createObjectStore(this.options.storeName, {
            keyPath: this.options.keyPath
          });

          this.options.indexes.forEach(index => {
            store.createIndex(index.name, index.keyPath, { unique: index.unique });
          });
        }
      };
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.options.storeName], 'readwrite');
      const store = transaction.objectStore(this.options.storeName);

      const request = store.add(data);

      request.onsuccess = () => resolve({ ...data, _id: request.result });
      request.onerror = () => reject(request.error);
    });
  }

  async read(query) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.options.storeName], 'readonly');
      const store = transaction.objectStore(this.options.storeName);

      if (query._id) {
        const request = store.get(query._id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } else {
        const request = store.getAll();
        request.onsuccess = () => {
          let results = request.result;

          Object.keys(query).forEach(key => {
            if (key !== '_id') {
              results = results.filter(item => item[key] === query[key]);
            }
          });

          resolve(results);
        };
        request.onerror = () => reject(request.error);
      }
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.options.storeName], 'readwrite');
      const store = transaction.objectStore(this.options.storeName);

      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const existing = getRequest.result;
        if (!existing) {
          reject(new Error('Record not found'));
          return;
        }

        const updated = { ...existing, ...data };
        const putRequest = store.put(updated);

        putRequest.onsuccess = () => resolve(updated);
        putRequest.onerror = () => reject(putRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.options.storeName], 'readwrite');
      const store = transaction.objectStore(this.options.storeName);

      const request = store.delete(id);

      request.onsuccess = () => resolve({ id, deleted: true });
      request.onerror = () => reject(request.error);
    });
  }
}

export default IndexedDBStorage;
