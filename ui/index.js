var React = require("react");
var Router = require("react-router");
var { Route, HashLocation } = Router;

window.$ = require("jquery");

require("./index.less");

if (process.env.NODE_ENV === "development") {
  console.debug('Using fixture report.');
  require("config").reportBlob = require('json!./fixture/report_00');
}

var router = Router.create({
  location: HashLocation,
  routes: require('./routes')()
});

router.run(function(Handler, state) {
  React.render(<Handler {...state} />, document.querySelector("#__app__"));
});