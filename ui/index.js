require("./index.less");

var React = require("react");
var Router = require("react-router");
var Root = require('./views/Root.js');
var { Route, DefaultRoute, NotFoundRoute, HashLocation } = Router;

var router = Router.create({
  location: HashLocation,
  routes: [
    <Route name="root" path="/" handler={Root}>
      <DefaultRoute name="coverage" handler={require("./views/Coverage")} />
    </Route>,

    <NotFoundRoute
      name="not-found"
      handler={require('./views/NotFound')}
    />
  ]
});

router.run(function(Handler, state) {
  React.render(<Handler {...state} />, document.querySelector("#__app__"));
});