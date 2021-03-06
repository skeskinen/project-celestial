var path = require('path');
var webpack = require('webpack');

var clientVariables =  {
  'process.env.BACKEND_HOST': process.env.BACKEND_HOST ? JSON.stringify(process.env.BACKEND_HOST) : 'undefined',
  'process.env.NODE_ENV': process.env.NODE_ENV ? JSON.stringify(process.env.NODE_ENV) : 'undefined',
  '__CLIENT__': JSON.stringify(true),
};

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    //'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './web/index'
  ],
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(clientVariables),
  ],
  module: {
    loaders: [
    { test: /three\/examples/, loader: 'imports?THREE=three' },
    { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' },
    { test: /\.js$/, loaders: ['babel'], include: [
      path.join(__dirname, '..'),
      path.join(__dirname, '../../game')
    ] },
    { test: /\.(png|jpg|ico|woff|woff2|eot|ttf)$/, loader: 'url?limit=10240' },
    { test: /\.json$/, loader: 'json' },
    { test: /\.(yml|yaml)$/, loader: 'json!yaml' },
    { test: /\.svg$/, loader: 'svg-inline' },
    ]
  }
};
