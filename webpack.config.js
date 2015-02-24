var path = require("path");
var webpack = require("webpack");
var commonConfig = require("./webpack/common");
var nodeEnv = process.env.NODE_ENV || 'development';

var plugins = [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(nodeEnv)
  }),

  new webpack.optimize.DedupePlugin()
];

var entries = [
  "./ui/index.js"
];

if (process.env.NODE_ENV === "development") {
  entries.unshift("webpack/hot/dev-server");
}

if (nodeEnv === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins.push(new webpack.NoErrorsPlugin());
}

module.exports = commonConfig({
  plugins: plugins,
  entry: { index: entries },

  output: {
    path: __dirname + "/www/",
    filename: "[name].js",
    publicPath: "http://localhost:8090/"
  },

});

