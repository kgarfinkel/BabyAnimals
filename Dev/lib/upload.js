var addToDb = require('./mongoosehelpers').addToDb;
var response = require('./responseHelpers');
var fs = require('fs');
var request = require('request');
var uuid = require('node-uuid');
var client = require('./knoxHelpers').awsClient();

module.exports = {
  //stream requested image to fs and store in s3 bucket
  upload: function(req, res, next) {
    var key = uuid.v4().split('-').pop();

    //if request is a url, fetch the requested url
    if (req.query.src.indexOf('http') !== -1) {
      var outStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      var data = '';
      request(req.query.src).pipe(outStream);

      outStream.on('close', function() {
        //TODO: why doesn't readstream file work
        fs.readFile(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err, buff) {
          var req = client.put(key, {
              'Content-Length': buff.length,
              'Content-Type': 'image/jpeg',
              'x-amz-acl': 'public-read'
            });

          req.on('response', function(resp){
            if (resp.statusCode === 200) {
              addToDb(req, res, key);
              return response.postRes(req, res, key);
            } else {
              return errRes(req, res, 500);
            }
          });

          req.end(buff);
        });
      });
    } else {
      var readStream = fs.createReadStream(req.query.src);
      
      readStream.on('data', function(buff) {
        var req = client.put(key, {
            'Content-Length': buff.length,
            'Content-Type': 'image/jpeg',
            'x-amz-acl': 'public-read'
          });

        req.on('response', function(resp){
          if (resp.statusCode === 200) {
            addToDb(req, res, key);
            return response.postRes(req, res, key);
          } else {
            return errRes(req, res, 500);
          }
        });

        req.end(buff);
      });
    }
  }
};