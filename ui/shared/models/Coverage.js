function collectScopeCoverage(scope) {
  if (scope.scopes) {
    scope.scopes.forEach(collectScopeCoverage);
  }

  if (scope.files.length) {
    scope.v = computeScopeCoverage(scope.files);
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

function computeScopeCoverage(files) {
  if (!files || files.length === 0) {
    return Infinity;
  }

  return files.reduce((acc, file) => acc + file.v, 0) / files.length;
}

module.exports = Coverage;
module.exports.computeScopeCoverage = computeScopeCoverage;