var { keys } = Object;
var routerDelegate;

/**
 * Update the query string to reflect the new given key/value pairs. This
 * will trigger a re-transition of the current route.
 *
 * @param  {Object} newQuery
 *         The query parameters.
 */
exports.updateQuery = function(newQuery) {
  var delegate = routerDelegate;
  var routes = delegate.getRoutes();
  var currentRouteName = routes[routes.length-1].name;
  var query = delegate.getQuery();

  keys(newQuery).forEach(function(key) {
    query[key] = newQuery[key];
  });

  delegate.replaceWith(currentRouteName, delegate.getParams(), query);
};

exports.assignDelegate = function(delegate) {
  routerDelegate = delegate;
};