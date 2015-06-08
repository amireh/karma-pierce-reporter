var AppStore = require("stores/AppStore");
var RouteActions = require("./RouteActions");

exports.useBlob = function(reportBlob) {
  AppStore.inject(reportBlob);
};
