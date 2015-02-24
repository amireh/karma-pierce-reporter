var Subject = require("./index");
var reactSuite = require("test_helpers/reactSuite");

describe(Subject, function() {
  var suite = reactSuite(this, Subject);

  // suite.stubRoutes([]);

  xit("should render", function() {
    expect(subject.isMounted()).to.equal(true);
  });
});
