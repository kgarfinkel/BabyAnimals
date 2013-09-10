var mongoose = require('mongoose');
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.storeImageMetaData = function(request, response) {
  response.send(200, 'success');
};
