//dependencies
var mongoose = require('mongoose');
var cronJob = require('cron').CronJob;
var removefileforce = require('./removefileforce');

module.exports = function(app, config) {
  consoe.log('in corn job');
  var job = new cronJob('* * * * *', function() {
    console.log('cron job started');
    //remove all files from image folder
    var rootPath = __dirname + './../data/images';
    removefileforce(rootPath);
  }, function() {
    console.log('cron job stopped');
  });

  job.start();
};

