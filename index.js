/* jshint node: true */
var fs = require('fs-extra');
var path = require('path');
var chokidar = require('chokidar');
var generateAssets = require('./lib/generateAssets');
var DEFAULTS = {
  dir: 'pierce'
};

function getReporterConfig(covConfig) {
  var covReporters = covConfig.reporters || [ covConfig ];

  return covReporters.filter(function(reporter) {
    return reporter.type === 'json';
  })[0];
}

function KarmaPierceReporter(basePath, logLevel, config, covConfig, emitter, karmaLog, helper) {
  var chokidarWatcher, covReporterConfig;
  var logger = karmaLog.create('Pierce', logLevel);
  var filePath;

  function getOutputDir(browserName) {
    var dir = covReporterConfig.dir || covConfig.dir || 'coverage';
    var subdir = covReporterConfig.subdir || covConfig.subdir || browserName || '';

    if (typeof subdir === 'function') {
      subdir = subdir(browserName);
    }

    return path.join(dir, subdir);
  }

  function getReportPath(browserName) {
    return helper.normalizeWinPath(
      path.resolve(
        basePath || '',
        getOutputDir(browserName),
        covReporterConfig.file
      )
    );
  }

  function getRuntimeDir() {
     return helper.normalizeWinPath(
      path.resolve(
        basePath || '',
        getOutputDir(),
        config.dir
      )
    );
  }

  function getRuntimeConfigPath() {
    return helper.normalizeWinPath(path.resolve(getRuntimeDir(), 'config.js'));
  }

  function doGenerateAssets() {
    logger.debug("generating assets...");
    generateAssets(getRuntimeDir(), filePath, config);
  }

  this.onBrowserStart = function(browser) {
    var newFilePath = getReportPath(browser.name);

    if (newFilePath !== filePath) {
      chokidarWatcher.unwatch(filePath);
      chokidarWatcher.add(newFilePath);

      filePath = newFilePath;

      logger.info('will be watching ' + newFilePath);
    }
  };

  if (!helper.isDefined(covConfig)) {
    throw new Error('Pierce: missing coverageReporter config.');
  }

  covReporterConfig = getReporterConfig(covConfig);

  if (!helper.isDefined(covReporterConfig)) {
    throw new Error('Pierce: missing coverageReporter json reporter config.');
  }

  config = helper.merge({}, DEFAULTS, config);

  chokidarWatcher = new chokidar.FSWatcher({
    usePolling: false,
    ignorePermissionErrors: true,
    ignoreInitial: true,
  });

  chokidarWatcher
    .on('add', doGenerateAssets)
    .on('change', doGenerateAssets)
    .on('error', function(e) {
      logger.error(e);
    })
  ;

  emitter.on('exit', function(done) {
    chokidarWatcher.close();
    done();
  });

  filePath = getReportPath();
  chokidarWatcher.add(filePath);

  logger.debug('expected JSON report destination:', filePath);
}

KarmaPierceReporter.$inject = [
  'config.basePath',
  'config.logLevel',
  'config.pierceReporter',
  'config.coverageReporter',
  'emitter',
  'logger',
  'helper'
];

module.exports = {
  'reporter:pierce': [ 'type', KarmaPierceReporter ]
};