var imageData = require('../app/controllers/ImageData.js');
var helpers = require('./helperfunctions');
var fs = require('fs');
var request = require('request');
var knox = require('knox');
var uuid = require('node-uuid');
var gm = require('gm');
var Q = require('q');
var client = helpers.awsClient();

module.exports = {
  //stream requested image to fs and store in s3 bucket
  upload: function(req, res, next) {
    var key = uuid.v4().split('-').pop();

    if (req.query.src.indexOf('http') !== -1) {
      var outStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      request(req.query.src).pipe(outStream);

      //TODO: use graphics magick here?
      outStream.on('close', function() {
        fs.readFile(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err, buff) {
          var req = client.put(key, {
              'Content-Length': buff.length,
              'Content-Type': 'image/jpeg',
              'x-amz-acl': 'public-read'
            });

          req.on('response', function(resp){
            if (resp.statusCode === 200) {
              helpers.addToDb(req, res, key);
              helpers.getDimensions(req, res, key, helpers.response);
            }
          });

          //TODO: response status code if s3 status is not too
          req.end(buff);
        });
      });
    } else {
      var readStream = fs.createReadStream(req.query.src);
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');

      readStream.on('data', function(buff) {

        var req = client.put(key, {
            'Content-Length': buff.length,
            'Content-Type': 'image/jpeg',
            'x-amz-acl': 'public-read'
          });

        req.on('response', function(resp){
          if (resp.statusCode === 200) {
            helpers.addToDb(req, res, key);
            helpers.getDimensions(req, res, key, helpers.response);
          }
        });

        //TODO: response status code if s3 status is not too
        req.end(buff);
        
        console.log('buff', buff);

        writeStream.write(buff);
      });

      readStream.on('end', function() {
        writeStream.end();
      });

      writeStream.on('close', function() {
        console.log('close');
      });
    }
  }
};