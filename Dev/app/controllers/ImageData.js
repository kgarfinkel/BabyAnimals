var mongoose = require('mongoose');
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.storeImageMetaData = function(features) {
  
  //store metadata to db
  var imageMetaData = new ImageMetaData({
    id: features.properties.signature,
    format: features.format,
    height: features.height,
    width: features.width,
  });

  imageMetaData.save();

  console.log('metadata', imageMetaData);

  return imageMetaData;
};

  