var path = require('path');
var addToDb = require('./mongoosehelpers').addToDb;
var response = require('./responseHelpers');
var fs = require('fs');
var request = require('request');
var uuid = require('node-uuid');
var client = require('./knoxHelpers').awsClient();
var imagePath = path.join(__dirname, './../data/images/');

module.exports = {
  //stream requested image to fs and store in s3 bucket
  upload: function(req, res, next) {
    var key = uuid.v4().split('-').pop();

    //if request is a url, fetch the requested url
    if (req.query.src.indexOf('http') !== -1) {
      var outStream = fs.createWriteStream(imagePath + key + '.jpg');
      request(req.query.src).pipe(outStream);

      outStream.on('close', function() {
        client.putFile(imagePath + key + '.jpg', key, function(err, resp) {
          if (resp.statusCode === 200) {
            addToDb(req, res, key);
            return response.postRes(req, res, key);
          } else {
            errRes(req, res, 500);
          }
        });
      });
    } else {      
      client.putFile(req.query.src, key, function(err, resp) {
        if (resp.statusCode === 200) {
          addToDb(req, res, key);
          return response.postRes(req, res, key);
        } else {
          errRes(req, res, 500);
        }
      });
    }
  }
};