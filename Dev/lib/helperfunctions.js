//dependencies
var knox = require('knox');
var fs = require('fs');
var imageData = require('../app/controllers/ImageData.js');
var ImageMetaData = require('../app/models/imageMetaData');
var gm = require('gm');

module.exports = {
  //send response statusCode and body
  write: function(req, res, statusCode, body) {
    res.set('Content-Type', 'image/jpeg');
    res.send(body, statusCode, responseHeaders);
  },

  //configure AWS client
  awsClient: function() {
    return knox.createClient({
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: process.env.AWS_BUCKET
    });  
  },

  //upload requested image to to s3 bucket
  upload: function(req, res, key, w, h, filter, statusCode) {
    var data = '';
    var readStream = fs.createReadStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');

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
          response(req, res, key, w, h, filter, statusCode);
        }
      });

      req.end(data);
    });
  },

  //delete requested image from s3 bucket
  //when s3 response has ended
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
  },

  //store s3 key in db 
  addToDb: function(req, res, key) {
    var imgKey = imageData.imageData(key);
  },

  getDimensions: function(req, res, key, cb) {
    gm(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg')
    .size(function (err, size) {
      if (err) {
        console.log('</3');
        throw err;
      }

      cb(req, res, key, size.width, size.height, 'none', 201);
    });
  },

  //send response object
  response: function(req, res, key, w, h, filter, statusCode) {
    var response = {};

    response.id = key;
    response.bucket = process.env.AWS_BUCKET;
    response.url = 'https://' + process.env.AWS_BUCKET + '.s3.amazonaws.com/' + key;
    response.createdAt = new Date();
    response.width = w;
    response.height = h;
    response.filter = filter;

    res.set('Content-Type', 'image/jpeg');
    res.send(JSON.stringify(response), statusCode, responseHeaders);
  }
};

//CORS
var responseHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10
};

var client = knox.createClient({
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.AWS_BUCKET
});

//store s3 key in db 
var addToDb = function(req, res, key) {
  var imgKey = imageData.imageData(key);
};

var getDimensions = function(req, res, key, cb) {
  gm(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg')
  .size(function (err, size) {
    if (err) {
      console.log('</3');
      throw err;
    }

    cb(req, res, key, size.width, size.height, 'none', 201);
  });
};

//send response object
var response = function(req, res, key, w, h, filter, statusCode) {
  var response = {};

  response.id = key;
  response.bucket = process.env.AWS_BUCKET;
  response.url = 'https://' + process.env.AWS_BUCKET + '.s3.amazonaws.com/' + key;
  response.createdAt = new Date();
  response.width = w;
  response.height = h;
  response.filter = filter;

  res.set('Content-Type', 'image/jpeg');
  res.send(JSON.stringify(response), statusCode, responseHeaders);
};

