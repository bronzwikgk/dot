/*
Overview: Load the modular ActionEntity components, bootstrap examples, and expose exports.
Purpose: Keep the runnable example while delegating core classes to dedicated modules.
Audience: Developers and testers executing the CLI sample in the plugin directory.
Problem Addressed: Prevent the entry file from growing bulky with class definitions.
Use Cases: Run the sample CRUD scenario, import the constants, and leverage the exports.
Features: Demonstration script, organized imports, and export re-exports.
Benefits: Cleaner separation while preserving backwards-compatible exports.
User Stories: As a tester I can run the example to validate entity flows without digging into implementations.
User Flow: Requires initialization, executes CRUD steps, and logs results.
System Components: Depends on ActionEntity, SchemaValidator, DATASETS, ENTITY_CONFIGS, and ActionFs modules.
Edge Cases: Ensures the example still works after relocating the classes.
Test Cases: Node-based example run with TTL overrides in the inprogress/test folder.
Configuration:
- version: v1.0.0
- status: inprogress
- agent: KW-wonderAgent
Schema:
- type: object
- properties:
  - ActionEntity: object
  - SchemaValidator: object
  - DATASETS: object
  - ENTITY_CONFIGS: object
  - ActionFs: object
*/

import path from 'path';
import fsPromises from 'fs/promises';
import { pathToFileURL } from 'url';
import {
  ActionEntity,
  SchemaValidator,
  DATASETS,
  ENTITY_CONFIGS
} from './dot-actionEntity-v1.0.4-inprogress-KW-wonderAgent.js';
import { ActionFs } from './dot-actionFs-v1.0.0-inprogress-KW-wonderAgent.js';

// ============================================================================
// 6. USAGE EXAMPLE (FIXED)
// ============================================================================

async function runExample() {
  console.log('\n=== ActionEntity v1 Fixed Example ===\n');
  
  // Create ActionEntity instance
  const actionEntity = new ActionEntity({
    dataset: {
      action: DATASETS.action,
      entity: DATASETS.entity.slice(0, 3) // Just test with first 3 entities
    },
    storage: {
      basePath: './data'
    },
    cache: true
  });
  
  // Initialize
  await actionEntity.initialize();
  
  // Example 1: Create a user
  console.log('\n1. Creating user...');
  const createRequest = {
    entity: 'user_register',
    action: 'create',
    data: {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      userId: 'user_001',
      role: 'user'
    }
  };
  
  const createResponse = await actionEntity.processRequest(createRequest);
  console.log('Create Response:', JSON.stringify(createResponse, null, 2));
  
  if (createResponse.success) {
    const userId = createResponse.data.id;
    
    // Example 2: Create a session for the user
    console.log('\n2. Creating user session...');
    const sessionRequest = {
      entity: 'user_session',
      action: 'create',
      data: {
        sessionId: 'session_123',
        userId: 'user_001',
        username: 'john_doe',
        token: 'token_abc',
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      }
    };
    
    const sessionResponse = await actionEntity.processRequest(sessionRequest);
    console.log('Session Response:', JSON.stringify(sessionResponse, null, 2));
    
    // Example 3: Create an alarm
    console.log('\n3. Creating alarm...');
    const alarmRequest = {
      entity: 'alarm',
      action: 'create',
      data: {
        message: 'System temperature high',
        severity: 'high',
        status: 'active'
      }
    };
    
    const alarmResponse = await actionEntity.processRequest(alarmRequest);
    console.log('Alarm Response:', JSON.stringify(alarmResponse, null, 2));
    
    // Example 4: List all alarms
    console.log('\n4. Listing alarms...');
    const listAlarmsRequest = {
      entity: 'alarm',
      action: 'list',
      data: {}
    };
    
    const listAlarmsResponse = await actionEntity.processRequest(listAlarmsRequest);
    console.log(`Found ${listAlarmsResponse.data?.length || 0} alarms`);
    
    // Example 5: List all users
    console.log('\n5. Listing users...');
    const listUsersRequest = {
      entity: 'user_register',
      action: 'list',
      data: {}
    };
    
    const listUsersResponse = await actionEntity.processRequest(listUsersRequest);
    console.log(`Found ${listUsersResponse.data?.length || 0} users`);
    
    // Example 6: Update the alarm
    if (alarmResponse.success) {
      const alarmId = alarmResponse.data.id;
      console.log('\n6. Updating alarm...');
      const updateAlarmRequest = {
        entity: 'alarm',
        action: 'update',
        id: alarmId,
        data: {
          status: 'acknowledged',
          acknowledgedAt: new Date().toISOString()
        }
      };
      
      const updateAlarmResponse = await actionEntity.processRequest(updateAlarmRequest);
      console.log('Update Alarm Response:', JSON.stringify(updateAlarmResponse, null, 2));
    }
  }
}

// ============================================================================
// 7. EXPORTS
// ============================================================================

export {
  ActionEntity,
  SchemaValidator,
  ActionFs,
  DATASETS,
  ENTITY_CONFIGS
};

const currentFileUrl = import.meta.url;
const invokedFileUrl = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : null;

if (currentFileUrl === invokedFileUrl) {
  // Clean up and create fresh data directory
  async function setup() {
    try {
      await fsPromises.rm('./data', { recursive: true, force: true });
      console.log('Cleaned up old data directory');
      await fsPromises.mkdir('./data', { recursive: true });
      console.log('Created fresh data directory');
      await runExample();
    } catch (error) {
      console.error('Setup error:', error);
    }
  }

  setup().catch(console.error);
}
