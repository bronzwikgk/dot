/**
 * @file      plugin_host.js
 * @project   an_app
 * @version   1.0.0
 * @status    draft
 * @author    opencode
 * @date      2026-08-22
 * @license   MIT
 * @summary   Plugin discovery, ordering, validation, and activation
 * @deps      fs, path
 * @exports   create_plugin_host
 */

import { readdirSync, readFileSync } from 'fs';
import { resolve, join } from 'path';

function topological_sort(plugins) {
  const graph = new Map();
  for (const plugin of plugins) {
    graph.set(plugin.name, {
      plugin,
      deps: (plugin.requires || []).filter((r) =>
        plugins.some((p) => p.name === r)
      ),
    });
  }

  const visited = new Set();
  const visiting = new Set();
  const sorted = [];

  function visit(name) {
    if (visited.has(name)) return;
    if (visiting.has(name)) {
      throw new Error(
        `[plugin_host] Circular dependency detected involving: ${name}`
      );
    }
    visiting.add(name);
    const node = graph.get(name);
    if (node) {
      for (const dep of node.deps) {
        visit(dep);
      }
    }
    visiting.delete(name);
    visited.add(name);
    if (node) {
      sorted.push(node.plugin);
    }
  }

  for (const plugin of plugins) {
    visit(plugin.name);
  }

  return sorted;
}

function load_plugin_from_dir(dir_path) {
  try {
    const manifest_path = join(dir_path, 'plugin.json');
    const manifest_raw = readFileSync(manifest_path, 'utf-8');
    const manifest = JSON.parse(manifest_raw);

    const required_fields = ['name', 'version'];
    for (const field of required_fields) {
      if (!manifest[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    manifest._dir_path = dir_path;
    return manifest;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

export function create_plugin_host({ ctx }) {
  const active_plugins = new Map();
  let status = 'idle';

  function discover_plugins(base_path) {
    status = 'discovering';
    const resolved = resolve(base_path);
    const entries = readdirSync(resolved, { withFileTypes: true });
    const discovered = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const dir_path = join(resolved, entry.name);
      try {
        const manifest = load_plugin_from_dir(dir_path);
        if (manifest) {
          discovered.push(manifest);
          ctx.log?.info?.(
            `[plugin_host] Discovered plugin: ${manifest.name}@${manifest.version}`
          );
        }
      } catch (err) {
        ctx.log?.warn?.(
          `[plugin_host] Failed to load plugin from ${dir_path}: ${err.message}`
        );
      }
    }

    status = 'discovered';
    return discovered;
  }

  function activate_all(plugins) {
    status = 'activating';
    let sorted;
    try {
      sorted = topological_sort(plugins);
    } catch (err) {
      status = 'error';
      throw err;
    }

    for (const plugin of sorted) {
      try {
        if (plugin.activate && typeof plugin.activate === 'function') {
          plugin.activate(ctx);
        }
        active_plugins.set(plugin.name, {
          plugin,
          activated_at: Date.now(),
          state: 'active',
        });
        ctx.log?.info?.(
          `[plugin_host] Activated plugin: ${plugin.name}`
        );
      } catch (err) {
        ctx.log?.error?.(
          `[plugin_host] Failed to activate plugin ${plugin.name}: ${err.message}`
        );
        active_plugins.set(plugin.name, {
          plugin,
          activated_at: Date.now(),
          state: 'failed',
          error: err.message,
        });
      }
    }

    status = 'active';
  }

  function deactivate_all() {
    status = 'deactivating';

    for (const [name, entry] of active_plugins) {
      try {
        if (
          entry.plugin.deactivate &&
          typeof entry.plugin.deactivate === 'function'
        ) {
          entry.plugin.deactivate(ctx);
        }
        entry.state = 'deactivated';
        ctx.log?.info?.(`[plugin_host] Deactivated plugin: ${name}`);
      } catch (err) {
        ctx.log?.error?.(
          `[plugin_host] Failed to deactivate plugin ${name}: ${err.message}`
        );
        entry.state = 'error';
        entry.error = err.message;
      }
    }

    active_plugins.clear();
    status = 'idle';
  }

  function get_status() {
    const plugins = {};
    for (const [name, entry] of active_plugins) {
      plugins[name] = {
        state: entry.state,
        activated_at: entry.activated_at,
        error: entry.error,
      };
    }
    return {
      host_status: status,
      active_count: active_plugins.size,
      plugins,
    };
  }

  return { discover_plugins, activate_all, deactivate_all, get_status };
}
