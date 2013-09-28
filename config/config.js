// Dependencies
var path = require('path'),
  AWS = require('aws-sdk'),
  rootPath = path.normalize(path.join(__dirname, '..')),
  
  //Environment variables
  env = process.env.NODE_ENV || 'production',
  uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/dev-production',
  config;

// Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY, 
  secretAccessKey: process.env.AWS_SECRET_KEY, 
  region: process.env.AWS_REGION
});

config = {
  development: {
    root: rootPath,
    app: {
      name: 'dev'
    },
    port: process.env.PORT || 3000,
    db: uristring
  },

  test: {
    root: rootPath,
    app: {
      name: 'test'
    },
    port: process.env.PORT || 3000,
    db: uristring
  },

  production: {
    root: rootPath,
    app: {
      name: 'production'
    },
    port: process.env.PORT || 3000,
    db: uristring
  }
};

module.exports = config[env];
