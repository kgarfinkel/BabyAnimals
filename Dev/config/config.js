var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

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
      name: 'dev'
    },
    port: 3000,
    db: 'mongodb://localhost/dev-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'dev'
    },
    port: 3000,
    db: 'mongodb://localhost/dev-production'
  }
};

module.exports = config[env];