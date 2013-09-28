var path = require('path'),
  fs = require('fs'),
  request = require('request'),
  uuid = require('node-uuid'),
  client = require('./knoxHelpers').awsClient(),
  addToDb = require('./mongoosehelpers').addToDb,
  response = require('./responseHelpers'),
  helpers = require('./helperfunctions'),
  imagePath = '/temp/uploads';

module.exports = {
  // Stream requested image to fs and store in s3 bucket
  upload: function(req, res, next) {
    var key = uuid.v4().split('-').pop();

    // If request is a url, fetch the request image and upload to s3
    if (req.query.src.indexOf('http') !== -1) {
      var outStream = fs.createWriteStream(imagePath + key + '.jpg');

      request(req.query.src).pipe(outStream);

      outStream.on('close', function() {
        client.putFile(imagePath + key + '.jpg', key, function(err, resp) {
          if (resp.statusCode === 200) {
            addToDb(req, res, key);
            response.postRes(req, res, key);
          } else {
            errRes(req, res, 500);
          }
        });
      });
    } else {
      // if the request is a local path, upload directly to s3
      client.putFile(req.query.src, key, function(err, resp) {
        if (resp.statusCode === 200) {
          addToDb(req, res, key);
          response.postRes(req, res, key);
        } else {
          errRes(req, res, 500);
        }
      });
    }
  }
};