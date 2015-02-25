var AppStore = require("stores/AppStore");
var RouteActions = require("./RouteActions");

exports.useBlob = function(reportBlob) {
  AppStore.inject(reportBlob);
};

exports.browseSource = function(fileId) {
  RouteActions.adjustQuery({ file: fileId });
};