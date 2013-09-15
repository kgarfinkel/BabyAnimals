var upload = require('../lib/upload.js');
var url = require('url');
var qs = require('qs');
var fs = require('fs');
var uuid = require('node-uuid');

module.exports = {
  routeHandler: function(app) {
    var key = this.key();

    //home route
    var home = require('../app/controllers/home');
    app.get('/', home.index);

    //upload route  
    app.post('/upload', function(req, response) {
      upload.upload(req.query.imgUrl, process.env.LOCAL_FILE_PATH + '/' + key, function() {
        upload.insertDB(key, function(res) {
          response.writeHead(200);
          response.end(res);
        });
      });
    });

  },

  key: function() {
    return uuid.v4().split('-').pop();
  }
};