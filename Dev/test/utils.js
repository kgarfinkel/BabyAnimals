//dependencies
process.env.NODE_ENV = 'test';

var config = require('../config/config');
var mongoose = require('mongoose');
var _ = require('underscore');

//set NODE_ENV

//to prevent mocha runner from runner prior to 
//mongoose connecting, check the status of the connection
//before each test

beforeEach(function(done) {
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

  var reconnect = function() {
    mongoose.connect(config.db, function(err) {
      if (err) {
        throw new Error('</3', err);
      }

      return clearDB();
    });
  };

  var checkState = function() {
    switch(mongoose.connection.readyState) {
    case 0: 
      reconnect();
      break;
    case 1: 
      clearDB();
      break;
    default: 
      process.nextTick(checkState);
    }
  };

  checkState();
});

afterEach(function (done) {
  mongoose.disconnect();
 
  return done();
});