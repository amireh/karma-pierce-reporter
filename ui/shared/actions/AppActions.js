var AppStore = require("stores/AppStore");
var ajax = require("ajax");

exports.fetchFromURL = function(url) {
  ajax({ url }).then(function(payload) {
    AppStore.inject(payload);
  });
};

exports.useBlob = function(reportBlob) {
  AppStore.inject(reportBlob);
};