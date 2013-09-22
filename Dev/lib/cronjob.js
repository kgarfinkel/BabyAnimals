//dependencies
var mongoose = require('mongoose');
var cronJob = require('cron').CronJob;

module.exports = function(app, config) {
  var job = new cronJob('0 0 * * 0', function() {
    //remove all documents from imatemetadatas
    mongoose.connection.db.collection('imagemetadatas', function(err, collection) {
      if (err) {
        console.error('</3');
        throw err;
      }

      collection.remove({}, function(err, removed) {
        if (err) {
          console.error('</3');
          throw err;
        }
      });
    });
  }, function() {
    console.log('cron job stopped');
  });

  job.start();
};
