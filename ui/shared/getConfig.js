var { extend } = require("lodash");
var defaults = require("../../defaults");
var cache;

module.exports = function() {
  return cache || (function() {
    var config = cache = extend({},
      defaults,
      window.PIERCE_CONFIG /* this will be auto-generated */
    );

    if (process.env.NODE_ENV === "development") {
      console.debug('Using development config.');
      extend(config, require("../config.local.js"));
    }

    return config;
  }());
};