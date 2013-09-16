var knox = require('knox');
var fs = require('fs');

var client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.AWS_BUCKET
});  

module.exports = {
  retrieve: function(key) {
    return function(req, res, next) {
      if (req.params.image) {
        var outstream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key);
        //resize: buffer ='';
        client.get(req.key)

        .on('response', function(res) {

          res.on('data', function(chunk) {
            outstream.write(chunk);
          });

        }).end();
        next();
      }

      next();
    };
  }
};