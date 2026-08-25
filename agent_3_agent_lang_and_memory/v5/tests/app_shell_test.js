// app_shell_test.js
// Unit tests for app_shell_v4_0_0

import app_shell from "../code/plugins/app_shell_v4_0_0.js";

const shell = new app_shell({ actor: "test_user" });

// Test 1: Boot application
console.log("Test 1: Boot application");
const app = shell.boot({ name: "Test App" });
console.assert(app !== null, "Should create app");
console.assert(app.type === "application", "Should be application type");
console.log("  PASS");

// Test 2: Register route
console.log("Test 2: Register route");
shell.register_route("/home", () => "home page");
console.log("  PASS");

// Test 3: Navigate
console.log("Test 3: Navigate");
const nav = shell.navigate("/home");
console.assert(nav.ok === true, "Should navigate");
console.log("  PASS");

// Test 4: Navigate to unknown route
console.log("Test 4: Navigate to unknown route");
const unknown = shell.navigate("/unknown");
console.assert(unknown.ok === false, "Should fail");
console.log("  PASS");

// Test 5: Mount component
console.log("Test 5: Mount component");
const mounted = shell.mount({ id: "comp1" }, "body");
console.assert(mounted.ok === true, "Should mount");
console.log("  PASS");

// Test 6: Get mounted
console.log("Test 6: Get mounted");
const mounted_list = shell.get_mounted();
console.assert(mounted_list.length === 1, "Should have 1 mounted");
console.log("  PASS");

// Test 7: Unmount
console.log("Test 7: Unmount");
const unmounted = shell.unmount("comp1");
console.assert(unmounted.ok === true, "Should unmount");
console.log("  PASS");

console.log("\n=== ALL TESTS PASSED ===");
