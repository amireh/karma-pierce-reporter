var React = require("react");
var Router = require("react-router");
var TestLocation = require("react-router/modules/locations/TestLocation");

var SinkRoute = React.createClass({
  render: function() {
    return null;
  }
});

module.exports = function(suite, type, options) {
  var container, subject;
  var routes = [];
  var { initialProps, tagName } = options;

  // @private
  //
  // Resolve the appropriate factory to use for creating the subject instances.
  //
  // This needs to be abstracted because the factory is different based on
  // whether we need to use the ReactRouter or not.
  var getFactory = function(onFactoryResolved) {
    var router;
    var yieldFactory = function(factory) {
      onFactoryResolved(React.createElement(factory, initialProps));
    };

    if (routes.length) {
      router = suite.router = Router.create({
        routes: routes,
        location: "/"
      });

      // Must override this as of 0.11.6 because it breaks if we're not using
      // a Location object:
      router.teardown = function() {};

      router.run(yieldFactory);
    }
    else {
      yieldFactory(type);
    }
  };

  /**
   * @public
   *
   * Use this to define any routes that are linked to from the component you're
   * testing (i.e. using <Link /> components). This will cause the subject to be
   * mounted within an actual ReactRouter app context.
   *
   * @param  {Object[]} routeSpecs
   *         Definitions of the routes that your subject component links to.
   *         Each definition consists of a "name" and "path" values.
   *
   * @example
   *
   *     var reactSuite = require("test_helpers/reactSuite");
   *     var Subject = React.createClass({
   *       render: function() {
   *         return (
   *           <div>
   *             <Link to="author.surveys">Surveys</Link>
   *           </div>
   *         );
   *       }
   *     });
   *
   *     describe("MyComponent", function() {
   *       var suite = reactSuite(this, Subject);
   *
   *       suite.stubRoutes([
   *         { name: "author.surveys", path: "/author/surveys" }
   *       ]);
   *
   *       it("should mount", function() {
   *         // no ReactRouter warnings; everything is tied up properly now
   *         expect(subject.isMounted()).to.equal(true);
   *       });
   *     });
   */
  this.stubRoutes = function(routeSpecs) {
    var { Route } = Router;
    var defaultRoute = <Route name="__default__" path="/" handler={type} />;

    routes = [ defaultRoute ].concat(routeSpecs.map(function(spec) {
      return (
        <Route
          name={spec.name}
          path={spec.path}
          handler={spec.handler || SinkRoute}
        />
      );
    }));
  };

  this.createSubject = function(onSubjectResolved) {
    getFactory(function(factory) {
      container = document.createElement(tagName || "div");
      subject = React.render(factory, container);

      onSubjectResolved(subject, container);
    });
  };

  this.getSubject = function() {
    return subject;
  };

  this.removeSubject = function() {
    subject = undefined;
    React.unmountComponentAtNode(container);
    container.remove();
    container = undefined;
  };

  return this;
};