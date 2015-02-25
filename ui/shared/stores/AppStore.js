var Store = require("Store");
var ajax = require("ajax");
var CoverageTree = require("models/CoverageTree");
var Coverage = require("models/Coverage");
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
    var coverageTree = CoverageTree(report, {
      sourceRoot: config.sourceRoot,
      modulePrefixes: config.groupBy,
      keepPrefixes: config.keepGroupNames
    });

    this.setState({
      hierarchicalCoverage: coverageTree,
      coverage: Coverage(coverageTree)
    });
  }

  getDatabase(hierarchical) {
    return hierarchical ?
      this.state.hierarchicalCoverage :
      this.state.coverage
    ;
  }

  getFileById(fileId) {
    if (this.state.coverage) {
      return findWhere(this.state.coverage.files, { id: fileId });
    }
  }
};

module.exports = new AppStore();