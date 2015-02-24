var path = require("path");
var assign = require("react/lib/Object.assign");

// var root = path.join(__dirname, '..');
var nodeEnv = process.env.NODE_ENV;
var baseConfig = {
  devtool: nodeEnv === "production" ? null : "eval",

  resolve: {
    modulesDirectories: [
      "shared",
      "node_modules"
    ]
  },

  module: {
    // noParse: [ /node_modules/ ],
    loaders: [
      {
        test: /ui\/(.+)\.js$/,
        loader: [
          "jsx-loader?harmony&insertPragma=React.DOM",
          'wrap-loader?js',
          "react-hot"
        ].join("!")
      },

      {
        test: /ui\/(.*)\.less$/,
        loader: "style-loader!css-loader!less-loader"
      }
    ]
  },

  wrap: {
    js: {
      before: '(function(){\n',
      after: '}());'
    }
  }
};

module.exports = function(overrides) {
  return assign({}, baseConfig, overrides);
};
