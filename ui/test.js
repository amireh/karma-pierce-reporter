/* jslint node:true */

// Enforce the test environment to suppress certain messages from ReactRouter.
process.env.NODE_ENV = "test";

// TEST BOOTSTRAP
var chai = require("chai");
var reactSuite = require("./shared/test_helpers/reactSuite");

require("./shared/test_helpers/chai/assertions");

// Needed for custom assertions to show the trace back to the test file when
// they fail.
chai.config.includeStack = true;

window.expect = chai.expect;

// Run all the tests.
var tests = require.context("./", true, /\.test\.js$/);
tests.keys().forEach(tests);