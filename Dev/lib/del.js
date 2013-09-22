//dependencies
var helpers = require('./helperfunctions');
var fs = require('fs');
var client = helpers.awsClient();
var Q = require('q');

//delete requested image from S3 bucket
//and fs if file exists
module.exports = {
  del: function(req, res) {
    helpers.deleteFromS3(req,res);
    helpers.deleteFromFs(req, res);
    helpers.deleteFromDb(req, res);
    helpers.write(req, res, 200, 'image' + req.key + 'deleted');
  }
};