var request = require('request');
var fs = require('fs');
var url = require('url');

var fetchURL = function(url, path) {
  request(url).pipe(fs.createWriteStream('/Users/Kristina/js_books/temp/images'));
};

module.exports = function(app) {
  //home route
  var home = require('../app/controllers/home');
  app.get('/', home.index);
  
  //image route  
  var imageDataController = require('../app/controllers/ImageData.js');
  app.post('/image', function(req, response) {
    

    //store metadata to db 
    var result = imageDataController.storeImageMetaData(req, response);
    
    //load file data to server
    fetchURL(req.body.imgUrl);

    //send response
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(result));
  });
};

