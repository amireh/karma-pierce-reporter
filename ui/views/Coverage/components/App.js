var React = require("react");
var ActionBar = require("./ActionBar");
var Scope = require("./Scope");
var ScopeNavigation = require("./ScopeNavigation");
var classSet = require("react/lib/cx");
var scrollIntoView = require("utils/scrollIntoView");
var { string } = React.PropTypes;

var App = React.createClass({
  propTypes: {
    mode: string,
    hierarchical: string,
    detail: string,
    scope: string
  },

  getDefaultProps: function() {
    return {
      database: {},
      hierarchical: undefined,
      detail: undefined,
      mode: undefined,
      scope: undefined
    };
  },


  componentDidMount: function() {
    if (this.props.scope) {
      this.scrollScopeIntoView();
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.scope) {
      this.scrollScopeIntoView();
    }
  },

  render: function () {
    var { hierarchical } = this.props;
    var className = classSet({
      'coverage': true,
      'coverage--with-navigation': !!hierarchical
    });

    return (
      <div className={className}>
        <ActionBar
          detail={this.props.detail}
          hierarchical={this.props.hierarchical}
        />

        {this.props.hierarchical &&
          <ScopeNavigation
            database={this.props.database}
            focusedScopeId={this.props.scope}
          />
        }

        <div className="Content">
          <Scope
            detailMode={this.props.mode}
            hierarchical={this.props.hierarchical}
            {...this.props.database}
          />
        </div>
      </div>
    );
  },

  scrollScopeIntoView: function() {
    scrollIntoView(`[data-scroll-id="${this.props.scope}"`);
  }
});

module.exports = App;
