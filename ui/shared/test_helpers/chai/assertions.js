var { Assertion } = require("chai");
var { find, findText } = require("test_helpers/reactSuite/DOMHelpers");

/**
 * Assert whether a certain DOM element has been rendered by the component you
 * are testing.
 *
 * @example
 *     expect(find("p.some-element")).to.exist();
 *
 * Equivalent to:
 *
 *     expect(!!find("p.some-element")).to.equal(true);
 *
 */
Assertion.addMethod('exist', function() {
  var node = this._obj;
  new Assertion(!!find(node)).to.equal(true);
});

/**
 * Assert that a DOM element exists within a mounted React component.
 *
 * @example
 *     expect(subject).to.contain("p.some-element");
 *
 * This is similar to #to.exist() only with better error reporting.
 */
Assertion.overwriteChainableMethod('contain', function (_super) {
  return function assertContainsDOMElement(selector) {
    var obj = this._obj;
    var displayName;

    if (typeof selector === "string" && (typeof obj === "object" || obj instanceof Function)) {
      if (typeof obj.isMounted !== "function") {
        throw new Error("You must pass a React instance to #contain()");
      }
      else if (!obj.isMounted()) {
        throw new Error("You must pass a mounted React component to #contain()");
      }

      displayName = obj.constructor.displayName;

      this.assert(
        !!find(selector, { container: obj.getDOMNode() }),
        `expected an element (${selector}) to exist within ${displayName}, but it does not`,
        `expected an element (${selector}) not to exist within ${displayName}, but it does`
      );
    }
    else {
      _super.apply(this, arguments);
    }
  };
}, function(_super) {
  return _super;
});

/**
 * Convenience assertion for DOMHelpers#findText() for testing whether a node
 * has the text you're expecting it to.
 *
 * @example
 *     expect(find(".some-element")).to.read("Hello World!");
 *
 * This is equivalent to:
 *
 *     expect(findText(".some-element")).to.equal("Hello World!");
 */
Assertion.addMethod('read', function(text) {
  var node = this._obj;
  new Assertion(findText(node)).to.equal(text);
});
