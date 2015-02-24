var React = require("react");
var FileBrowser = require("./FileBrowser");
var Status = require("components/Status");
var { string, arrayOf, shape, number } = React.PropTypes;

var Scope = React.createClass({
  displayName: "Scope",

  propTypes: {
    name: string,
    files: arrayOf(shape()),
    scopes: arrayOf(shape()),
    level: number
  },

  getInitialState: function() {
    return {
      collapsed: false
    };
  },

  getDefaultProps() {
    return {
      v: 0,
      level: 1,
      files: [],
      scopes: []
    };
  },

  render() {
    return(
      <div data-scroll-id={this.props.name}>
        <h2 onClick={this.toggleCollapsedState}>
          {this.props.name}

          {this.props.files.length > 0 && [
            <span key="ws" children=" " />,
            <Status coverage={this.props.v} key="v">
              ({this.props.v.toFixed(2)}%)
            </Status>
          ]}
        </h2>

        <div className="indent">
          {!this.state.collapsed &&
            <FileBrowser
              detailMode={this.props.detailMode}
              hierarchical={this.props.hierarchical}
              files={this.props.files}
            />
          }
          {this.renderChildScopes()}
        </div>
      </div>
    );
  },

  toggleCollapsedState: function() {
    this.setState({ collapsed: !this.state.collapsed });
  },

  renderChildScopes() {
    var level = this.props.level + 1;
    var { detailMode, hierarchical } = this.props;

    return this.props.scopes.map(function(scope) {
      return (
        <Scope
          key={scope.name}
          detailMode={detailMode}
          hierarchical={hierarchical}
          level={level}
          {...scope}
        />
      );
    });
  }
});

module.exports = Scope;