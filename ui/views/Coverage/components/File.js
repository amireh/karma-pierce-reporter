var React = require("react");
var classSet = require("react/lib/cx");
var Button = require("components/Button");
var Status = require("components/Status");
var { adjustQuery } = require("actions/RouteActions");
var { MODE_NORMAL, MODE_DETAILED_BREAKDOWN, TAB_SOURCE } = require("constants");
var { Link } = require("react-router");
var { oneOf, string } = React.PropTypes;
var fmt = function(number) {
  return Math.round(number);
};

var File = React.createClass({
  displayName: "File",

  propTypes: {
    path: string,
  },

  getDefaultProps: function() {
    return {
      detailMode: MODE_NORMAL,
      fullPath: true,

      v: 0,
      sc: 0,
      sv: 0,
      svc: 0,
      bc: 0,
      bv: 0,
      bvc: 0,
      fc: 0,
      fv: 0,
      fvc: 0,
      lc: 0,
      lv: 0,
      lvc: 0,
    };
  },

  render: function () {
    var { status, v, detailMode } = this.props;
    var { props } = this;
    var className = classSet({
      "File": true
    });

    return (
      <tr className={className}>
        <td className="File__Path">
          <Link to={"/files/" + this.props.id}>
            <Status coverage={v}>
              {this.props.fullPath ? this.props.id : this.props.path}
            </Status>
          </Link>
        </td>

        {detailMode === MODE_NORMAL &&
          <Status tagName="td" coverage={v} fill key="v">
            {fmt(this.props.v)}%
          </Status>
        }

        {detailMode !== MODE_NORMAL &&
          ["s","b","f","l"].map(this.renderMetric)
        }
      </tr>
    );
  },

  renderMetric(metric) {
    var { detailMode } = this.props;

    return (
      <Status key={metric} tagName="td" coverage={this.props[metric+"v"]} fill>
        {fmt(this.props[metric + "v"])}%

        {detailMode === MODE_DETAILED_BREAKDOWN && [
          <span children=" " />,
          <span className="File__MetricBreakdown">
            ({this.props[metric + "vc"]}/{this.props[metric + "c"]})
          </span>
        ]}
      </Status>
    );
  }
});

module.exports = File;