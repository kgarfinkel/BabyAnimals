var imageData = require('../app/controllers/ImageData.js');
var helpers = require('./helperfunctions');
var fs = require('fs');
var request = require('request');
var knox = require('knox');
var uuid = require('node-uuid');
var gm = require('gm');
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

var getDimensions = function(req, res, key) {
  var w, h;
  gm(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg')
  .size(function (err, size) {
    if (err) {
      console.log('</3');
      throw err;
    }

    w = size.width;
    h = size.height; 
    response(req, res, key, w, h);
  });
};

var insertDB = function(req, res, key) {
  var metaData = imageData.imageData(key);

  getDimensions(req, res, metaData.key);

};

var response = function(req, res, key, w, h, filter) {
  var response = {};

  response.id = key;
  response.bucket = process.env.AWS_BUCKET;
  response.url = 'https://' + process.env.AWS_BUCKET + '.s3.amazonaws.com/' + key;
  response.createdAt = new Date();
  response.width = w;
  response.height = h;
  response.filter = null;

  helpers.helper.write(req, res, 201, JSON.stringify(response));
};