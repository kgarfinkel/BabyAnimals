/* dependencies */
var mongoose = require('mongoose'),
  path = require('path'),
  cronJob = require('cron').CronJob,
  removefileforce = require(path.join(__dirname, '..', 'lib', 'removefileforce'));

//crontab for during development to clear out the fs
//currently not being used
module.exports = function(app, config) {
  var job = new cronJob('0 * * * *', function() {
    var rootPath = path.join(__dirname, '..', 'data', 'images/');
    removefileforce(rootPath);
  }, function() {
    console.log('cron job stopped');
  });

  job.start();
};

