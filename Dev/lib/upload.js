var imageDataController = require('../app/controllers/ImageData.js');
var fs = require('fs');
var request = require('request');
var im = require('imagemagick');
var knox = require('knox');

//var s3 = new AWS.S3();
module.exports = {

  upload: function(url, path, cb) {
    var hashKey = path.split('/').pop();
    
    var client = knox.createClient({
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: process.env.AWS_BUCKET
    });  

    var picStream = fs.createWriteStream(path);

    picStream.on('close', function() {
      fs.readFile(process.env.LOCAL_FILE_PATH + '/' + hashKey, function(err, buff){
        var req = client.put(hashKey, {
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
        cb();
      });
    });

    request(url).pipe(picStream);
  },

  //store metadata to db 
  insertDB: function(key, cb) {
    var metaData = imageDataController.storeImageMetaData(key);
    var response = {};

    response.createdAt = new Date();
    response.imgId = metaData.key;
    
    cb(JSON.stringify(response));
  },

  respond: function() {

  }
};
