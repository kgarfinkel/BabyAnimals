module.exports = function(app) {
  //home route
  var home = require('../app/controllers/home');
  app.get('/', home.index);

  //image route  
  var imageDataController = require('../app/controllers/ImageData.js');
  app.post('/image', imageDataController.storeImageMetaData);

  // load url to server
  // load path
 
};
