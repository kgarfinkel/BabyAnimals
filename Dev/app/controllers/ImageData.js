var mongoose = require('mongoose');
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.storeImageMetaData = function(request, response) {
  var imageMetaData = new ImageMetaData({url: request.body.url, format: request.body.content_type}); 
  imageMetaData.save();

  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(JSON.stringify(imageMetaData));
};

  