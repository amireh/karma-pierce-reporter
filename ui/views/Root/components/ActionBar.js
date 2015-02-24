var React = require("react");
var Button = require("components/Button");
var AppActions = require("actions/AppActions");
var RouteActions = require("actions/RouteActions");

var ActionBar = React.createClass({
  displayName: "ActionBar",

  getDefaultProps: function() {
    return {
      query: {}
    };
  },

  render: function() {
    return(
      <div className="ActionBar">
        <Button
          onClick={AppActions.downloadDatabase}
          children="Download Coverage Report"
        />

        <label>
          <input
            type="checkbox"
            checked={this.props.query.hierarchical === "1"}
            onChange={this.toggleHierarchicalMode}
          />

          Hierarchical View
        </label>

        {" "}

        <label>
          Mode
          {" "}
          <select value={this.props.query.detail} onChange={this.changeDetailMode}>
            <option value="__none__">Compact</option>
            <option value="breakdown">Breakdown</option>
            <option value="breakdown_detailed">Detailed Breakdown</option>
          </select>
        </label>
      </div>
    );
  },

  toggleHierarchicalMode: function() {
    RouteActions.updateQuery({
      hierarchical: this.props.query.hierarchical === "1" ? undefined : "1"
    });
  },

  changeDetailMode: function(e) {
    var mode = e.target.value;

    RouteActions.updateQuery({
      mode: mode === "__none__" ? undefined : mode
    });
  }
});

module.exports = ActionBar;