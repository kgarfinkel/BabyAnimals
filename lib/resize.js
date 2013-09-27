//dependencies
var path = require('path');
var helpers = require('./helperfunctions');
var im = require('imagemagick');
var uuid = require('node-uuid');
var response = require('./responseHelpers');
var imagePath = path.join(__dirname, './../data/images/');

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

      //set dimensions to queries || dimensions of original image
      w = req.query.w || features.width;
      h = req.query.h || features.height; 

      resize(req, res, w, h);
    });
  }
};

//resize image with requested dimensions
var resize = function(req, res, w, h) {
  //create new key for resized image
  var key = uuid.v4().split('-').pop();

  im.resize({
    srcPath: imagePath + req.key + '.jpg',
    dstPath: imagePath + key + '.jpg',
    width: w,
    height: h
  }, function(err, stdout, stderr) {
    if (err) {
      console.error('could not process image </3');
      throw err;
    }

    if (stderr) {
      throw stderr;
    }

    response.getRes(req, res, key);
  });
};

