var React = require("react");
var flattenScopes = require("utils/flattenScopes");
var { adjustQuery } = require("actions/RouteActions");
var { Link } = require("react-router");
var Indent = require("components/Indent");
var { shape } = React.PropTypes;

var ScopeNavigation = React.createClass({
  displayName: "ScopeNavigation",

  propTypes: {
    database: shape
  },

  getDefaultProps: function() {
    return {
      database: { scopes: [] }
    };
  },

  render() {
    var scopes = [];

    if (this.props.database) {
      scopes = flattenScopes(this.props.database);
    }

    window.flattenedScopes = scopes;

    return(
      <div className="scope-navigation">
        <ul className="scope-navigation__list">
          {scopes.map(this.renderEntry)}
        </ul>
      </div>
    );
  },

  renderEntry: function(scope) {
    return (
      <li key={scope.id} className="scope-navigation__entry">
        <Indent level={scope.level} />

        <Link to="coverage" query={adjustQuery({scope: scope.name})}>
          {scope.name} ({(scope.files || []).length})
        </Link>
      </li>
    );
  }
});

module.exports = ScopeNavigation;