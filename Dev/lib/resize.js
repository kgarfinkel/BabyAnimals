var fs = require('fs');
var im = require('imagemagick');
var gm = require('gm');
var uuid = require('node-uuid');
var knox = require('knox');

var client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.AWS_BUCKET
});  

//size?w=100&h=200
//if heigth or width are not specified, original image height is used
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
          resize(req, res);
        });
      });

      //try next here
      reqs.end('end');
    } 
  }
};

var resize = function(req, res) {
  console.log(req.query.w);
  console.log(req.query.h);

  var w;
  var h;

  im.identify(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(err, features) {
    if (err) {
      throw err;
    }

    w = req.query.w || features.width;
    h = req.query.h || features.width; 

    im.resize({
      srcPath: process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg',
      width: w,
      heigth: h
    }, function(err, stdout, stderr) {
      if (err) {
        console.error(err);
      }

      console.log('width, height', w, h);
    });
  });

};