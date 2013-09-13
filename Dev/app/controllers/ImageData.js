var mongoose = require('mongoose');
//var accessKey = require('./config/config').accessKey;
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.storeImageMetaData = function(features) {
  //store metadata to db
  var imageMetaData = new ImageMetaData({
    id: features.signatures,
    format: features.format,
    height: features.height,
    width: features.width
  });

  imageMetaData.save();

  console.log('metadata', imageMetaData);

  return imageMetaData;
};

  