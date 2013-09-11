var mongoose = require('mongoose');
var ImageMetaData = mongoose.model('ImageMetaData');

module.exports.storeImageMetaData = function(request, response) {
  var imageMetaData = new ImageMetaData({url: request.body.url, format: request.body.content_type});
  
  imageMetaData.save();

  // ImageMetaData.find({}, function(error, data) {
  //   console.log(data);
  //   res.json('data',data);
  // });

  response.send(200, 'success');
};

  