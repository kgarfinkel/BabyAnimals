module.exports = function(app) {
  var imageDataController = require('../app/controllers/ImageData.js');
  app.post('/image', imageDataController.storeImageMetaData);
};
