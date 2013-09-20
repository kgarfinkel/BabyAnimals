//dependencies
var helpers = require('./helperfunctions');
var fs = require('fs');
var client = helpers.helper.awsClient();

module.exports = {
  del: function(req, res) {
    console.log('in delete');
    var s3del = client.del(req.key);

    s3del.on('response', function(res) {
      console.log('in delete response');
      console.log('res', res.statusCode);
      console.log(res.headers);
      
      res.on('error', function(err) {
        console.error('</3');
        throw err;
      });

      res.on('end', function() {
        console.log('deleted!');
        next();
      });
    });

    s3del.end();
  }
};
