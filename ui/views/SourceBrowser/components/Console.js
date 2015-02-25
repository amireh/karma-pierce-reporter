var React = require("react");
var Highlight = require("jsx!react-highlight/optimized.jsx");

var Console = React.createClass({
  render() {
    return(
      <div className="console">
        <Highlight languages={["javascript"]}>{this.props.children}</Highlight>
      </div>
    );
  }
});

module.exports = Console;