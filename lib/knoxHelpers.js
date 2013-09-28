// Dependencies
var path = require('path'),
  knox = require('knox'),
  response = require('./responseHelpers'),
  bucket = process.env.AWS_BUCKET || 'babyanimals';

module.exports = {
// Configure AWS client
  awsClient: function() {
    return knox.createClient({
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: process.env.AWS_BUCKET
    });  
  }
};