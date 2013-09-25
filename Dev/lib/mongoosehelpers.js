var imageData = require('../app/controllers/ImageData.js');

//store s3 key in db 
module.exports = {
  addToDb: function(req, res, key) {
    var imgKey = imageData.imageData(key);
  }
};