var upload = require('../lib/upload.js');
var url = require('url');
var qs = require('qs');
var fs = require('fs');
var key = (123849320385).toString();
var path = '/Users/Kristina/projammin/hackreactor/personalproject/Dev/data/images/';

module.exports = function(app) {
  //home route
  var home = require('../app/controllers/home');
  app.get('/', home.index);

  //image route  
  app.post('/upload', function(req, response) {

    var newPath = path + key;
    //TODO: add env[var]
    upload.addToS3(req.query.imgUrl, newPath.toString(), function() {
      upload.addMetaData(key, function(res) {
        response.writeHead(200);
        response.end(res);
      });
    });
  });
};
