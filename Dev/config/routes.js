module.exports = function(app) {
  //home route
  // var home = require('../app/controllers/home');
  // app.get('/', home.index);

  //image route  
  var imageDataController = require('../app/controllers/ImageData.js');
  app.post('/image', function(request, response) {

    //store metadata to db 
    var result = imageDataController.storeImageMetaData(request, response);

    //respond with 200
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(result));

  });

  // load url to server
  // load path
 
};
