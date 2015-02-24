var React = require("react");
var { sortBy } = require("lodash");
var File = require("./File");
var {
  Table,
  Column,
  Mixin:SortableTableMixin
} = require("components/SortableTable");
var { func } = React.PropTypes;
var { SORT_DESC, MODE_NORMAL } = require("constants");

var FileListing = React.createClass({
  displayName: "FileListing",
  mixins: [ SortableTableMixin ],

  getInitialState: function() {
    return {
      sortKey: "id"
    };
  },

  getDefaultProps: function() {
    return {
      files: []
    };
  },

  render: function () {
    var files = sortBy(this.props.files, this.state.sortKey);
    var hasFiles = files.length > 0;

    if (this.state.sortOrder === SORT_DESC) {
      files = files.reverse();
    }

    return (
      <div className="FileBrowser">
        <p>
          {hasFiles && <span>Showing {files.length} files.</span>}
          {!hasFiles && <em>No files at this level.</em>}
        </p>

        {hasFiles && <Table ref="sortableTable">
          <thead>
            <tr>
              <Column sortKey="id">Name</Column>

              {this.props.detailMode === MODE_NORMAL &&
                <Column key="v" sortKey="v">Coverage</Column>
              }

              {this.props.detailMode !== MODE_NORMAL && [
                <Column key="sv" sortKey="sv">Statements</Column>,
                <Column key="bv" sortKey="bv">Branches</Column>,
                <Column key="fv" sortKey="fv">Functions</Column>,
                <Column key="lv" sortKey="lv">Lines</Column>,
              ]}
            </tr>
          </thead>

          <tbody>
            {files.map(this.renderFile)}
          </tbody>
        </Table>}
      </div>
    );
  },

  renderFile: function(product) {
    return (
      <File
        key={product.id}
        detailMode={this.props.detailMode}
        fullPath={!this.props.hierarchical}
        {...product} />
    );
  }
});

module.exports = FileListing;