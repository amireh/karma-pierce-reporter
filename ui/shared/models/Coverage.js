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

/**
 * @param {CoverageTree} coverageTree
 */
function Coverage(coverageTree) {
  var collectFiles = function(scope, arr) {
    if (scope.scopes.length > 0) {
      scope.scopes.forEach(function(childScope) {
        collectFiles(childScope, arr);
      });
    }

    scope.files.forEach(function(file) { arr.push(file); });

    return arr;
  };

  var rootScope = {
    name: "root",
    files: collectFiles(coverageTree, []),
    scopes: []
  };

  collectScopeCoverage(rootScope);

  return rootScope;
}

module.exports = Coverage;