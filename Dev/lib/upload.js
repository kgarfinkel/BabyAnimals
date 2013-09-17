var imageDataController = require('../app/controllers/ImageData.js');
var fs = require('fs');
var request = require('request');
var im = require('imagemagick');
var knox = require('knox');
var uuid = require('node-uuid');

var client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.AWS_BUCKET
});  

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
  console.log('in db');
  var metaData = imageDataController.storeImageMetaData(key);
  var response = {};

  response.createdAt = new Date();
  response.imgId = metaData.key;

  res.writeHead(200);
  res.end(JSON.stringify(response));
};