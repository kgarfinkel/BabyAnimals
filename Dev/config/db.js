var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

module.exports = function(app, config) {
  mongoose.connect(config.db);
    
  mongoose.connection.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
  });
};