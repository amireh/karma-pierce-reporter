var path = require("path");
var extend = require("lodash").extend;

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
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?presets[]=es2015&presets[]=react',
        include: [
          path.resolve(__dirname, '..', 'ui')
        ]
      },

      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
        include: [
          path.resolve(__dirname, '..', 'ui')
        ]
      },

      {
        test: /\.less$/,
        loader: "style-loader!css-loader?importLoaders=1!less-loader",
        include: [
          path.resolve(__dirname, '..', 'ui')
        ]
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
  return extend({}, baseConfig, overrides);
};
