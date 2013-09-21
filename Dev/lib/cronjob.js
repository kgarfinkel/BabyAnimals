//dependencies
var mongoose = require('mongoose');

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