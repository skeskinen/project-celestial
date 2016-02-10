/* eslint no-console:0 */
process.env.UV_THREADPOOL_SIZE = 100;
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var path = require('path');

var port = process.env.PORT || 5001;
var config = require('./development')(port);

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  contentBase: path.join(__dirname, '..', 'public'),
  quiet: true,
  lazy: false,
  inline: true,
  compress: true
}).listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
  }

  console.log(`Webpack dev server at ${port}`);
});
