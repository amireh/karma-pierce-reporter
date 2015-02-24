var Subject = require("./Scope");
var reactSuite = require("test_helpers/reactSuite");

describe(Subject, function() {
  reactSuite(this, Subject);

  it("should render", function() {
    expect(subject.isMounted()).to.equal(true);
  });
});
