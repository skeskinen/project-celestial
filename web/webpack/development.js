var baseConfig = require('./base.config');
var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(require('./isomorphic')).development();

module.exports = (port) => {
  var devConfig = baseConfig;
  devConfig.output.publicPath = `http://localhost:${port}/`;

  devConfig.devtool = 'eval';
  devConfig.entry.unshift('webpack/hot/only-dev-server');
  devConfig.entry.unshift(`webpack-dev-server/client?http://localhost:${port}`);
  devConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());

  devConfig.plugins.unshift(webpackIsomorphicToolsPlugin);
  return devConfig;
};
