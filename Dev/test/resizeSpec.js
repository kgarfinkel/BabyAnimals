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

describe('#resize', function() {
  before(function(done) {
    request(app)
    .post('/upload?imgUrl=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      key = JSON.parse(res.text).imgId;
      done();
    });
  });

  it('should resize image if dimension queries are provided', function(done) {
    request(app)
    .get('/' + key + '/' + '?w=100&h=200')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      im.identify(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err, features) {
        if (err) {
          throw err;
        }

        features.width.should.equal(100);
        features.height.should.equal(200);
      });

      done();
    });
  });
});