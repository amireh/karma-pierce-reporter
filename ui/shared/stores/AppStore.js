var Store = require("Store");
var ajax = require("ajax");
var Coverage = require("models/Coverage");

class AppStore extends Store {
  getInitialState() {
    return {
      coverage: null,
      hierarchicalCoverage: null
    };
  }

  load() {
    // ajax({
    //   url: "/dist/database.json"
    // }).then((report) => {
    //   this.inject(report);
    // });
  }

  inject(report) {
    var coverage = Coverage(report, {
      grep: this.state.grep
    });

    this.setState({
      hierarchicalCoverage: coverage,
      coverage: Coverage.flatten(coverage)
    });
  }

  setGrep(grep) {
    this.setState({ grep });
  }

  getDatabase(hierarchical) {
    return hierarchical ?
      this.state.hierarchicalCoverage :
      this.state.coverage
    ;
  }

  getGrep() {
    return this.state.grep;
  }
};

module.exports = new AppStore();