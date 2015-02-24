var $ = require("jquery");
var { Simulate, SimulateNative } = require("react/lib/ReactTestUtils");
var { keys } = Object;

var helpers = {};

// {HTMLElement} rootNode
var rootNode;

var assertNodeIsValid = function(node, selector, action) {
  if (!node) {
    throw new Error(`
      You are attempting to operate (${action}) on a node that does not exist!
      Selector: ${selector}
    `);
  }

  return node;
};

/**
 * Locate an element inside the component.
 *
 * @param {String} selector
 *        A document.querySelector or jQuery.find() selector.
 *
 * @return {HTMLElement|NilClass}
 */
var findAll = helpers.findAll = function(selector, options) {
  var $container, $node;

  if (options && options.container) {
    $container = $(options.container);
  }
  else {
    $container = $(rootNode);
  }

  $node = $container.find(selector);

  if ($node.length === 0 && $container.is(selector)) {
    return $container;
  }

  return $node;
};

/**
 * Locate an element inside the component.
 *
 * @param {String} selector
 *        A document.querySelector or jQuery.find() selector.
 *
 * @return {HTMLElement|NilClass}
 */
var find = helpers.find = function(selector, options) {
  var node;

  if (typeof selector === "string") {
    node = findAll(selector, options)[0];
  }
  else if (selector instanceof HTMLElement) {
    node = selector;
  }
  else if (selector instanceof $) {
    node = selector[0];
  }

  if (options && options.assert) {
    assertNodeIsValid(node, selector, options.action || "find");
  }

  return node;
};

/**
 * Get text for an element inside the component.
 *
 * @param {String} selector
 *        A document.querySelector or jQuery.find() selector.
 *
 * @return {String}
 */
helpers.findText = function(selector) {
  var node = find(selector, { assert: true, action: "findText" });

  return node.textContent.trim();
};

helpers.findInModal = function(selector) {
  return $(".ReactModal__Content").find(selector)[0];
};

/**
 * Simulate a mouse-click on any HTMLElement.
 */
helpers.click = function(selector, simulateNative) {
  var node = find(selector, { assert: true, action: "click" });

  if (simulateNative === true) {
    return SimulateNative.click(node);
  }

  return Simulate.click(node);
};

helpers.click.$ = function(selector) {
  var node = find(selector);

  helpers.click(selector);
  $(node).click();
};

helpers.check = function(selector, isChecked) {
  var node = find(selector, { assert: true, action: "check" });

  if (arguments.length === 1) {
    isChecked = !node.checked;
  }

  $(node).prop("checked", isChecked);
  Simulate.change(node);
};

/**
 * Fill in an <input /> with some text.
 */
helpers.fillIn = function(selector, text) {
  var node = find(selector, { assert: true, action: "fillIn" });
  node.value = text;
  Simulate.change(node);
};

/**
 * Select an option inside a <select /> tag.
 *
 * This helper is compatible with Chosen tags.
 *
 * @param  {String} selector
 * @param  {String} value
 *         The value of the <option /> you want to select.
 */
helpers.select = function(selector, value) {
  var node = find(selector, { assert: true, action: "select" });
  var $node = $(node);

  $node.find(":selected").prop("selected", false);
  $node.find("[value=\"" + value + "\"]").prop("selected", true);

  if ($node.data("chosen")) {
    $node.trigger("chosen:updated");
  }

  node.value = value;
  Simulate.change(node);
};

/**
 * Simulate single key-down event
 */
helpers.keyDown = function(selector, keyCode) {
  var node = find(selector, { assert: true, action: "keyDown" });
  node.focus();
  Simulate.keyDown(node, { keyCode });
};

/**
 * Simulate single key-up event
 */
helpers.keyUp = function(selector, keyCode) {
  var node = find(selector, { assert: true, action: "keyUp" });
  node.focus();
  Simulate.keyUp(node, { keyCode, which: keyCode });
};

/**
 * Simulate key-presses to fill in an <input /> with some text.
 *
 * @param {Boolean} [dontReplace=false]
 *        Set to true if you don't want the input's value to be cleared before
 *        modifying it (e.g, append instead of replace.)
 */
helpers.typeIn = function(selector, text, dontReplace) {
  var i, evt, code, char;
  var node = find(selector, { assert: true, action: "typeIn" });

  node.focus();

  if (!dontReplace) {
    node.value = "";
  }

  for (i = 0; i < text.length; ++i) {
    char = text.charAt(i);
    code = text.charCodeAt(i);

    evt = $.Event("keydown");
    evt.altGraphKey = false;
    evt.altKey = false;
    evt.bubbles = true;
    evt.cancelBubble = false;
    evt.cancelable = true;
    evt.charCode = code;
    evt.clipboardData = undefined;
    evt.ctrlKey = false;
    evt.currentTarget = node;
    evt.defaultPrevented = false;
    evt.detail = 0;
    evt.eventPhase = 2;
    evt.keyCode = code;
    evt.keyIdentifier = char.toUpperCase();
    evt.keyLocation = 0;
    evt.layerX = 0;
    evt.layerY = 0;
    evt.metaKey = false;
    evt.pageX = 0;
    evt.pageY = 0;
    evt.returnValue = true;
    evt.shiftKey = false;
    evt.srcElement = node;
    evt.target = node;
    evt.type = "keydown";
    evt.view = window;
    evt.which = code;

    $(node).trigger(evt);

    node.value += char;

    Simulate.change(node);
  }
};

/**
 * Simulate a mouseEnter on any HTMLElement.
 * Assumes you are leaving the body; use mouseTransition if you need to
 * control both targets
 */
helpers.mouseEnter = function(selector) {
  return helpers.mouseTransition(null, selector);
};

/**
 * Simulate a mouseLeave on any HTMLElement.
 * Assumes you are entering the body; use mouseTransition if you need to
 * control both targets
 */
helpers.mouseLeave = function(selector) {
  return helpers.mouseTransition(selector, null);
};

/**
 * Simulate a mouseEnter + mouseLeave events for two nodes
 *
 * Both the native mouseOut and mouseOver events need to be simulated in
 * order for the mouseEnter or mouseLeave to fire.
 * https://github.com/facebook/react/issues/1297
 */
helpers.mouseTransition = function(fromSelector, toSelector) {
  var fromNode = fromSelector !== null ?
    find(fromSelector, { assert: true, action: "mouseLeave" }) :
    document.body;
  var toNode = toSelector !== null ?
    find(toSelector, { assert: true, action: "mouseEnter" }) :
    document.body;

  SimulateNative.mouseOut(fromNode, {relatedTarget: toNode});
  SimulateNative.mouseOver(toNode, {relatedTarget: fromNode});
};

/**
 * @param {HTMLElement} node
 *        The DOM node of mounted instance of the component being tested. All
 *        helpers will be operating on that node and its children.
 */
exports.setRootNode = function(node) {
  rootNode = node;
};

// Expose the helpers so that we can move away from injecting into the global.
keys(helpers).forEach(function(helper) {
  exports[helper] = helpers[helper];
});
