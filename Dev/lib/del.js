//dependencies
var helpers = require('./helperfunctions');
var fs = require('fs');
var client = helpers.helper.awsClient();
var Q = require('q');

module.exports = {
  del: function(req, res) {
    Q.fcall(deleteFromS3(req,res))
    .then(deleteFromFs(req, res))
    .then(helpers.helper.write(req, res, 200))
    .catch(function(err) {
      throw err;
    });
  }
};

deleteFromS3 = function(req, res) {
  var s3del = client.del(req.key);

  s3del.on('response', function(res) {
    res.on('error', function(err) {
      console.error('</3');
      throw err;
    });

    res.on('end', function() {
      next();
    });
  });

  s3del.end();
};

deleteFromFs = function(req, res) {
  fs.exists(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(exists) {
    if (exists) {
      fs.unlink(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(err) {
        if (err) {
          console.error('</3');
          throw err;
        }
      });
    }
  }); 
};
