require("./index.less");

var React = require("react");
var Router = require("react-router");
var { Route, NotFoundRoute, HashLocation } = Router;

var router = Router.create({
  location: HashLocation,
  routes: [
    <Route
      name="root"
      path="/"
      handler={require('./views/Root')}
    />,

    <NotFoundRoute
      name="not-found"
      handler={require('./views/NotFound')}
    />
  ]
});

router.run(function(Handler, state) {
  React.render(<Handler {...state} />, document.querySelector("#__app__"));
});