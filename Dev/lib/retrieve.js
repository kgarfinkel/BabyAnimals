var knox = require('knox');
var fs = require('fs');
var resize = require('./resize');

var client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.AWS_BUCKET
});  

module.exports = {
  retrieve: function(req, res) {
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
        });

        reqs.end();
      } 
    }
};