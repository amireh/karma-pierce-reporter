var React = require("react");
var Console = require("./components/Console");
var AppStore = require("stores/AppStore");
var RouteActions = require("actions/RouteActions");
var Layout = require("components/Layout");

var SourceBrowser = React.createClass({
  render() {
    var filePath = this.props.params.splat;
    var currentFile = AppStore.getFileById(filePath);

    return(
      <Layout>
        {currentFile &&
          <Layout.Content>
            <Console>{currentFile.code}</Console>
          </Layout.Content>
        }
      </Layout>
    );
  }
});

module.exports = SourceBrowser;