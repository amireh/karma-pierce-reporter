/* jshint node: true */
var fs = require('fs-extra');
var path = require('path');
var chokidar = require('chokidar');
var generateAssets = require('./lib/generateAssets');
var waitUntil = require('./lib/waitUntil');
var DEFAULTS = require('./defaults.plugin.js');

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

  function doGenerateAssets() {
    logger.debug("Generating assets...");
    generateAssets(getRuntimeDir(), filePath, config);
    logger.info("Coverage report consumed, assets generated.");
  }

  function watchReportFile(newFilePath) {
    if (filePath) {
      chokidarWatcher.unwatch(filePath);
    }

    filePath = newFilePath;

    // we need the directory to exist for chokidar to watch it properly,
    // otherwise we'll be missing the first report to be generated
    fs.ensureDirSync(path.dirname(filePath));

    chokidarWatcher.add(filePath);

    logger.info('will be watching ' + filePath);
  }

  this.onBrowserStart = function(browser) {
    watchReportFile(getReportPath(browser.name));
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
    ignorePermissionErrors: false,
    ignoreInitial: false,
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

    waitUntil(function() {
      return fs.existsSync(filePath);
    }, function() {
      if (fs.existsSync(filePath)) {
        doGenerateAssets();
      }
      else {
        logger.error("Unable to find the JSON coverage report.");
      }

      done();
    }, 1000, Math.max(config.waitSeconds || 1, 1));
  });

  watchReportFile(getReportPath());
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