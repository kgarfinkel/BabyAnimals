var upload = require('../lib/upload');
var retrieve = require('../lib/retrieve'); 
var resize = require('../lib/resize');
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
    app.param('image', function(req, res, next, key) {
      db.find({key: key}, function(error, data) {
          if (error) {
            return next(error);
          }

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

    app.get('/:image', retrieve.retrieve, function(req, res) {
      res.send('getting image', req.key);
    });

    app.get('/:image/size', resize.retrieve, function(req, res) {
      res.writeHead(200, responseHeaders);
      res.end();
    });
  },
};