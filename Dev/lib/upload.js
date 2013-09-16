var imageDataController = require('../app/controllers/ImageData.js');
var fs = require('fs');
var request = require('request');
var im = require('imagemagick');
var knox = require('knox');

var client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.AWS_BUCKET
});  

module.exports = {
  //stream requested image to fs and store in s3 bucket
  upload: function(url, path, cb) {
    var key = path.split('/').pop();
    var outStream = fs.createWriteStream(path);

    outStream.on('close', function() {
      fs.readFile(process.env.LOCAL_FILE_PATH + '/' + key, function(err, buff){
        var req = client.put(key, {
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

    request(url).pipe(outStream);
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
