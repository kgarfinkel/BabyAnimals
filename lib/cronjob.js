// Dependencies
var path = require('path'),
  mongoose = require('mongoose'),
  cronJob = require('cron').CronJob,
  removefileforce = require('./removefileforce'),
  rootPath = path.join(__dirname, '..', 'data', 'images/');

// Remove all files from image folder
module.exports = function(app, config) {
  var job = new cronJob('* * * * *', function() {
    removefileforce(rootPath);
  }, function() {
    console.log('cron job stopped');
  });

  job.start();
};

