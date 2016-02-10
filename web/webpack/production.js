var base = require('./base.config');
var path = require('path');
var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(require('./isomorphic'));

var prodConfig = base;

prodConfig.output.publicPath = `http://localhost:5000/public/`;

prodConfig.plugins = prodConfig.plugins.concat([
	webpackIsomorphicToolsPlugin,
	new webpack.optimize.DedupePlugin(),
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}   
	}), 
	]);


module.exports = prodConfig;
