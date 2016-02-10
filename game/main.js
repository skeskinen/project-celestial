require('babel-register');
if (process.env.NODE_ENV !== 'production')
  if (!require("piping")()) { return; }

require('./server');
