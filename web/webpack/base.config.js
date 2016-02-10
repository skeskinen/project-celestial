var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var autoprefixer = require('autoprefixer');
var precss       = require('precss');

var clientVariables =  {
  'process.env.BACKEND_HOST': process.env.BACKEND_HOST ? JSON.stringify(process.env.BACKEND_HOST) : 'undefined',
  'process.env.NODE_ENV': process.env.NODE_ENV ? JSON.stringify(process.env.NODE_ENV) : 'undefined',
  '__CLIENT__': JSON.stringify(true),
};

module.exports = {
  context: path.join(__dirname, '..'),
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'b[hash]/bundle.js'
  },
  entry: ['./client'],
  module: {
    loaders: [
      { test: /three\/examples/, loader: 'imports?THREE=three' },
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' },
      { test: /\.js$/, loaders: ['react-hot', 'babel'], include: [
        path.join(__dirname, '..'),
        path.join(__dirname, '../../game')
      ] },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style',
        'css!postcss!sass')},
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 versions')},
      { test: /\.(png|jpg|ico|woff|woff2|eot|ttf)$/, loader: 'url?limit=10240' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(yml|yaml)$/, loader: 'json!yaml' },
      { test: /\.svg$/, loader: 'svg-inline' },
    ],
  },
  postcss: function() {
    return [autoprefixer, precss];
  },
  resolve: {
    modulesDirectories: ['web_modules', 'node_modules'],
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin(clientVariables),
    new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
  ],
};
