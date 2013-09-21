var fs = require('fs');
var helpers = require('./helperfunctions');
var resize = require('./resize');

var client = helpers.helper.awsClient();

module.exports = {
  //retrieve requested image
  retrieve: function(req, res, next) {
      if (req.params.image) {
        //if file exists locally continue onto next middleware 
        //TODO: why isn't this working
        // fs.exists(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(exists) {
        //   if (exists) {
        //     next();
        //   }
        // });

        //stream to local fs
        var outstream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg');
        
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

          //when response from s3 has ended
          //route to next middleware (if applicable)
          res.on('end', function() {
            next();
          });
        });

        //end s3 request
        s3req.end();

      } 
    }
};