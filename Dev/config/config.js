var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'dev'
    },
    port: 3000,
    db: 'mongodb://localhost/dev-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'test'
    },
    port: 3000,
    db: 'mongodb://localhost/dev-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'prod'
    },
    port: 3000,
    db: 'mongodb://localhost/dev-production'
  }
};

module.exports = config[env];