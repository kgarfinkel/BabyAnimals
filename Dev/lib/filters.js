var helpers = require('./helperfunctions');
var upload = require('./upload');
var fs = require('fs');
var im = require('imagemagick');
var gm = require('gm');
var uuid = require('node-uuid');
var knox = require('knox');
var async = require('async');
var imageDataController = require('../app/controllers/ImageData.js');

var client = helpers.awsClient();

module.exports = {
  routeFilter: function(req, res) {
    filters[req.filter](req, res);  
  }
};

var filters = {
  blur : function(req, res) {
    var key = uuid.v4().split('-').pop();
    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .blur(0, 6)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      console.log('success');
    });  
  }
};

