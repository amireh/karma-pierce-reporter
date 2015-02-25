function flattenScopes(rootScope, __set) {
  var set = __set;

  if (!set) {
    set = [];
  }

  set.push(rootScope);

  return rootScope.scopes.reduce(function(set, scope) {
    set.push(scope);

    if (scope.scopes) {
      scope.scopes.forEach(function(childScope) {
        flattenScopes(childScope, set);
      });
    }

    return set;
  }, set);
};

module.exports = flattenScopes;