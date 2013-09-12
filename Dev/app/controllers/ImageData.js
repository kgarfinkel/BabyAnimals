var mongoose = require('mongoose');
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.storeImageMetaData = function(request, response) {
  //store metadata to db
  var imageMetaData = new ImageMetaData({url: request.body.url, format: request.body.content_type}); 
  imageMetaData.save();

  return imageMetaData;
};

  