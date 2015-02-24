var Subject = require("./File");
var reactSuite = require("test_helpers/reactSuite");

describe(Subject, function() {
  reactSuite(this, Subject, {
    tagName: "table"
  });

  it("should render", function() {
    expect(subject.isMounted()).to.equal(true);
  });
});
