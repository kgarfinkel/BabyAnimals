//dependencies
var spawn = require('child_process').spawn;
var gm = require('gm');
var im = require('imagemagick');
var fs = require('fs');
var helpers = require('./helperfunctions');

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

      cb(req, res, key, w, h);
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

      cb(req, res, key, w, h);
    });
  },

  //composite antique overlay with target image 
  addHipsterOverlay: function(req,res, key, w, h) {
    var args = ['-watermark', '95%', '-gravity', 'center', process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg' ,  __dirname + '/../assets/temp_antiquefilter.jpg', process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'];
    var composite = spawn('composite', args);
    
    composite.stdout.pipe(fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'));
    helpers.upload(req, res, key);
  },

  //composite black and gray overlay with target image 
  addBWGrad: function(req, res, key, w, h) {
    var args = ['-watermark', '95%', '-gravity', 'center', process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg' ,  __dirname + '/../assets/temp_bwgrad_1.jpg', process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'];
    var composite = spawn('composite', args);
      
    composite.stdout.pipe(fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'));
    helpers.upload(req, res, key);
  }
};
