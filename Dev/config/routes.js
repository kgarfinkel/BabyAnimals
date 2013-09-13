var request = require('request');
var fs = require('fs');
var url = require('url');
var im = require('imagemagick');
var imageDataController = require('../app/controllers/ImageData.js');

//load file data to server
var fetchURL = function(url, path, cb) {
  var picStream = fs.createWriteStream(path);
  picStream.on('close', function() {
    cb();
  });
  request(url).pipe(picStream);

};

//store metadata to db 
var addMetaData = function(path, cb) {

  //add s3 url
  im.identify('/Users/Kristina/js_books/temp/images', function(error, features) {
    if (error) {
      throw new Error('</3', error);
    }

    console.log('features', features);
    //imageDataController.storeImageMetaData(features);
  });

  cb();

};

module.exports = function(app) {
  //home route
  var home = require('../app/controllers/home');
  app.get('/', home.index);
  
  //image route  
  app.post('/image', function(req, response) {

    //add env[var]
    path = '/Users/Kristina/js_books/temp/images';

    fetchURL(req.body.imgUrl, path, function() {
      addMetaData(path, function() {
        console.log('response');
        response.writeHead(200);
        response.end();
      });
    });
  });
};