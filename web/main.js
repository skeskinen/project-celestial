require('babel-register');
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');

var development = process.env.NODE_ENV !== 'production';
global.__CLIENT__ = false;

if (development) {
  if (!require('piping')({hook: true})) { return; }
}

// this global variable will be used later in express middleware
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack/isomorphic'))
  .development(development)
  .server(__dirname, function() { //wait for webpack-assets.json to be created by the concurrent process
    require('./server');
  });
