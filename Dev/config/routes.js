var upload = require('../lib/upload');
var retrieve = require('../lib/retrieve'); 
var url = require('url');
var qs = require('qs');
var fs = require('fs');
var uuid = require('node-uuid');
var db = require('../app/models/imageMetaData');

var responseHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10 // Seconds.
};

module.exports = {
  routeHandler: function(app) {
    var key = uuid.v4().split('-').pop();
    
    //middleware for retrieving images
    //map logic to route parameters
    app.param('image', function(req, res, next, key) {
      db.find({key: key}, function(error, data) {
          if (error) {
            return next(error);
          }

          //TODO: upload 
          if (!data) {
            throw new Error ('</3 the image you have requested has not been stored');
          }
          req.key = key;
          next();
        });
    });

    //home route
    var home = require('../app/controllers/home');
    app.get('/', home.index);

    //upload route  
    //change to middleware?
    //change so url is not a query using upload/:image
    app.post('/upload', function(req, response) {
      upload.upload(req.query.imgUrl, process.env.LOCAL_FILE_PATH + '/' + key, function() {
        upload.insertDB(key, function(res) {
          response.writeHead(200, responseHeaders);
          response.end(res);
        });
      });
    });

    app.get('/:image', retrieve.retrieve(key), function(req, res) {
      console.log('success1');

      res.writeHead(200, responseHeaders);
      res.end();
    });

    app.get('/:image', function(req, res) {
      if (req.query.size) {
        console.log('success2');
      }
    });
  },
};