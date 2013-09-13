var upload = require('../lib/upload.js');

module.exports = function(app) {
  //home route
  var home = require('../app/controllers/home');
  app.get('/', home.index);
  
  //image route  
  app.post('/photo', function(req, response) {

    //add env[var]
    path = '/Users/Kristina/js_books/temp/images';

    upload.fetchURL(req.body.imgUrl, path, function() {
      upload.addMetaData(path, function() {
        response.writeHead(200);
        response.end();
      });
    });
  });
};