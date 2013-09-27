// Dependencies
var path = require('path'),
  fs = require('fs'),
  helpers = require('./helperfunctions'),
  client = require('./knoxHelpers').awsClient(),
  imagePath = path.join(__dirname, '..', 'data', 'images/');

module.exports = {
  // Fetch the requested image from s3
  retrieve: function(req, res, next) {
    // Check if request had an image param
    if (req.params.image) {
      fs.exists(imagePath + req.key + '.jpg', function(exists) {
        if (!exists) {
          // Stream s3 response to fs
          var outstream = fs.createWriteStream(imagePath + req.key + '.jpg'),
            s3req = client.get(req.key);

          s3req.on('response', function(res) {
            res.on('data', function(chunk) {
              outstream.write(chunk);
            });

            res.on('error', function(err) {
              console.error('</3');
              throw err;
            });

            res.on('end', function() {
              next();
            });
          });

          // End s3 request
          s3req.end();
        } else {
          next();
        }
      }); 
    }
  }
};