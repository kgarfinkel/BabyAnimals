var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageMetaSchema = new Schema({
  key: String,
});

module.exports = mongoose.model('ImageMetaData', imageMetaSchema);
