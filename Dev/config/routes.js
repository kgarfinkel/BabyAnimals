var upload = require('../lib/upload.js');
var url = require('url');
var qs = require('qs');
var fs = require('fs');

module.exports = function(app) {
  //home route
  var home = require('../app/controllers/home');
  app.get('/', home.index);

  path = '/Users/Kristina/projammin/hackreactor/personalproject/Dev/data/images/example.txt';
  //image route  
  app.post('/upload', function(req, response) {

    //TODO: add env[var]
    upload.addToS3(req.query.imgUrl, path.toString(), function(key) {
      upload.addMetaData(key, function(res) {
        response.writeHead(200);
        response.end(res);
      });
    });
  });
};