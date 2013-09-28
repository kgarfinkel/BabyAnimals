// Dependencies
var path = require('path'),
  im = require('imagemagick'),
  uuid = require('node-uuid'),
  response = require('./responseHelpers'),
  helpers = require('./helperfunctions'),
  imagePath = '/temp/uploads/';

module.exports = {
  // Set dimensions to either the requested dimensions or the
  // image's original dimensions
  identify: function(req, res) {
    var w;
    var h;

    im.identify(imagePath + req.key + '.jpg', function(err, features) {
      if (err) {
        console.error('Image transformation failed with error:', err);
        throw err;
      }

      w = req.query.w || features.width;
      h = req.query.h || features.height; 

      resize(req, res, w, h);
    });
  }
};

// Resize image with requested dimensions
var resize = function(req, res, w, h) {
  var key = uuid.v4().split('-').pop();

  im.resize({
    srcPath: imagePath + req.key + '.jpg',
    dstPath: imagePath + key + '.jpg',
    width: w,
    height: h
  }, function(err, stdout, stderr) {
    if (err) {
      console.error('Image processing failed with error:', err);
      throw err;
    }

    if (stderr) {
      console.error('Image processing failed with stderr:', stderr);
      throw stderr;
    }

    response.getRes(req, res, key);
  });
};

