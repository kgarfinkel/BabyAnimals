//dependencies
var path = require('path'),
  helpers = require('./helperfunctions'),
  im = require('imagemagick'),
  uuid = require('node-uuid'),
  response = require('./responseHelpers'),
  imagePath = path.join(__dirname, '..', 'data', 'images');

module.exports = {
  //set the default width and height
  identify: function(req, res) {
    var w;
    var h;

    im.identify(imagePath + req.key + '.jpg', function(err, features) {
      if (err) {
        console.error('could not process image </3');
        throw err;
      }

      // Set dimensions to either the requested dimensions or the
      // image's original dimensions
      w = req.query.w || features.width;
      h = req.query.h || features.height; 

      resize(req, res, w, h);
    });
  }
};

// resize image with requested dimensions
var resize = function(req, res, w, h) {
  // create new key for resized image
  var key = uuid.v4().split('-').pop();

  im.resize({
    srcPath: imagePath + req.key + '.jpg',
    dstPath: imagePath + key + '.jpg',
    width: w,
    height: h
  }, function(err, stdout, stderr) {
    if (err) {
      // console.error('could not process image </3');
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

