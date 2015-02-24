var fs = require('fs-extra');
var path = require('path');
var ASSET_PATH = path.join(__dirname, '..', 'www');

module.exports = function(runtimeDir, reportFilePath) {
  fs.copySync(ASSET_PATH, runtimeDir);

  fs.writeFileSync(path.join(runtimeDir, 'config.js'),
    'window.PIERCE_CONFIG = {' +
      '"reportBlob": ' + fs.readFileSync(reportFilePath, 'utf-8') +
    '};'
  );
};