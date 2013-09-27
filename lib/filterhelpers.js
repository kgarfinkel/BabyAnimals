//dependencies
var path = require('path');
var spawn = require('child_process').spawn;
var gm = require('gm');
var im = require('imagemagick');
var fs = require('fs');
var helpers = require('./helperfunctions');
var response = require('./responseHelpers');
var imagePath = path.join(__dirname, './../data/images/');

module.exports = {
  //resize filter overlay to size of requested image
  resizeVintage: function(req, res, w, h, key, cb) {    
    im.resize({
      srcPath: __dirname + '/../assets/antiquefilter.jpg',
      dstPath: __dirname + '/../assets/temp_antiquefilter.jpg',
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

      addHipsterOverlay(req, res, key);
    });
  },

  //resize filter overlay to size of requested image
  resizeBW: function(req, res, w, h, key, cb) {
    im.resize({
      srcPath: __dirname + '/../assets/bwgrad_1.jpg',
      dstPath: __dirname + '/../assets/temp_bwgrad_1.jpg',
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

      addBWGrad(req, res, key, w, h);
    });
  }
};


//composite black and gray overlay with target image 
var addBWGrad = function(req, res, key, w, h) {
  var args = ['-watermark', '95%', '-gravity', 'center', imagePath + req.key + '.jpg' ,  __dirname + '/../assets/temp_bwgrad_1.jpg', imagePath + key + '.jpg'];
  var composite = spawn('composite', args);
    
  composite.stdout.pipe(fs.createWriteStream(imagePath + key + '.jpg'));
  composite.on('close', function() {
    response.getRes(req, res, key);
  });
};

//composite antique overlay with target image 
var addHipsterOverlay = function(req, res, key, w, h) {
  console.log('in addHipsterOverlay');
  var args = ['-watermark', '95%', '-gravity', 'center', imagePath + req.key + '.jpg' ,  __dirname + '/../assets/temp_antiquefilter.jpg', imagePath + key + '.jpg'];
  var composite = spawn('composite', args);
  
  composite.stdout.pipe(fs.createWriteStream(imagePath + key + '.jpg'));
  
  composite.on('close', function() {
    response.getRes(req, res, key);
  });
};
