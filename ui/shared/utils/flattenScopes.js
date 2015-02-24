function flattenScopes(rootScope, __tree) {
  return rootScope.scopes.reduce(function(scopeTree, scope) {
    scopeTree.push(scope);

    if (scope.scopes) {
      scope.scopes.forEach(function(childScope) {
        flattenScopes(childScope, scopeTree);
      });
    }

    return scopeTree;
  }, [rootScope]);
};

module.exports = flattenScopes;