//dependencies
var helpers = require('./helperfunctions');
var fs = require('fs');
var client = helpers.helper.awsClient();
var Q = require('q');

//delete requested image from S3 bucket
//and fs if file exists
module.exports = {
  del: function(req, res) {
    Q.fcall(helpers.helper.deleteFromS3(req,res))
    .then(helpers.helper.deleteFromFs(req, res))
    .then(helpers.helper.write(req, res, 200))
    .catch(function(err) {
      throw err;
    });
  }
};