
var client = require('./helperfunctions').awsClient();
var fs = require('fs');
var knox = require('knox');
var ImageMetaData = require('../app/models/imageMetaData');

//delete requested image from s3 bucket
//when s3 response has ended
module.exports = {
  deleteFromS3: function(req, res) {
    var s3del = client.del(req.key);

    s3del.on('response', function(res) {
      res.on('error', function(err) {
        console.error('</3');
        throw err;
      });
    });

    s3del.end();
  },

  //delete requested image from local fs
  //if the file exists
  deleteFromFs: function(req, res) {
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
  },

  //delete requested image from db
  deleteFromDb: function(req, res) {
    ImageMetaData.remove({key: req.key}, function(err) {
      if (err) {
        throw err;
      }
    });
  }
};