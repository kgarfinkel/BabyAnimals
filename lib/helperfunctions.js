//dependencies
var path = require('path');
var fs = require('fs');
var gm = require('gm');
var response = require('./responseHelpers');
var addToDb = require('./mongoosehelpers').addToDb;
var imagePath = path.join(__dirname, './../data/images/');
var client = require('./knoxHelpers').awsClient();
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var model = mongoose.model('ImageMetaData');

module.exports = {
  key: function() {
    var check = function(key) {
      model.findOne({key: key}, function(err, data) {
        console.log('data', data);
        // if (data[0]) {
        //   console.log('good');
        //   return;
        // } else {
        //   var temp = uuid.v4().split('-').pop();
        //   console.log('bad');
        //   check(temp);
        // }
      });

      //return key;
    };

    return check('b7473396bb61');
  },
  //upload requested image to to s3 bucket
  upload: function(req, res, key) {
    var data = '';
    var readStream = fs.createReadStream(imagePath + key + '.jpg');

    readStream.on('data', function(chunk) {
      data += chunk;
    });

    readStream.on('close', function() {
      var req = client.put('/' + key, {
        'Content-Length': data.length,
        'Content-Type': 'image/jpeg',
        'x-amz-acl': 'public-read'
      });

      req.on('response', function(resp) {
        if (resp.statusCode === 200) {
          addToDb(req, res, key);
          response.getRes(req, res, key);
        } else {
          console.log('err');
          errRes(req, res, 500);
        }
      });

      req.end(data);
    });
  },

  getDimensions: function(req, res) {
    gm(imagePath + req.key + '.jpg')
    .size(function (err, size) {
      if (err) {
        console.log('</3');
        throw err;
      }

      response.metaData(req, res, req.key, size.width, size.height, 200);
    });
  }
};

