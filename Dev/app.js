var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config/config');
var request = require('request');

var app = express();

//models
var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

// var data = {
//   url: 'https://www.google.com/images/srpr/logo4w.png', 
//   content_type: 'image/png'
// };

// request.post({
//   url: 'http://localhost:3000/image',
//   headers:{'content-type': 'application/x-www-form-urlencoded'},
//   body: require('querystring').stringify(data) 
// }, function(err, res, bod) {
//   console.log(bod);
//   console.log(res.statusCode);
// });

//express
require('./config/express')(app, config);

//routes
require('./config/routes')(app);

//start the app
app.listen(config.port);
