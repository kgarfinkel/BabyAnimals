var mongoose = require('mongoose');
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.storeImageMetaData = function(key) {
  
  //store metadata to db
  var imageMetaData = new ImageMetaData({
    key: key
  });

  imageMetaData.save();
  return imageMetaData;
};

  