var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageMetaSchema = new Schema({
  id: Number,
  format: String,
  height: Number,
  width: Number,
  created_at: {type: Date, 'default': Date.now},
  bucket: String,
  key: String,
  url: String
});

module.exports = mongoose.model('ImageMetaData', imageMetaSchema);
