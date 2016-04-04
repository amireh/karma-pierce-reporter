var React = require("react");
var CoverageView = require("./components/CoverageView");
var { shape, string } = React.PropTypes;
var AppStore = require("stores/AppStore");
var { QUERY_ON, QUERY_OFF } = require("constants");
const { assign } = require('lodash');
const { computeScopeCoverage } = require('models/Coverage');

require('./index.less');

var Coverage = React.createClass({
  propTypes: {
    query: shape({
      mode: string,
      flat: string,
      scope: string
    })
  },

  getDefaultProps: function() {
    return {
      query: {
        flat: QUERY_OFF,
        mode: QUERY_OFF,
        scope: QUERY_OFF
      }
    };
  },

  render: function () {
    var { query } = this.props;
    var { grep } = query;

    var db = AppStore.getDatabase(query.flat === QUERY_OFF);

    if (db && grep && grep.length > 0) {
      var grepRe = RegExp(grep, 'i');
      var newFiles = db.files.filter(function(x) { return x.id.match(grepRe); });
      var newCoverage = computeScopeCoverage(newFiles);

      db = assign({}, db, {
        files: newFiles,
        v: newCoverage
      });
    }

    return (
      <CoverageView
        mode={query.mode}
        scope={query.scope}
        hierarchical={query.flat === QUERY_OFF && (!grep || grep.length === 0)}
        database={db}
        query={query}
      />
    );
  }
});

module.exports = Coverage;