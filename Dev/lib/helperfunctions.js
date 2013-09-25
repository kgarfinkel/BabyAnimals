//dependencies
var knox = require('knox');
var response = require('./responseHelpers');
var fs = require('fs');
var gm = require('gm');
var addToDb = require('./mongoosehelpers').addToDb;

module.exports = {
  //configure AWS client
  awsClient: function() {
    return knox.createClient({
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: process.env.AWS_BUCKET
    });  
  },

  //upload requested image to to s3 bucket
  upload: function(req, res, key) {
    var data = '';
    var readStream = fs.createReadStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');

    readStream.on('data', function(chunk) {
      data += chunk;
    });

    readStream.on('close', function() {
      var req = client.put('/' + key, {
        'Content-Length': data.length,
        'Content-Type': 'image/jpeg',
        'x-amz-acl': 'public-read'
      });

      req.on('response', function(resp) {
        if (resp.statusCode === 200) {
          addToDb(req, res, key);
          response.getRes(req, res, key);
        } else {
          console.log('err');
          errRes(req, res, 500);
        }
      });

      req.end(data);
    });
  },

  getDimensions: function(req, res) {
    console.log('in dime');
    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .size(function (err, size) {
      if (err) {
        console.log('</3');
        throw err;
      }

      response.metaData(req, res, req.key, size.width, size.height, 200);
    });
  }
};

var client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.AWS_BUCKET
});
