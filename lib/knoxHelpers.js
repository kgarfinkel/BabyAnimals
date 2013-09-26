//dependencies
var path = require('path');
var knox = require('knox');
var response = require('./responseHelpers');

module.exports = {
//configure AWS client
  awsClient: function() {
    return knox.createClient({
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: process.env.AWS_BUCKET
    });  
  }
};