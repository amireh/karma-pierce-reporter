module.exports = function() {
  // this will be auto-generated
  var config = window.PIERCE_CONFIG || {};

  if (process.env.NODE_ENV === "development") {
    console.debug('Using fixture report.');
    config.reportBlob = require('json!../fixture/report_00');
  }

  return config;
};