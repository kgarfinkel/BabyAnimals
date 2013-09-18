//set NODE_ENV
process.env.NODE_ENV = 'test';

//dependencies
var config = require('../config/config');
var mongoose = require('mongoose');
var _ = require('underscore');

beforeEach(function(done) {
  // connection.on('open', function(err) {
  //   if (err) {
  //     console.error('</3');
  //     throw err;
  //   }

  //   connection.db.dropDatabase();
  //   return done();
  // });
  var clearDB = function() {
    _.each(mongoose.connection.collections, function(item) {
      item.remove(function(err) {
        if (err) {
          throw new Error('</3', err);
        }
      });
    });
  
    return done();
  };

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.db, function(err) {
      if (err) {
        throw err;
      }

      return clearDB();
    });
  } else {
    return clearDB();
  }

  // var reconnect = function() {
  //   mongoose.connect(config.db, function(err) {
  //     if (err) {
  //       throw new Error('</3', err);
  //     }

  //     return clearDB();
  //   });
  // };

  // var checkState = function() {
  //   switch(mongoose.connection.readyState) {
  //   case 0: 
  //     reconnect();
  //     break;
  //   case 1: 
  //     clearDB();
  //     break;
  //   default: 
  //     process.nextTick(checkState);
  //   }
  // };

  // checkState();
});

afterEach(function(done) {
  mongoose.disconnect(function(error) {
    if (error) {
      throw new Error('</3', error);
    }
    
    done();
  });
});