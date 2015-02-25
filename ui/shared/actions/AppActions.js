var AppStore = require("stores/AppStore");
var RouteActions = require("./RouteActions");
var ajax = require("ajax");

exports.fetchFromURL = function(url) {
  ajax({ url }).then(function(payload) {
    AppStore.inject(payload);
  });
};

exports.useBlob = function(reportBlob) {
  AppStore.inject(reportBlob);
};

exports.browseSource = function(fileId) {
  RouteActions.adjustQuery({ file: fileId });
};