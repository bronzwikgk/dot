import assert from 'node:assert/strict';
import { app_generator } from './code/plugins/code_shared_app_generator_v3_0_0_draft.js';
import { entity_validator } from './code/utilities/code_shared_entity_validator_v3_0_0_draft.js';
const v = new entity_validator();
const ag = new app_generator({ validator: v });
const app = { id: 'app1', name: 'my_app', type: 'app' };
const rel = [
  { id: 'r1', name: 'r1', type: 'route' },
  { id: 'v1', name: 'v1', type: 'view' },
];
const plan = ag.plan_app(app, rel);
assert.equal(plan.files.length, 2);
const manifest = ag.compose_manifest(plan);
assert.ok(manifest.includes('"app": "app1"'));
console.log('app_generator checks passed');
