var knox = require('knox');
var fs = require('fs');
var helpers = require('./helperfunctions');
var resize = require('./resize');

var client = helpers.awsClient();

module.exports = {
  retrieve: function(req, res, next) {
      if (req.params.image) {
        var outstream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg');
        var reqs = client.get(req.key);

        reqs.on('response', function(res) {
          res.on('data', function(chunk) {
            outstream.write(chunk);
          });

          res.on('error', function(err) {
            console.log(err);
          });

          res.on('end', function() {
            next();
          });
        });

        reqs.end();
      } 
    }
};