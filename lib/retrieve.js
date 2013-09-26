var path = require('path');
var fs = require('fs');
var helpers = require('./helperfunctions');
var client = require('./knoxHelpers').awsClient();
var imagePath = path.join(__dirname, './../data/images/');

module.exports = {
  //retrieve requested image
  retrieve: function(req, res, next) {
    if (req.params.image) {
      //if file exists locally continue onto next middleware 
      fs.exists(imagePath + req.key + '.jpg', function(exists) {
        if (!exists) {

          //stream to local fs
          var outstream = fs.createWriteStream(imagePath + req.key + '.jpg');
          
          //store in s3
          var s3req = client.get(req.key);

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

          //end s3 request
          s3req.end();
        } else {
          next();
        }
      }); 
    }
  }
};