//dependencies
var knox = require('knox');
var fs = require('fs');
var gm = require('gm');
var addToDb = require('./mongoosehelpers').addToDb;

module.exports = {
  //send response statusCode and body
  write: function(req, res, statusCode, body) {
    body = body || 'image uploaded!';
    res.set('Content-Type', 'image/jpeg');
    res.status(statusCode);
    res.send(body);
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
          response(req, res, key, statusCode);
        }
      });

      req.end(data);
    });
  },

  getDimensions: function(req, res) {
    console.log('in dime');
    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .size(function (err, size) {
      if (err) {
        console.log('</3');
        throw err;
      }

      responseMetaData(req, res, req.key, size.width, size.height, 201);
    });
  },

  //send response object
  response: function(req, res, key, statusCode) {
    fs.readFile(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err, data) {
      if (err) throw err; // Fail if the file can't be read.
      res.set({'Content-Type': 'image/jpeg'});
      res.status(200);
      res.send(data); // Send the file data to the browser.
    });
  }
};

var responseMetaData = function(req, res, key, w, h, statusCode) {
  var response = {};

  response.id = key;
  response.bucket = process.env.AWS_BUCKET;
  response.url = '/' + key;
  response.createdAt = new Date();
  response.width = w;
  response.height = h;
  res.set('Content-Type', 'image/jpeg');

  res.status(statusCode);
  res.send(JSON.stringify(response));
};

//send response object
var response = function(req, res, key, statusCode) {
  fs.readFile(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err, data) {
    if (err) throw err; // Fail if the file can't be read.
    
    res.set({'Content-Type': 'image/jpeg'});
    res.status(200);
    res.send(data); // Send the file data to the browser.
  });
};

