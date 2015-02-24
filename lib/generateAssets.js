var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');
var RUNTIME_CONFIG_WHITELIST = Object.keys(require("../defaults"));
var pick = _.pick;
var extend = _.extend;
var ASSET_PATH = path.join(__dirname, '..', 'www');

module.exports = function(runtimeDir, reportFilePath, config) {
  var runtimeConfig = extend(pick(config, RUNTIME_CONFIG_WHITELIST), {
    reportBlob: fs.readJsonSync(reportFilePath)
  });

  fs.copySync(ASSET_PATH, runtimeDir);

  fs.writeFileSync(path.join(runtimeDir, 'config.js'),
    'window.PIERCE_CONFIG =' + JSON.stringify(runtimeConfig) + ';'
  );
};