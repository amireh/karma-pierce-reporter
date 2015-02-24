var React = require("react");
var Router = require("react-router");
var RouteActions = require("actions/RouteActions");
var getConfig = require("getConfig");
var AppStore = require("stores/AppStore");
var AppActions = require("actions/AppActions");

var { element } = React.PropTypes;
var { RouteHandler } = Router;

var Root = React.createClass({
  mixins: [ Router.Navigation, Router.State ],

  getDefaultProps() {
    return {
      query: {}
    };
  },

  componentDidMount: function() {
    RouteActions.assignDelegate(this);
    AppStore.addChangeListener(this.reload);

    this.populate();
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this.reload);
    RouteActions.assignDelegate(undefined);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.query.url !== this.props.query.url) {
      if (this.props.query.url) {
        AppActions.fetchFromURL(this.props.query.url);
      }
    }
  },

  render() {
    return (
      <RouteHandler
        config={getConfig()}
        {...this.props}
      />
    );
  },

  populate: function() {
    var config = getConfig();
    var reportURL = this.props.query.url;

    if (reportURL) {
      AppActions.fetchFromURL(reportURL);
    }
    else if (config.reportBlob) {
      AppActions.useBlob(config.reportBlob);
    }
  },

  reload: function() {
    console.debug('Root: Rendering.');

    this.forceUpdate();
  },
});

module.exports = Root;