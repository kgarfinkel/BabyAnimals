//dependencies
var helpers = require('./deletehelpers');
var write = require('./helperfunctions').write;
var fs = require('fs');

//delete requested image from S3 bucket
//and fs if file exists
module.exports = {
  del: function(req, res) {
    helpers.deleteFromS3(req,res);
    helpers.deleteFromFs(req, res);
    helpers.deleteFromDb(req, res);
    write(req, res, 200, 'image' + req.key + 'deleted');
  }
};