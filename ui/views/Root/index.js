var React = require("react");
var Router = require("react-router");
var App = require("./components/App");
var AppStore = require("stores/AppStore");
var AppActions = require("actions/AppActions");
var RouteActions = require("actions/RouteActions");
var Comlink = require("Comlink");
var config = require("config");

var Root = React.createClass({
  mixins: [ Router.Navigation, Router.State ],

  getDefaultProps: function() {
    return {
      query: {}
    };
  },

  componentDidMount: function() {
    var reportURL = this.props.query.url || config.reportPath;

    RouteActions.assignDelegate(this);
    AppStore.addChangeListener(this.reload);

    if (config.reportBlob) {
      AppActions.useBlob(config.reportBlob);
    }
    else if (reportURL) {
      AppActions.fetchFromURL(reportURL);
    }

    if (config.websocketSupport) {
      Comlink.getSingleton().connect(() => {
        if (this.isMounted() && !reportURL && !config.reportBlob) {
          AppActions.fetchFromWebSocket();
        }
      });
    }
  },

  componentWillUnmount: function() {
    Comlink.getSingleton().disconnect();

    AppStore.removeChangeListener(this.reload);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.query.url !== this.props.query.url) {
      if (this.props.query.url) {
        AppActions.fetchFromURL(this.props.query.url);
      }
    }
  },

  reload: function() {
    this.forceUpdate();
  },

  render: function () {
    var hierarchical = !!this.props.query.hierarchical;

    return (
      <App
        database={AppStore.getDatabase(hierarchical)}
        hierarchical={hierarchical}
        {...this.props}
      />
    );
  }
});

module.exports = Root;