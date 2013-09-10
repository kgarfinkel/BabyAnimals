var mongoose = require('mongoose');
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.storeImageMetaData = function(request, response) {
  var imageMetaData = new ImageMetaData({url: request.body.url, format: request.body.content_type});
  console.log(imageMetaData);
  response.send(200, 'success');
};
