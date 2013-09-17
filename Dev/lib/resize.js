var helpers = require('./helperfunctions');
var fs = require('fs');
var im = require('imagemagick');
var uuid = require('node-uuid');
var knox = require('knox');

var client = helpers.awsClient();
  
module.exports = {
  retrieve: function(req, res, next) {
    if (req.params.image) {
      var outstream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg');
      var reqs = client.get(req.key);

      reqs.on('response', function(res) {
        res.on('data', function(chunk) {
          console.log('chunk');
          outstream.write(chunk);
        });

        res.on('error', function(err) {
          console.log(err);
        });

        res.on('end', function() {
          identify(req, res);
        });
      });

      reqs.end();
    } 
  }
};

//set height and width to queries or original dimensions
var identify = function(req, res) {
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
};

var resize = function(req, res, w, h) {
  im.resize({
    srcPath: process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg',
    width: w,
    heigth: h
  }, function(err, stdout, stderr) {
    if (err) {
      console.error('could not process image </3');
      throw err;
    }
  });
};