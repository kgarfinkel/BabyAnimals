var upload = require('../lib/upload');
var retrieve = require('../lib/retrieve'); 
var resize = require('../lib/resize');
var del = require('../lib/del');
var filters = require('../lib/filters');
var helpers = require('../lib/helperfunctions');
var response = require('../lib/responseHelpers');
var ImageData = require('../app/models/imageMetaData');
var mongoose = require('mongoose');
var model = mongoose.model('ImageMetaData');
var fs = require('fs');

module.exports = {
  routeHandler: function(app) {    
    //middleware for any image retrieval
    app.param('image', function(req, res, next, image) {
      model.findOne({key:image}, function(error, data) {
        if (error) {
          return next(error);
        }

        if (!data) {
          console.error('image has not been uploaded </3');
          return response.errRes(req, res);
        }

        req.key = image;
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
    app.post('/babyanimals/upload', upload.upload, function(req, res, next) {
    });

    //get image route
    app.get('/babyanimals/:image', retrieve.retrieve, function(req, res, next) {
      response.getRes(req, res, req.key);
    });

    //resize image route
    app.get('/babyanimals/:image/size', retrieve.retrieve, resize.identify, function(req, res, next) {
    });

    //delete image route
    app.get('/babyanimals/:image/del', del.del, function(req, res, next) {  
    });

    //TODO: make
    //get image info route
    app.get('/babyanimals/:image/info', retrieve.retrieve, helpers.getDimensions, function(req, res, next) {
    });

    //transform image
    app.get('/babyanimals/:image/:filter', retrieve.retrieve, filters.routeFilter, function(req, res, next) {
    });
  }
};

