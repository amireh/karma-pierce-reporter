var React = require('react');
var { DefaultRoute, Route, NotFoundRoute } = require('react-router');

module.exports = function() {
  return [
    <Route name="root" path="/" handler={require('./views/Root')}>
    </Route>,

    <NotFoundRoute name="not-found" handler={require('./views/NotFound')}/>
  ];
};
