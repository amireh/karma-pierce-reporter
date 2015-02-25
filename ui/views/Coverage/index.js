var React = require("react");
var CoverageView = require("./components/CoverageView");
var { shape, string } = React.PropTypes;
var AppStore = require("stores/AppStore");
var { QUERY_ON, QUERY_OFF } = require("constants");

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

    return (
      <CoverageView
        mode={query.mode}
        scope={query.scope}
        hierarchical={query.flat === QUERY_OFF}
        database={AppStore.getDatabase(query.flat === QUERY_OFF)}
      />
    );
  }
});

module.exports = Coverage;