//dependencies
var knox = require('knox');
var fs = require('fs');
var im = require('imagemagick');
var uuid = require('node-uuid');
var imageDataController = require('../app/controllers/ImageData.js');

module.exports.helper = {
  write: function(req, res, statusCode, body) {
    res.writeHead(statusCode, responseHeaders);
    res.end(body);
  },

  awsClient: function() {
    return knox.createClient({
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: process.env.AWS_BUCKET
    });  
  },

  //upload request to s3 bucket
  upload: function(req, res, path, prefix, key) {
    var client = knox.createClient({
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: process.env.AWS_BUCKET
    });

    var data = '';
    var readStream = fs.createReadStream(path);

    readStream.on('data', function(chunk) {
      data += chunk;
    });

    readStream.on('close', function() {
      var req = client.put(prefix + '/' + key, {
        'Content-Length': data.length,
        'Content-Type': 'image/jpeg',
        'x-amz-acl': 'public-read'
      });

      req.end(data);
      insertDB(req, res, key);
    });
  }
};

//CORS
var responseHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10
};

//store s3 key in db 
var insertDB = function(req, res, key) {
  var imgKey = imageDataController.storeImageMetaData(key);

  response(req, res, imgKey.key);
};

//send response object
var response = function(req, res, key) {
  var response = {};

  response.createdAt = new Date();
  response.imgId = key;

  res.writeHead(200, responseHeaders);
  res.end(JSON.stringify(response));
};
