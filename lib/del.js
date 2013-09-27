//dependencies
var path = require('path'),
  fs = require('fs'),
  helpers = require('./deletehelpers'),
  response = require('./responseHelpers').delRes;

//delete requested image from S3 bucket
//delete requested image from fs
//delete requested image from db
module.exports = {
  del: function(req, res) {
    helpers.deleteFromS3(req,res);
    helpers.deleteFromFs(req, res);
    helpers.deleteFromDb(req, res);
    write(req, res, 200, req.key);
  }
};