var mongoose = require('mongoose'),
  ImageData = mongoose.model('ImageMetaData');

module.exports.imageData = function(key) {
  var imageData = new ImageData({
    key: key
  });

  imageData.save();

  return imageData;
};
