// Connect to mongodb
var mongoose = require( 'mongoose' );

module.exports = function(app, config) {
  mongoose.connect(config.db);

  var db = mongoose.connection;
    
  db.on('error', function (error) {
    console.error('unable to connect to database at ' + config.db);
    throw error;
  });

  db.once('open', function() {
    console.log('mongo connected');
  });
};