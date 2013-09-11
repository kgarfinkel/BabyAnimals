var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

module.exports = function(app, config) {
  mongoose.connect(config.db);

  var db = mongoose.connection;
    
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
  });

  db.once('open', function() {
    console.log('yay');
  });
};