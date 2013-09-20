//dependencies
var spawn = require('child_process').spawn;
var gm = require('gm');
var im = require('imagemagick');
var fs = require('fs');
var helpers = require('./helperfunctions');


module.exports = {
  resizeVintage: function(req, res, w, h, key) {
    im.resize({
      srcPath: '/Users/Kristina/Desktop/antiquefilter.jpg',
      dstPath: '/Users/Kristina/Desktop/tempantique.jpg',
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

  resizeBW: function(req, res, w, h, key) {
    im.resize({
      srcPath: '/Users/Kristina/Desktop/bwgrad_1.jpg',
      dstPath: '/Users/Kristina/Desktop/tempbwgrad.jpg',
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

  addHipsterOverlay: function(res, req, key) {
    var args = [process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', '/Users/Kristina/Desktop/tempantique.jpg', '-compose', 'Overlay', '-composite', process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'];
    var convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'));
    helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );

  },

  addBWGrad: function(res, req, key) {
    var args = ['-watermark', '90%', '-gravity', 'center', process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg' , '/Users/Kristina/Desktop/tempbwgrad.jpg', process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'];
    var composite = spawn('composite', args);
      
    composite.stdout.pipe(fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'));
  }
};