var AppStore = require("stores/AppStore");
var Comlink = require("Comlink");
var ajax = require("ajax");

exports.fetchFromURL = function(url) {
  console.log("Fetching from URL:", url);

  ajax({ url }).then(function(payload) {
    AppStore.inject(payload);
  });
};

exports.fetchFromWebSocket = function() {
  Comlink.getSingleton().fetchReport();
};

exports.useBlob = function(reportBlob) {
  AppStore.inject(reportBlob);
};