var Store = require("Store");
var getConfig = require("getConfig");
var { findWhere } = require("lodash");

class AppStore extends Store {
  getInitialState() {
    return {
      coverage: null,
      hierarchicalCoverage: null
    };
  }

  inject(report) {
    var config = getConfig();

    this.setState({
      report
    });
  }

  getDatabase() {
    return this.state.report;
  }
};

module.exports = new AppStore();