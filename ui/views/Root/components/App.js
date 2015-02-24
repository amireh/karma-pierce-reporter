var React = require("react");
var ActionBar = require("./ActionBar");
var Scope = require("./Scope");

var App = React.createClass({
  displayName: "App",

  getDefaultProps: function() {
    return {
      database: {},
      query: {}
    };
  },

  render: function () {
    return (
      <div>
        <ActionBar query={this.props.query} />

        <div className="Content">
          <Scope
            detailMode={this.props.query.mode}
            hierarchical={this.props.query.hierarchical}
            {...this.props.database}
          />
        </div>
      </div>
    );
  }
});

module.exports = App;
