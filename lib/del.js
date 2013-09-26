//dependencies
var helpers = require('./deletehelpers');
var response = require('./responseHelpers').delRes;
var fs = require('fs');

//delete requested image from S3 bucket
//and fs if file exists
module.exports = {
  del: function(req, res) {
    helpers.deleteFromS3(req,res);
    helpers.deleteFromFs(req, res);
    helpers.deleteFromDb(req, res);
    write(req, res, 200, req.key);
  }
};