var React = require("react");
var AnnotatedSource = require("models/AnnotatedSource");
var Highlight = require("components/Highlight");

var Console = React.createClass({
  render() {
    return(
      <div className="console">
        <Highlight children={AnnotatedSource(this.props.file)} />
      </div>
    );
  }
});

module.exports = Console;