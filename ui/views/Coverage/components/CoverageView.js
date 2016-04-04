var React = require("react");
var Layout = require("components/Layout");
var Scope = require("./Scope");
var ScopeNavigation = require("./ScopeNavigation");
var ActionBar = require("./ActionBar");
var scrollIntoView = require("utils/scrollIntoView");
var classSet = require("react/lib/cx");
var { string } = React.PropTypes;

var CoverageView = React.createClass({
  propTypes: {
    // comes from query, will be scrolled down to
    scope: string
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

  scrollScopeIntoView: function() {
    scrollIntoView(`[data-scroll-id="${this.props.scope}"`, Layout.getTabsHeight());
  },

  render() {
    var hierarchical = this.props.hierarchical;
    var className = classSet({
      'coverage': true,
      'coverage--listing': !hierarchical,
      'coverage--tree': !!hierarchical
    });

    return(
      <Layout className={className}>
        {hierarchical &&
          <Layout.Sidebar>
            <ScopeNavigation
              database={this.props.database}
              focusedScopeId={this.props.scope}
            />
          </Layout.Sidebar>
        }

        <Layout.ActionBar>
          <ActionBar
            mode={this.props.mode}
            hierarchical={hierarchical}
            grep={this.props.query.grep}
          />
        </Layout.ActionBar>

        <Layout.Content>
          <Scope
            detailMode={this.props.mode}
            hierarchical={hierarchical}
            {...this.props.database}
          />
        </Layout.Content>
      </Layout>
    );
  }
});

module.exports = CoverageView;