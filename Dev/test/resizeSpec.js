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

      return done();
    });
  });

  it('should resize image if dimension queries are provided', function(done) {
    request(app)
    .get('/' + key + '/size?w=100&h=200')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      var newKey = JSON.parse(res.text).imgId;

      im.identify(process.env.LOCAL_FILE_PATH + '/' + newKey + '.jpg', function(err, features) {
        if (err) {
          return done(err);
        }

        features.width.should.equal(100);
        features.height.should.equal(200);

        return done();
      });
    });
  });

  it('should resize image if only width query is provided', function(done) {
    request(app)
    .get('/' + key + '/size?w=100')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      var newKey = JSON.parse(res.text).imgId;

      im.identify(process.env.LOCAL_FILE_PATH + '/' + newKey + '.jpg', function(err, features) {
        if (err) {
          return done(err);
        }

        features.width.should.equal(100);
        features.height.should.equal(200);

        return done();
      });
    });
  });

  it('should resize image if only height query is provided', function(done) {
    request(app)
    .get('/' + key + '/size?h=100')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      var newKey = JSON.parse(res.text).imgId;

      im.identify(process.env.LOCAL_FILE_PATH + '/' + newKey + '.jpg', function(err, features) {
        if (err) {
          return done(err);
        }

        features.width.should.equal(100);
        features.height.should.equal(200);

        return done();
      });
    });
  });

  it('should respond 404 if image requested is not uploaded', function(done) {
    request(app)
    .get('/1234/size?h=100')
    .expect(404)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      return done();
    });
  });
});