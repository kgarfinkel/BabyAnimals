// Dependencies
var path = require('path'),
  fs = require('fs'),
  knox = require('knox'),
  client = require('./knoxHelpers').awsClient(),
  ImageMetaData = require('../app/models/imageMetaData'),
  imagePath = ('/tmp/uploads');

// Delete requested image from s3 bucket
module.exports = {
  deleteFromS3: function(req, res) {
    var s3del = client.del(req.key);

    s3del.on('response', function(res) {
      res.on('error', function(err) {
        console.error('</3');
        throw err;
      });
    });

    s3del.end();
  },

  // Delete requested image from disc
  deleteFromFs: function(req, res) {
    fs.exists(imagePath + req.key + '.jpg', function(exists) {
      if (exists) {
        fs.unlink(imagePath + req.key + '.jpg', function(err) {
          if (err) {
            console.error('</3');
            throw err;
          }
        });
      }
    }); 
  },

  // Delete requested image from db
  deleteFromDb: function(req, res) {
    ImageData.remove({key: req.key}, function(err) {
      if (err) {
        throw err;
      }
    });
  }
};