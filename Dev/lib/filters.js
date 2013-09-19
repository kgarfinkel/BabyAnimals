//dependencies
var helpers = require('./helperfunctions');
var upload = require('./upload');
var fs = require('fs');
var gm = require('gm');
var uuid = require('node-uuid');
var knox = require('knox');
var imageDataController = require('../app/controllers/ImageData.js');

module.exports = {
  //route filter based on filter param
  routeFilter: function(req, res) {
    filters[req.filter](req, res);  
  }
};

var filters = {
  blur : function(req, res) {
    //default values for radius and sigma of blur filter
    var rad = req.query.r || 2;
    var sig = req.query.s || 2;

    //create new s3 key
    var key = uuid.v4().split('-').pop();

    //read file at requested path
    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .blur(rad, sig)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    });  
  },

  charcoal: function(req, res) {
    //default value for charcoal factor
    var factor = req.query.f || 3;

    //create new s3 key
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .charcoal(factor)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    }); 
  },

  channel: function(req, res) {
    //default value for color type
    var type = req.query.t || 'red';

    //create new s3 key
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .channel(type)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    }); 
  },

  brighten: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .modulate(150, 70, 100)
    .gamma(1.2)
    .contrast(+2)
    .fill(330000)
    .colorize()
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    }); 
  },

  bw: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .colorspace('Gray')
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    });
  },

  sepia: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .modulate(115, 0, 100)
    .colorize(7, 21, 50)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    });
  }
};
