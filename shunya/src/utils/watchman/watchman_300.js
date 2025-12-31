import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';

export default class Watchman extends EventEmitter {
  constructor({ watchPaths = [], cacheObjects = [], changeTypes = null, schema = null } = {}) {
    super();
    this.watchPaths = watchPaths;        // [{ type: 'file' | 'folder', path: '...' }]
    this.cacheObjects = cacheObjects;    // Array of { name, ref } → in-memory objects
    this.changeTypes = changeTypes || Watchman.defaultChangeTypes();
    this.schema = schema || Watchman.defaultSchema();
    this.activeWatchers = [];
    this.cacheSnapshots = {};
    this.name = "watchman"
  }

  static defaultChangeTypes() {
    return ['create', 'update', 'rename', 'replace', 'append'];
  }

  static defaultEntityTypes() {
    return ['filename', 'metadata', 'content'];
  }

  static defaultSchema() {
    return {
      type: 'object',
      properties: {
        changeType: { type: 'string' },
        entity: { type: 'string' },
        path: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        details: { type: 'object' }
      },
      required: ['changeType', 'entity', 'path', 'timestamp']
    };
  }

  async start() {
    console.log("[Watchman] Starting file and folder watchers...");
    for (const item of this.watchPaths) {
      if (item.type === 'file') this._watchFile(item.path);
      if (item.type === 'folder') this._watchFolder(item.path);
    }

    for (const obj of this.cacheObjects) {
      this._watchCache(obj.name, obj.ref);
    }
  }

  stop() {
    this.activeWatchers.forEach(watcher => watcher.close?.());
    this.activeWatchers = [];
  }

  // ─── File Watcher ─────────────────────────────────────────────────────────
  _watchFile(filePath) {
    const watcher = fs.watch(filePath, (eventType, filename) => {
      const changeEvent = this._buildChangeEvent({
        changeType: eventType === 'rename' ? 'rename' : 'update',
        entity: 'content',
        path: filePath,
        details: { filename }
      });
      this.emit('change', changeEvent);
    });

    this.activeWatchers.push(watcher);
  }

  // ─── Folder Watcher ───────────────────────────────────────────────────────
  _watchFolder(folderPath) {
    const watcher = fs.watch(folderPath, { recursive: true }, (eventType, filename) => {
      const fullPath = path.join(folderPath, filename);
      const changeEvent = this._buildChangeEvent({
        changeType: eventType === 'rename' ? 'create' : 'update',
        entity: 'filename',
        path: fullPath,
        details: { filename }
      });
      this.emit('change', changeEvent);
    });

    this.activeWatchers.push(watcher);
  }

  // ─── Cache Watcher (via Snapshot Polling) ────────────────────────────────
  _watchCache(name, cacheRef) {
    this.cacheSnapshots[name] = new Map(cacheRef.cache);

    setInterval(() => {
      const current = cacheRef.cache;
      const snapshot = this.cacheSnapshots[name];

      for (const [key, value] of current.entries()) {
        if (!snapshot.has(key)) {
          this.emit('change', this._buildChangeEvent({
            changeType: 'create',
            entity: 'content',
            path: `${name}.${key}`,
            details: { value }
          }));
        } else if (JSON.stringify(snapshot.get(key)) !== JSON.stringify(value)) {
          this.emit('change', this._buildChangeEvent({
            changeType: 'update',
            entity: 'content',
            path: `${name}.${key}`,
            details: { old: snapshot.get(key), new: value }
          }));
        }
      }

      for (const key of snapshot.keys()) {
        if (!current.has(key)) {
          this.emit('change', this._buildChangeEvent({
            changeType: 'delete',
            entity: 'content',
            path: `${name}.${key}`,
            details: { old: snapshot.get(key) }
          }));
        }
      }

      this.cacheSnapshots[name] = new Map(current);
    }, 2000); // Polling interval
  }

  // ─── Event Builder ────────────────────────────────────────────────────────
  _buildChangeEvent({ changeType, entity, path, details = {} }) {
    return {
      changeType,
      entity,
      path,
      timestamp: new Date().toISOString(),
      details
    };
  }
}
