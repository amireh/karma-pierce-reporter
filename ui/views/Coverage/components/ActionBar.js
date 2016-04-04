var React = require("react");
var Button = require("components/Button");
var AppActions = require("actions/AppActions");
var RouteActions = require("actions/RouteActions");
var { QUERY_ON, QUERY_OFF } = require("constants");

var ActionBar = React.createClass({
  getDefaultProps: function() {
    return {
      hierarchical: false,
      mode: QUERY_OFF
    };
  },

  render: function() {
    return(
      <div className="listing__action-bar">
        <label>
          <input
            type="checkbox"
            checked={this.props.hierarchical}
            onChange={this.toggleHierarchicalMode}
          />
          {" "}
          Hierarchical View
        </label>

        {" | "}

        <label>
          Mode
          {" "}
          <select value={this.props.mode} onChange={this.changeDetailMode}>
            <option value="off">Compact</option>
            <option value="breakdown">Breakdown</option>
            <option value="breakdown_detailed">Detailed Breakdown</option>
          </select>
        </label>
        {" | "}

        <label>
          Grep
          {" "}

          <input
            type="text"
            defaultValue={this.props.grep}
            ref="grep"
            className="action-bar__grep"
            onKeyUp={this.grepOnReturn}
          />

          <button type="button" onClick={this.adjustGrep}>Apply</button>
        </label>
      </div>
    );
  },

  toggleHierarchicalMode: function() {
    RouteActions.updateQuery({
      flat: this.props.hierarchical ? QUERY_ON : QUERY_OFF
    });
  },

  changeDetailMode: function(e) {
    var mode = e.target.value;

    RouteActions.updateQuery({
      mode: mode === "off" ? QUERY_OFF : mode
    });
  },

  adjustGrep: function() {
    var grep = this.refs.grep.getDOMNode().value || '';

    RouteActions.updateQuery({
      grep: grep.length === 0 ? QUERY_OFF : grep
    });
  },

  grepOnReturn(e) {
    if (e.keyCode === 13) {
      this.adjustGrep();
    }
  }
});

module.exports = ActionBar;