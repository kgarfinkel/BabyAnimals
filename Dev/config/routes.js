var upload = require('../lib/upload.js');
var url = require('url');
var qs = require('qs');


module.exports = function(app) {
  //home route
  var home = require('../app/controllers/home');
  app.get('/', home.index);

  //image route  
  app.post('/upload', function(req, response) {

    //TODO: add env[var]
    path = '/Users/Kristina/js_books/temp/images';

    upload.addToS3(req.query.imgUrl, path, function(res) {
      response.writeHead(200);
      response.end();
    });

    // upload.fetchURL(req.query.imgUrl, path, function() {
    //   upload.addMetaData(path, function(res) {
    //     response.writeHead(200);
    //     response.end(res);
    //   });
    // });
  });
};