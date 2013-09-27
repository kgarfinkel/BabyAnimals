//dependencies
var path = require('path');
var config = require('../config/config');
var mongoose = require('mongoose');
var _ = require('underscore');
var imagePath = path.join(__dirname, './../data/images/');

beforeEach(function(done) {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.db, function(err) {
      if (err) {
        throw err;
      }
    });
  }

  return done();
});

afterEach(function(done) {
  mongoose.disconnect(function(error) {
    if (error) {
      console.error('</3');
      throw error;
    }
    
    return done();
  });
});