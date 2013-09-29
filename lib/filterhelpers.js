// Dependencies
var path = require('path'),
  spawn = require('child_process').spawn,
  gm = require('gm'),
  im = require('imagemagick'),
  fs = require('fs'),
  helpers = require('./helperfunctions'),
  response = require('./responseHelpers'),
  imagePath = path.join('/tmp/');

module.exports = {
  // Resize vintage overlay to dimensions of the requested image
  resizeVintage: function(req, res, w, h, key) {    
    im.resize({
      srcPath: path.join(__dirname, '/../assets/antiquefilter.jpg'),
      dstPath: path.join(__dirname + '/../assets/temp_antiquefilter.jpg'),
      width: w,
      height: h
    }, function(err, stdout, stderr) {
      if (err) {
        console.error('Image transformation failed with error:', stderr);
        throw err;
      }

      if (stderr) {
        console.error('Image transformation failed with error:', stderr);
        throw stderr;
      }

      addVintageOverlay(req, res, key);
    });
  },

  // Resize gradient overlay to dimensions of the requested image
  resizeBW: function(req, res, w, h, key, cb) {
    im.resize({
      srcPath: path.join(__dirname + '/../assets/bwgrad_1.jpg'),
      dstPath: path.join(__dirname + '/../assets/temp_bwgrad_1.jpg'),
      width: w,
      height: h
    }, function(err, stdout, stderr) {
      if (err) {
        console.error('Image transformation failed with error:', stderr);
        throw err;
      }

      if (stderr) {
        console.error('Image transformation failed with error:', stderr);
        throw stderr;
      }

      addBWGrad(req, res, key, w, h);
    });
  }
};


// Composite the gradient overlay with requested image 
var addBWGrad = function(req, res, key, w, h) {
  var args = ['-watermark', '95%', '-gravity', 'center', imagePath + req.key + '.jpg' ,  path.join(__dirname,'/../assets/temp_bwgrad_1.jpg'), imagePath + key + '.jpg'],
    composite = spawn('composite', args);
    
  composite.stdout.pipe(fs.createWriteStream(imagePath + key + '.jpg'));
  composite.on('close', function() {
    response.getRes(req, res, key);
  });
};

// Composite the vintage overlay with requested image 
var addVintageOverlay = function(req, res, key, w, h) {
  var args = ['-watermark', '95%', '-gravity', 'center', imagePath + req.key + '.jpg' , path.join(__dirname + '/../assets/temp_antiquefilter.jpg'), imagePath + key + '.jpg'],
    composite = spawn('composite', args);
  
  composite.stdout.pipe(fs.createWriteStream(imagePath + key + '.jpg'));
  
  composite.on('close', function() {
    response.getRes(req, res, key);
  });
};
