//dependencies
var knox = require('knox');
var fs = require('fs');
var gm = require('gm');
var response = require('./responseHelpers');
var addToDb = require('./mongoosehelpers').addToDb;
var client = require('./knoxHelpers').awsClient();


module.exports = {
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

