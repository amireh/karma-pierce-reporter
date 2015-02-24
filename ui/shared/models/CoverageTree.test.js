var subject = require("./CoverageTree");
var fmt = function(o, whitespace) { return JSON.stringify(o, undefined, whitespace); };
var { pluck } = require("lodash");
var PREFIXES = [ "screens/" ];

describe("shared/models/CoverageTree", function() {
  it("should group by screen", function() {
    var output = subject({
      "a": { path: "/.../jsapp/screens/AuthorSurveyResults/index.js" },
      "b": { path: "/.../jsapp/screens/AuthorSurveyResults/components/Something.js" },
      "c": { path: "/.../jsapp/screens/AuthorSurveyResults/shared/constants.js" },
      "d": { path: "/.../jsapp/shared/utils/debounce.js" },
    }, {
      modulePrefixes: PREFIXES,
      keepPrefix: false,
      sourceRoot: "jsapp"
    });

    expect(fmt(pluck(output.scopes, "name").sort())).to.equal(
      fmt([ "AuthorSurveyResults" ])
    );

    expect(fmt(pluck(output.files, "id").sort())).to.equal(
      fmt([ "/shared/utils/debounce.js" ])
    );
  });

  describe("options.keepPrefix", function() {
    it("should keep the module prefix in the scope name when on", function() {

      var output = subject({
        "a": { path: "/.../jsapp/screens/AuthorSurveyResults/index.js" },
        "b": { path: "/.../jsapp/screens/AuthorSurveyResults/components/Something.js" },
        "c": { path: "/.../jsapp/screens/AuthorSurveyResults/shared/constants.js" },
        "d": { path: "/.../jsapp/shared/utils/debounce.js" },
      }, { modulePrefixes: PREFIXES, keepPrefix: true });

      expect(fmt(pluck(output.scopes, "name").sort())).to.equal(
        fmt([ "screens/AuthorSurveyResults" ])
      );
    });
  });

  it("should build a scope tree", function() {
    var output = subject({
      "a": { path: "/.../jsapp/screens/A/index.js" },
      "b": { path: "/.../jsapp/screens/A/components/Something.js" },
      "c": { path: "/.../jsapp/screens/A/screens/AB/index.js" },
      "d": { path: "/.../jsapp/screens/A/screens/AB/shared/Actions.js" },
      "e": { path: "/.../jsapp/screens/B/index.js" },
      "f": { path: "/.../jsapp/shared/utils/debounce.js" },
    }, { modulePrefixes: PREFIXES, keepPrefix: false });

    expect(output.scopes.length).to.equal(2);

    expect(fmt(pluck(output.scopes, "name").sort())).to.equal(
      fmt([ "A", "B" ])
    );
  });

  it("should nest scopes", function() {
    var output = subject({
      "a": { path: "/.../jsapp/screens/AuthorSurveyQuestions/index.js" },
      "b": { path: "/.../jsapp/screens/AuthorSurveyQuestions/components/Something.js" },
      "c": { path: "/.../jsapp/screens/AuthorSurveyQuestions/shared/constants.js" },
      "d": { path: "/.../jsapp/screens/AuthorSurveyQuestions/screens/Questions/index.js" }
    }, { modulePrefixes: PREFIXES, keepPrefix: false });

    expect(fmt(pluck(output.scopes, "name").sort())).to.equal(
      fmt([ "AuthorSurveyQuestions" ])
    );

    expect(fmt(pluck(output.scopes[0].files, "path").sort())).to.equal(
      fmt([
        "/index.js",
        "/components/Something.js",
        "/shared/constants.js",
      ].sort())
    );

    expect(output.scopes[0].scopes.length).to.equal(1);

    expect(fmt(pluck(output.scopes[0].scopes[0].files, "path").sort())).to.equal(
      fmt(
        [
          "/index.js",
        ].sort()
      )
    );
  });
});