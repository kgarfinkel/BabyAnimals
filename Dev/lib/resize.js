//dependencies
var helpers = require('./helperfunctions');
var upload = require('./upload');
var fs = require('fs');
var im = require('imagemagick');
var uuid = require('node-uuid');
var knox = require('knox');
var imageDataController = require('../app/controllers/ImageData.js');


module.exports = {
  //set the default width and height
  identify: function(req, res) {
    var w;
    var h;

    im.identify(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(err, features) {
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
    srcPath: process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg',
    dstPath: process.env.LOCAL_FILE_PATH + '/' + key + '.jpg',
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

    //upload resized image to fs and s3
    helpers.upload(req, res, key, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'resize', key);
  });
};

