var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageMetaSchema = new Schema({
  bucket: String,
  key: String,
  url: String
});

module.exports = mongoose.model('ImageMetaData', imageMetaSchema);
