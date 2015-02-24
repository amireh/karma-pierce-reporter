var subject = require("./Coverage");
var fmt = function(o) { return JSON.stringify(o); };
var { pluck } = require("lodash");

describe("models/Coverage", function() {
  it("should group by screen", function() {
    var output = subject({
      "a": { path: "/.../jsapp/screens/AuthorSurveyResults/index.js" },
      "b": { path: "/.../jsapp/screens/AuthorSurveyResults/components/Something.js" },
      "c": { path: "/.../jsapp/screens/AuthorSurveyResults/shared/constants.js" },
      "d": { path: "/.../jsapp/shared/utils/debounce.js" },
    });

    expect(output.scopes.length).to.equal(1);
    expect(output.files.length).to.equal(1);
  });

  it("should build a scope tree", function() {
    var output = subject({
      "a": { path: "/.../jsapp/screens/A/index.js" },
      "b": { path: "/.../jsapp/screens/A/components/Something.js" },
      "c": { path: "/.../jsapp/screens/A/screens/AB/index.js" },
      "d": { path: "/.../jsapp/screens/A/screens/AB/shared/Actions.js" },
      "e": { path: "/.../jsapp/screens/B/index.js" },
      "f": { path: "/.../jsapp/shared/utils/debounce.js" },
    });

    expect(output.scopes.length).to.equal(2);

    expect(fmt(pluck(output.scopes, "name").sort())).to.equal(
      fmt([ "A", "B" ])
    );
  });

  xit("should keep child screens in path", function() {
    var output = subject({
      "a": { path: "/.../jsapp/screens/AuthorSurveyQuestions/index.js" },
      "b": { path: "/.../jsapp/screens/AuthorSurveyQuestions/components/Something.js" },
      "c": { path: "/.../jsapp/screens/AuthorSurveyQuestions/shared/constants.js" },
      "d": { path: "/.../jsapp/screens/AuthorSurveyQuestions/screens/Questions/index.js" }
    });

    expect(output.length).to.equal(1);
    expect(output[0].files.length).to.equal(4);

    expect(
      fmt(
        output[0].files.map(function(f) { return f.path; }).sort()
      )
    ).to.equal(fmt([
      "/index.js",
      "/components/Something.js",
      "/shared/constants.js",
      "/screens/Questions/index.js",
    ].sort()));
  });
});