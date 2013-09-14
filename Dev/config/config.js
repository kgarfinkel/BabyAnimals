var path = require('path');
var AWS = require('aws-sdk');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

//change in credentials.json?
var accessKeyId =  process.env.AWS_ACCESS_KEY || 'AKIAJ3EEY33ATJFGVT';
var secretAccessKey = process.env.AWS_SECRET_KEY || "NULhNJcpos/BkT9zLorP9WlOjAFqjYEpSvJkB5m7";

//updata amazon credentials
AWS.config.update({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});

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
  }
};

module.exports = config[env];
module.exports.accessKeyId = accessKeyId;
module.exports.secretAccessKey = secretAccessKey;