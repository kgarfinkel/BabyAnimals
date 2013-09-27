//dependencies
var path = require('path'),
  spawn = require('child_process').spawn,
  gm = require('gm'),
  im = require('imagemagick'),
  fs = require('fs'),
  helpers = require('./helperfunctions'),
  response = require('./responseHelpers'),
  imagePath = path.join(__dirname, '..', 'data','images');

module.exports = {
  //resize filter overlay to size of requested image
  resizeVintage: function(req, res, w, h, key, cb) {    
    im.resize({
      srcPath: path.join(__dirname, '/../assets/antiquefilter.jpg'),
      dstPath: path.join(__dirname + '/../assets/temp_antiquefilter.jpg'),
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
      srcPath: path.join(__dirname + '/../assets/bwgrad_1.jpg'),
      dstPath: path.join(__dirname + '/../assets/temp_bwgrad_1.jpg'),
      width: w,
      height: h
    }, function(err, stdout, stderr) {
      if (err) {
        // TODO: Log error
        console.error('could not process image </3');
        throw err;
      }

      if (stderr) {
        // TODO: Log error
        throw stderr;
      }

      addBWGrad(req, res, key, w, h);
    });
  }
};


//composite black and gray overlay with target image 
var addBWGrad = function(req, res, key, w, h) {
  var args = ['-watermark', '95%', '-gravity', 'center', imagePath + req.key + '.jpg' ,  path.join(__dirname,'/../assets/temp_bwgrad_1.jpg'), imagePath + key + '.jpg'],
    composite = spawn('composite', args);
    
  composite.stdout.pipe(fs.createWriteStream(imagePath + key + '.jpg'));
  composite.on('close', function() {
    response.getRes(req, res, key);
  });
};

//composite antique overlay with target image 
var addHipsterOverlay = function(req, res, key, w, h) {
  var args = ['-watermark', '95%', '-gravity', 'center', imagePath + req.key + '.jpg' , path.join(__dirname + '/../assets/temp_antiquefilter.jpg'), imagePath + key + '.jpg'],
    composite = spawn('composite', args);
  
  composite.stdout.pipe(fs.createWriteStream(imagePath + key + '.jpg'));
  
  composite.on('close', function() {
    response.getRes(req, res, key);
  });
};
