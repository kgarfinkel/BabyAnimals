//dependencies
var utils = require('./utils');
var config = require('../config/config');
var mongoose = require('mongoose');
var should = require('should');
var request = require('supertest');
var _ = require('underscore');
var im = require('imagemagick');

// express server
var app = require('../app.js');
var key;

describe('#bw', function() {
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
      if (err) {
        return done(err);
      }

      key = JSON.parse(res.text).imgId;
      return done();
    });
  });

  it('transforms image to have a gray colorspace', function(done) {
    request(app)
    .get('/' + key + '/bw')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      im.identify(process.env.LOCAL_FILE_PATH + '/' + JSON.parse(res.text).imgId + '.jpg', function(err, features) {
        if (err) {
          return done(err);
        }

        features.colorspace.should.equal('Gray');

        return done();
      });
    });
  });
});