var path = require('path'),
  fs = require('fs'),
  request = require('request'),
  uuid = require('node-uuid'),
  client = require('./knoxHelpers').awsClient(),
  addToDb = require('./mongoosehelpers').addToDb,
  response = require('./responseHelpers'),
  helpers = require('./helperfunctions'),
  imagePath = path.join(__dirname, '..', 'data', 'images');

module.exports = {
  //stream requested image to fs and store in s3 bucket
  upload: function(req, res, next) {
    var key = uuid.v4().split('-').pop();

    //if request is a url, fetch the requested and upload to s3
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
      // ?
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