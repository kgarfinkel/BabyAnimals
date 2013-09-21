var mongoose = require('mongoose');
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.imageData = function(key) {
  var imageMetaData = new ImageMetaData({
    key: key
  });

  imageMetaData.save();
  return imageMetaData;
};

  