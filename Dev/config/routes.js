var upload = require('../lib/upload');
var retrieve = require('../lib/retrieve'); 
var resize = require('../lib/resize');
var del = require('../lib/del');
var filters = require('../lib/filters');
var helpers = require('../lib/helperfunctions');
var ImageMetaData = require('../app/models/imageMetaData');

module.exports = {
  routeHandler: function(app) {    
    //middleware for any image retrieval
    app.param('image', function(req, res, next, key) {
      ImageMetaData.find({key: key}, function(error, data) {
        if (error) {
          return next(error);
        }

        if (data.length === 0) {
          console.error('image has not been uploaded </3');
          return helpers.helper.write(req, res, 404);
        }

        req.key = key;
        next();
      });
    });

    //middlware for filter requests
    app.param('filter', function(req, res, next, filter) {
      req.filter = filter;
      next();
    });

    //home route
    var home = require('../app/controllers/home');
    app.get('/', home.index);

    //upload route
    app.put('/upload', upload.upload, function(req, res, next) {
    });

    //get image route
    app.get('/:image', retrieve.retrieve, function(req, res, next) {
      helpers.helper.write(req, res, 200);
    });

    //resize image route
    app.get('/:image/size', retrieve.retrieve, resize.identify, function(req, res, next) {
    });

    //delete image route
    app.get('/:image/del', del.del, function(req, res, next) {  
    });

    //transform image
    app.get('/:image/:filter', retrieve.retrieve, filters.routeFilter, function(req, res, next) {
    });

  },
};

