var K = require("constants");
var File = require("./FileInfo");
var { findWhere, sortBy, groupBy } = require("lodash");
var { keys } = Object;
var { SOURCE_ROOT, MODULE_PREFIXES } = K;
var SCOPE_ROOT = "root";
var FOLDER_SEPARATOR = "/";

function createRelativePath(filePath) {
  return filePath.split(SOURCE_ROOT)[1];
}

function extractFileScopeInfo(filePath, scopeChain) {
  if (arguments.length === 1) {
    scopeChain = [];
  }

  var indent = Array(scopeChain.length+1).join("\t");
  var log = function() {
    var messages = [].slice.call(arguments);
    // console.log(`${indent} ${messages.join(" ")}`);
  };

  log(`Resolving scope for ${filePath}...`);

  for (var i = 0; i < MODULE_PREFIXES.length; ++i) {
    var modulePrefix = MODULE_PREFIXES[i];
    var fragments = filePath.split(modulePrefix);
    var scope, fileName, scopedFileName, separatorIdx;

    if (fragments.length > 1) {
      log("Prefix matched:", modulePrefix);

      fileName = fragments.slice(1).join(modulePrefix);
      separatorIdx = fileName.indexOf(FOLDER_SEPARATOR);

      if (separatorIdx > -1) {
        scopedFileName = fileName.slice(separatorIdx);
        scope = fileName.slice(0, separatorIdx);

        scopeChain.push(
          [ modulePrefix, scope ].join('')
        );

        log(`Scoped file name: ${scopedFileName}`);
        log(`Scope: ${scope}`);

        return extractFileScopeInfo(scopedFileName, scopeChain) || {
          scopeChain,
          id: scopedFileName
        };
      }
      else {
        scopedFileName = [ modulePrefix, fileName ].join("/").replace(/\/+/g, "/");
        scope = modulePrefix;

        // scopeChain.push(scope);

        return {
          scopeChain,
          id: scopedFileName
        };
      }
    }
  }
}

function collectScopeCoverage(scope) {
  if (scope.scopes) {
    scope.scopes.forEach(collectScopeCoverage);
  }

  if (scope.files.length) {
    scope.v = scope.files.reduce(function(coverage, file) {
      return coverage + file.v;
    }, 0) / scope.files.length;
  }
  else {
    scope.v = 100;
  }
}

function CoverageTree(report) {
  var scopeTree = keys(report).reduce(function(tree, key) {
    var file;
    var fileReport = report[key];
    var filePath = createRelativePath(fileReport.path);
    var fileInfo = extractFileScopeInfo(filePath);
    var scope = tree;

    if (!fileInfo) {
      fileInfo = {
        scopeChain: [],
        id: filePath
      };
    }

    for (var i = 0; i < fileInfo.scopeChain.length; ++i) {
      var currentScope = fileInfo.scopeChain[i];

      scope = findWhere(scope.scopes, { name: currentScope }) || (function() {
        var newScope = { name: currentScope, files: [], scopes: [] };
        scope.scopes.push(newScope);
        return newScope;
      }());
    }

    file = File(fileReport);
    file.id = filePath;
    file.path = fileInfo.id;

    scope.files.push(file);

    return tree;
  }, { name: "root", files: [], scopes: [] });

  collectScopeCoverage(scopeTree);

  return scopeTree;
};

module.exports = CoverageTree;