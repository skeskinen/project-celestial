// environment variables injected by webpack DefinePlugin
module.exports = {
  BACKEND_HOST: process.env.BACKEND_HOST || 'default-host.com',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
