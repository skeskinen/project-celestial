var fs = require('fs');
var path = require('path');

var express = require('express');
var app = express();

var compress = require('compression');

if (process.env.NODE_ENV === 'production') {
  app.use(compress());

  app.use('/static', express.static(path.join(__dirname, 'dist')));

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  var port = Number(process.env.PORT || 3001);
  app.listen(port, function() {
    console.log(`server running at http://localhost:${port}`);
  });
} else {
  var webpack = require('webpack');
  var config = require('./webpack/development');
  var compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  // app.get('*', function(req, res) {
  //   res.sendFile(path.join(__dirname, 'index.html'));
  // });

  app.listen(3000, 'localhost', function(err) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Listening at http://localhost:3000');
  });
}
