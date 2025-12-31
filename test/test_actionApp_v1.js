// Run all tests
import runAllTests from './test-runner.js';
await runAllTests();

// Create custom test
import { TestSuite, DummyDataGenerator } from './test-runner.js';

const suite = new TestSuite('Custom Tests');
suite.test('My test', (assert, dummy) => {
  const user = dummy.user();
  assert.truthy(user);
  assert.hasProperty(user, 'email');
});

await suite.run();