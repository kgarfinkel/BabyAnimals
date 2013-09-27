// Dependencies
var fs = require('fs'),
  mongoose = require('mongoose'),
  ImageData = mongoose.model('ImageMetaData'),
  upload = require('../lib/upload'),
  retrieve = require('../lib/retrieve'), 
  resize = require('../lib/resize'),
  del = require('../lib/del'),
  filters = require('../lib/filters'),
  helpers = require('../lib/helperfunctions'),
  response = require('../lib/responseHelpers');

module.exports = {
  routeHandler: function(app) {    
    // Middleware for image retrieval
    app.param('image', function(req, res, next, image) {
      ImageData.findOne({key:image}, function(err, data) {
        if (err) {
          console.error('Image uploading failed with error:', err);
          return next(err);
        }

        if (!data) {
          console.error('Image uploading failed with error:', err);
          return response.errRes(req, res);
        }

        req.key = image;
        next();
      });
    });

    // Middlware for filter requests
    app.param('filter', function(req, res, next, filter) {
      req.filter = filter;
      next();
    });

    // Home route
    var home = require('../app/controllers/home');
    app.get('/', home.index);

    // Upload route
    app.post('/babyanimals/upload', upload.upload, function(req, res, next) {
    });

    // Get image route
    app.get('/babyanimals/:image', retrieve.retrieve, function(req, res, next) {
      response.getRes(req, res, req.key);
    });

    // Resize image route
    app.get('/babyanimals/:image/size', retrieve.retrieve, resize.identify, function(req, res, next) {
    });

    // Delete image route
    app.del('/babyanimals/:image/del', del.del, function(req, res, next) {  
    });

    // Get image info route
    app.get('/babyanimals/:image/info', retrieve.retrieve, helpers.getDimensions, function(req, res, next) {
    });

    // Transform image
    app.get('/babyanimals/:image/:filter', retrieve.retrieve, filters.routeFilter, function(req, res, next) {
    });
  }
};
