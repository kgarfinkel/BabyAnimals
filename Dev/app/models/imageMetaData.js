var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageMetaSchema = new Schema({
  id: Number,
  version: Number,
  height: Number,
  width: Number,
  format: String,
  bytes: Number,
  created_at: {type: Date, 'default': Date.now},
  bucket: String,
  key: String,
  url: String
});

module.exports = mongoose.model('ImageMetaData', imageMetaSchema);
