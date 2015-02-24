var Store = require("Store");
var ajax = require("ajax");
var CoverageTree = require("models/CoverageTree");
var Coverage = require("models/Coverage");

class AppStore extends Store {
  getInitialState() {
    return {
      coverage: null,
      hierarchicalCoverage: null
    };
  }

  inject(report) {
    var coverageTree = CoverageTree(report, {
      grep: this.state.grep
    });

    this.setState({
      hierarchicalCoverage: coverageTree,
      coverage: Coverage(coverageTree)
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