//dependencies
var mongoose = require('mongoose');
var cronJob = require('cron').CronJob;
var removefileforce = require('../lib/removefileforce');

module.exports = function(app, config) {
  var job = new cronJob('0 * * * *', function() {
    //remove all files from image folder
    var rootPath = __dirname + '/../data/images/';
    removefileforce(rootPath);
  }, function() {
    console.log('cron job stopped');
  });

  job.start();
};

