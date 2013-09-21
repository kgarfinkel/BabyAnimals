var imageData = require('../app/controllers/ImageData.js');
var helpers = require('./helperfunctions');
var fs = require('fs');
var request = require('request');
var knox = require('knox');
var uuid = require('node-uuid');

var client = helpers.helper.awsClient();

module.exports = {
  //stream requested image to fs and store in s3 bucket
  upload: function(req, res, next) {
    var key = uuid.v4().split('-').pop();
    var outStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');

    request(req.query.imgUrl).pipe(outStream);

    outStream.on('close', function() {
      fs.readFile(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err, buff){
        var req = client.put(key, {
            'Content-Length': buff.length,
            'Content-Type': 'image/jpeg',
            'x-amz-acl': 'public-read'
          });

        req.on('response', function(res){
          if (200 == res.statusCode) {
            console.log('saved to %s', req.url);
          }
        });

        req.end(buff);
        insertDB(req, res, key);
      });
    });
  }
};

//store metadata to db 
var insertDB = function(req, res, key) {
  var metaData = imageData.imageData(key);

  response(req, res, metaData.key);
};

var response = function(req, res, key) {
  var response = {};

  response.createdAt = new Date();
  response.imgId = key;

  helpers.helper.write(req, res, 201, JSON.stringify(response));
};