var React = require("react");
var App = require("./components/App");
var AppStore = require("stores/AppStore");

var Coverage = React.createClass({
  render: function () {
    var { hierarchical } = this.props.query;

    return (
      <App
        database={AppStore.getDatabase(hierarchical)}
        {...this.props.query}
      />
    );
  }
});

module.exports = Coverage;