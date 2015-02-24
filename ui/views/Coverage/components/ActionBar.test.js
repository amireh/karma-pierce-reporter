var Subject = require("./ActionBar");
var reactSuite = require("test_helpers/reactSuite");

describe(Subject, function() {
  var suite = reactSuite(this, Subject);

  it("should render", function() {
    expect(subject.isMounted()).to.equal(true);
  });
});
