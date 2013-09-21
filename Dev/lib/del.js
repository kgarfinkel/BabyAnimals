//dependencies
var helpers = require('./helperfunctions');
var fs = require('fs');
var client = helpers.helper.awsClient();
var Q = require('q');

//delete requested image from S3 bucket
//and fs if file exists
module.exports = {
  del: function(req, res) {
    helpers.helper.deleteFromS3(req,res);
    helpers.helper.deleteFromFs(req, res);
    helpers.helper.deleteFromDb(req, res);
    helpers.helper.write(req, res, 200, 'image' + req.key + 'deleted');
  }
};