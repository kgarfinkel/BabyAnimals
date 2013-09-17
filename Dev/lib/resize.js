var helpers = require('./helperfunctions');
var upload = require('./upload');
var fs = require('fs');
var im = require('imagemagick');
var uuid = require('node-uuid');
var knox = require('knox');

var client = helpers.awsClient();
  
module.exports = {
  identify: function(req, res) {
    var w;
    var h;

    im.identify(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(err, features) {
      if (err) {
        console.error('could not process image </3');
        throw err;
      }

      //TODO: change default to square?
      w = req.query.w || features.width;
      h = req.query.h || features.height; 

      console.log('wh1', w, h);
      resize(req, res, w, h);
    });
  }
};

var resize = function(req, res, w, h) {
  var key = uuid.v4().split('-').pop();

  im.resize({
    srcPath: process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg',
    dstPath: process.env.LOCAL_FILE_PATH + '/' + key + '.jpg',
    width: w,
    height: h
  }, function(err, stdout, stderr) {
    console.log('stdout', stdout);
    if (err) {
      console.error('could not process image </3');
      throw err;
    }

    if (stderr) {
      throw stderr;
    }

    upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', key);
  });
};

var upload = function(req, res, path, key) {

  fs.readFile(path, function(err, data) {
    var req = client.put(key, {
      'Content-Length': data.length,
      'Content-Type': 'image/jpeg',
      'x-amz-acl': 'public-read'
    });

    req.on('response', function(res) {
      console.log('respnse');
    });

    req.end(data);
  });
};

