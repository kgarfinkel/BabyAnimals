// Dependencies
var path = require('path'),
  fs = require('fs'),
  helpers = require('./deleteHelpers'),
  response = require('./responseHelpers').delRes;

// Delete requested image from S3 bucket, fs, and db
module.exports = {
  del: function(req, res) {
    helpers.deleteFromS3(req,res);
    helpers.deleteFromFs(req, res);
    helpers.deleteFromDb(req, res);
    response.del(req, res, req.key);
  }
};