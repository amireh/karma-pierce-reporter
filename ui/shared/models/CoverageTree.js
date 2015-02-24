var K = require("constants");
var FileInfo = require("./FileInfo");
var assign = require("utils/assign");
var { findWhere, sortBy, groupBy } = require("lodash");
var { keys } = Object;
var SCOPE_ROOT = "root";
var FOLDER_SEPARATOR = "/";

function createRelativePath(filePath, sourceRoot) {
  return filePath.split(sourceRoot)[1];
}

function extractFileScopeInfo(filePath, scopeChain, options) {
  var { modulePrefixes, keepPrefix } = options;
  var indent = Array(scopeChain.length+1).join("\t");
  var log = function() {
    var messages = [].slice.call(arguments);
    // console.log(`${indent} ${messages.join(" ")}`);
  };

  log(`Resolving scope for ${filePath}...`);

  for (var i = 0; i < modulePrefixes.length; ++i) {
    var modulePrefix = modulePrefixes[i];
    var fragments = filePath.split(modulePrefix);
    var scope, fileName, scopedFileName, separatorIdx;

    if (fragments.length > 1) {
      log("Prefix matched:", modulePrefix);

      fileName = fragments.slice(1).join(modulePrefix);
      separatorIdx = fileName.indexOf(FOLDER_SEPARATOR);

      if (separatorIdx > -1) {
        scopedFileName = fileName.slice(separatorIdx);
        scope = fileName.slice(0, separatorIdx);

        if (keepPrefix) {
          scopeChain.push(
            [ modulePrefix, scope ].join('')
          );
        }
        else {
          scopeChain.push(scope);
        }

        log(`Scoped file name: ${scopedFileName}`);
        log(`Scope: ${scope}`);

        return extractFileScopeInfo(scopedFileName, scopeChain, options) || {
          scopeChain,
          id: scopedFileName
        };
      }
      else {
        scopedFileName = [ modulePrefix, fileName ].join("/").replace(/\/+/g, "/");
        scope = modulePrefix;

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

function CoverageTree(report, _options) {
  var options = assign({}, {
    keepPrefix: true
  }, _options);

  var scopeTree = keys(report).reduce(function(tree, key) {
    var file, fileInfo, scope, currentScope, scopeIter;
    var fileReport = report[key];
    var filePath = fileReport.path;

    if (options.sourceRoot && options.sourceRoot.length) {
      filePath = createRelativePath(fileReport.path, options.sourceRoot);
    }

    fileInfo = extractFileScopeInfo(filePath, [], {
      modulePrefixes: options.modulePrefixes,
      keepPrefix: options.keepPrefix
    });

    scope = tree;

    if (!fileInfo) {
      fileInfo = {
        scopeChain: [],
        id: filePath
      };
    }

    for (scopeIter = 0; scopeIter < fileInfo.scopeChain.length; ++scopeIter) {
      currentScope = fileInfo.scopeChain[scopeIter];

      scope = findWhere(scope.scopes, { name: currentScope }) || (function() {
        var newScope = { name: currentScope, files: [], scopes: [] };
        scope.scopes.push(newScope);
        return newScope;
      }());
    }

    file = FileInfo(fileReport);
    file.id = filePath;
    file.path = fileInfo.id;

    scope.files.push(file);

    return tree;
  }, { name: "root", files: [], scopes: [] });

  collectScopeCoverage(scopeTree);

  return scopeTree;
};

module.exports = CoverageTree;