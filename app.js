//dependencies 
var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  config = require('./config/config'),
  app = express(),

//models
modelsPath = path.join(__dirname, 'app', 'models');

fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

//express
require('./config/express')(app, config);

//routes
require('./config/routes').routeHandler(app);

//database
require('./config/db')(app, config);

//start app
app.listen(config.port);

module.exports = app;
