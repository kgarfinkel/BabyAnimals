var mongoose = require('mongoose');
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.storeImageMetaData = function(features) {
  //store metadata to db
  var imageMetaData = new ImageMetaData({format: features.format}); 
  imageMetaData.save();

  return imageMetaData;
};

  