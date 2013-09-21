//dependencies
var utils = require('./utils');
var config = require('../config/config');
var mongoose = require('mongoose');
var should = require('should');
var request = require('supertest');
var _ = require('underscore');

// express server
var app = require('../app.js');
var key;

describe('#retrieve', function() {
  before(function(done) {
    _.each(mongoose.connection.collections, function(item) {
      item.remove(function(err) {
        if (err) {
          throw new Error('</3', err);
        }
      });
    });
  
    return done();
  });

  before(function(done) {
    request(app)
    .post('/upload?imgUrl=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
    .expect(201)
    .end(function(err, res) {
      console.log('in end', res);
      if (err) {
        return done(err);
      }

      key = JSON.parse(res.text).imgId;
      return done();
    });
  });

  it('should respond with a status of 200 when image is retrieved', function(done) {
    request(app)
    .get('/' + key)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should respond with a status of 404 when image does not exist', function(done) {
    request(app)
    .get('/1234')
    .expect(404)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      done();
    });
  });
});