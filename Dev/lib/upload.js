
var imageDataController = require('../app/controllers/ImageData.js');
var config = require('/Users/Kristina/projammin/hackreactor/personalproject/Dev/config/config.js');
var fs = require('fs');
var request = require('request');
var im = require('imagemagick');
var gm = require('gm');
var AWS = require('aws-sdk');
var knox = require('knox');

var s3 = new AWS.S3();

module.exports = {
  addToS3: function(url, path, cb) {
    var client = knox.createClient({
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: 'testbucket1989'

    });  

    var picStream = fs.createWriteStream(path);

    picStream.on('close', function() {
      fs.readFile(path, function(err, buff){
        var req = client.put('babyanimals', {
            'Content-Length': buff.length,
            'Content-Type': 'text/plain',
            'x-amz-acl': 'public-read'
          });

        req.on('response', function(response){
          if (200 == response.statusCode) {
            console.log('saved to %s', req.url);
          }
        });

        req.end(buff);
        cb('babyanimals');
      });
    });

    request(url).pipe(picStream);
  },

  //store metadata to db 
  addMetaData: function(key, cb) {
    var results = imageDataController.storeImageMetaData(key);
    cb(results.toString());
  },
};
