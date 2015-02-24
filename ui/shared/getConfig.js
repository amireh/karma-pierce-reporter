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
      console.debug('Using fixture report.');
      config.reportBlob = require('json!../fixture/report_00');
    }

    return config;
  }());
};