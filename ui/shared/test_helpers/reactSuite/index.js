var DOMHelpers = require("./DOMHelpers");
var API = require("./api");
var GLOBAL = window;

var config = {
  container: document.body,
  inspect: !!window.location.search.match(/inspect/),
  useGlobals: true,
};

var expose = function(key, value) {
  if (config.useGlobals) {
    if (value === undefined) {
      delete GLOBAL[key];
    }
    else {
      GLOBAL[key] = value;
    }
  }
};

/**
 * Prepare a mocha test suite for testing a React component. Every test in the
 * suite will have access to a mounted instance of the component type you're
 * testing, which means you don't have to worry about creating, rendering,
 * or detaching the component.
 *
 * You may access the instance using the global "subject".
 *
 * Also, your tests will have access to a bunch of DOM helpers for writing the
 * test scenarios. See ./DOMHelpers.js for those helpers.
 *
 * @param {MochaSuite} suite
 *        The test suite you're in. I.e, the function passed to describe().
 *
 * @param {React} type
 *        The component type/factory/class something you want to test.
 *
 * @param {Object} [initialProps={}]
 *        Optional. If you want the component to start out with certain props
 *        when it's auto-rendered by the reactSuite, this is the way to do it.
 *
 *        Probably useful for required props.
 *
 * @return {API}
 *
 * @example
 *
 *     var reactSuite = require("test_helpers/reactSuite");
 *
 *     describe('MyComponent', function() {
 *       reactSuite(this, require("components/MyComponent"));
 *
 *       it("should mount without errors", function() {
 *         // subject will now point to the mounted instance of MyComponent:
 *         expect(subject.isMounted()).to.equal(true);
 *       });
 *     });
 */
module.exports = function(suite, type, options) {
  var api = new API(suite, type, options || { tagName: "div" });

  suite.beforeEach(function(done) {
    api.createSubject(function(subject, container) {
      DOMHelpers.setRootNode(subject.getDOMNode());

      if (config.inspect) {
        config.container.appendChild(container);
      }

      expose("subject", subject);

      done();
    });
  });

  suite.afterEach(function() {
    if (!config.inspect) {
      expose("subject", undefined);
      DOMHelpers.setRootNode(null);

      api.removeSubject();
    }
  });

  return api;
};

module.exports.config = config;
module.exports.DOMHelpers = DOMHelpers;
