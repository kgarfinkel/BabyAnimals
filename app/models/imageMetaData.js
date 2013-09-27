// Image data model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  imageSchema = new Schema({
  key: String,
});

module.exports = mongoose.model('ImageMetaData', imageSchema);
