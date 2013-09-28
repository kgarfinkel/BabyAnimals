//dependencies
var path = require('path');
var utils = require('./utils');
var fs = require('fs');
var config = require('../config/config');
var mongoose = require('mongoose');
var should = require('should');
var request = require('supertest');
var _ = require('underscore');
var im = require('imagemagick');
var imagePath = '/tmp/';

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
    .post('/upload?src=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
    .expect(201)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      key = JSON.parse(res.text).id;
      return done();
    });
  });

  it('should respond with a status of 200 when image is retrieved', function(done) {
    request(app)
    .get('/' + key)
    .expect(200, done);
  });

  it('should resize image if dimension queries are provided', function(done) {
    var stream = fs.createWriteStream('./tempimage');
    request(app)
    .get('/' + key + '/size?w=200&h=200')
    .expect(200, done);
    //TODO: pipe request to imagemagick
    // .end(function(err, res) {
    //   if (err) {
    //     return done(err);
    //   }

    //   im.identify(imagePath + newKey + '.jpg', function(err, features) {
    //     if (err) {
    //       return done(err);
    //     }

    //     features.width.should.equal(200);

    //     return done();
    //   });
    // });
  });

  it('should resize image if only width query is provided', function(done) {
    request(app)
    .get('/' + key + '/size?w=200')
    .expect(200, done);
    // .end(function(err, res) {
    //   if (err) {
    //     return done(err);
    //   }

    //   var newKey = JSON.parse(res.text).id;

    //   im.identify(imagePath + newKey + '.jpg', function(err, features) {
    //     if (err) {
    //       return done(err);
    //     }

    //     features.width.should.equal(200);
    //     features.height.should.equal(157);

    //     return done();
    //   });
    // });
  });

  it('should resize image if only height query is provided', function(done) {
    request(app)
    .get('/' + key + '/size?h=100')
    .expect(200, done);
    // .end(function(err, res) {
    //   if (err) {
    //     return done(err);
    //   }

    //   var newKey = JSON.parse(res.text).id;

    //   im.identify(imagePath + newKey + '.jpg', function(err, features) {
    //     if (err) {
    //       return done(err);
    //     }

    //     features.width.should.equal(128);
    //     features.height.should.equal(100);

    //     return done();
    //   });
    // });
  });

  it('should respond 404 if image requested is not uploaded', function(done) {
    request(app)
    .get('/1234/size?h=100')
    .expect(404, done);
    // .end(function(err, res) {
    //   if (err) {
    //     return done(err);
    //   }

    //   return done();
    // });
  });
});