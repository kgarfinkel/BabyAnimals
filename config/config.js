// Dependencies
var path = require('path'),
  AWS = require('aws-sdk'),
  rootPath = path.normalize(path.join(__dirname, '..')),
  env = process.env.NODE_ENV || 'development',

  //TODO: move to credentials.json
  accessKeyId = process.env.AWS_ACCESS_KEY,
  secretAccessKey = process.env.AWS_SECRET_KEY,
  bucket = process.env.AWS_BUCKET || 'babyanimals',
  path = process.env.LOCAL_FILE_PATH,
  config;

//TODO: move to credentials.json
AWS.config.update({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: 'us-west-1'});

config = {
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
  }
};

module.exports = config[env];
