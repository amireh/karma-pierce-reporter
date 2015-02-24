var { MOCHA_SOCKET_URL } = require("constants");
var AppStore = require("stores/AppStore");
var RouteActions = require("actions/RouteActions");

class Comlink {
  static getSingleton() {
    if (!Comlink.__singleton__) {
      Comlink.__singleton__ = new Comlink();
    }

    return Comlink.__singleton__;
  }

  constructor() {
    this._pendingCallbacks = [];
  }

  connect(onConnected) {
    var socket = this.socket = new WebSocket(MOCHA_SOCKET_URL);

    socket.onopen = () => {
      console.info("Comlink: connected.");

      if (onConnected) {
        onConnected();
      }

      if (this._pendingCallbacks.length) {
        console.debug("Comlink: invoking %d pending callbacks.", this._pendingCallbacks.length);
      }

      this._pendingCallbacks.forEach(function(callback) {
        callback();
      });

      this._pendingCallbacks = [];
    };

    socket.onmessage = (payload) => {
      var message = JSON.parse(payload.data);

      AppStore.setGrep(message.grep);
      AppStore.inject(JSON.parse(message.report));

      RouteActions.updateQuery({ grep: message.grep });
    };
  }

  fetchReport() {
    this.send({ id: "get_report" });
  }

  send(message) {
    this.ready(() => {
      this.socket.send(JSON.stringify(message));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.off();
      this.socket = null;
    }
  }

  ready(callback) {
    if (!this.socket) {
      this._pendingCallbacks.push(callback);
    }
    else {
      callback();
    }
  }
}

module.exports = Comlink;