//dependencies
var spawn = require('child_process').spawn;
var gm = require('gm');
var im = require('imagemagick');
var fs = require('fs');
var helpers = require('./helperfunctions');

module.exports = {
  //resize filter overlay to size of requested image
  resizeVintage: function(req, res, w, h, key) {
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

      cb(res, req, key);
    });
  },

  //composite antique overlay with target image 
  addHipsterOverlay: function(res, req, key) {
    var args = [process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', __dirname + '/../assets/temp_antiquefilter.jpg', '-gravity', '-composite', process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'];
    var convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'));
  },

  //composite black and gray overlay with target image 
  addBWGrad: function(res, req, key) {
    var args = ['-watermark', '95%', '-gravity', 'center', process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg' ,  __dirname + '/../assets/temp_bwgrad_1.jpg', process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'];
    var composite = spawn('composite', args);
      
    composite.stdout.pipe(fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'));
    helpers.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', key);
  }
};