// Dependencies
var path = require('path'),
  fs = require('fs'),
  gm = require('gm'),
  uuid = require('node-uuid'),
  mongoose = require('mongoose'),
  model = mongoose.model('ImageMetaData'),
  response = require('./responseHelpers'),
  addToDb = require('./mongoosehelpers').addToDb,
  client = require('./knoxHelpers').awsClient(),
  imagePath = '/temp/uploads';

module.exports = {
  // Upload requested image to to s3 bucket
  // TODO: mention public read in README 
  upload: function(req, res, key) {
    var data = '',
      readStream = fs.createReadStream(imagePath + key + '.jpg');

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
          errRes(req, res, 500);
        }
      });

      req.end(data);
    });
  },

  //TODO: move to seperate file
  // Obtain the dimensions of the requested image
  getDimensions: function(req, res) {
    gm(imagePath + req.key + '.jpg')
    .size(function (err, size) {
      if (err) {
        console.error('Image transformation failed with error:', err);
        throw err;
      }

      response.metaData(req, res, req.key, size.width, size.height, 200);
    });
  }
};

