var helpers = require('./helperfunctions');
var upload = require('./upload');
var fs = require('fs');
var im = require('imagemagick');
var uuid = require('node-uuid');
var knox = require('knox');
var async = require('async');
var imageDataController = require('../app/controllers/ImageData.js');

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
  var data = '';
  var readStream = fs.createReadStream(path);

  readStream.on('data', function(chunk) {
    data += chunk;
  });

  readStream.on('close', function() {
    //TODO: not put in seperate folder?
    var req = client.put('resize/' + key, {
      'Content-Length': data.length,
      'Content-Type': 'image/jpeg',
      'x-amz-acl': 'public-read'
    });

    req.end(data);
    insertDB(req, res, key);
  });
};

//store metadata to db 
var insertDB = function(req, res, key) {
  var metaData = imageDataController.storeImageMetaData(key);

  response(req, res, metaData.key);
};

var response = function(req, res, key) {
  var response = {};

  response.createdAt = new Date();
  response.imgId = key;

  helpers.write(req, res, 202, JSON.stringify(response));
};
