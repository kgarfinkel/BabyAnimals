//dependencies
var path = require('path');
var utils = require('./utils');
var config = require('../config/config');
var mongoose = require('mongoose');
var should = require('should');
var request = require('supertest');
var _ = require('underscore');
var im = require('imagemagick');
var imagePath = path.join(__dirname, './../data/images/');

// express server
var app = require('../app.js');
var key;

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

describe('#filters', function() {  
  describe('blur', function() {
    it('should respond 200 when blur is uploaded', function(done) {
      request(app)
      .get('/' + key + '/blur')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

      });    
    });
  });

  describe('charcoal', function() {
    it('should respond 200 when blur is uploaded', function(done) {
      request(app)
      .get('/' + key + '/charcoal')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

      });    
    });
  });

  describe('channel', function() {
    it('should respond 200 when blur is uploaded', function(done) {
      request(app)
      .get('/' + key + '/channel')
      .expect(200, done);   
    });
  });

  describe('brighten', function() {
    it('should respond 200 when blur is uploaded', function(done) {
      request(app)
      .get('/' + key + '/brighten')
      .expect(200, done);   
    });
  });

  describe('bw', function() {
    it('should respond 200 when blur is uploaded', function(done) {
      request(app)
      .get('/' + key + '/bw')
      .expect(200, done);
      //TODO: pipe request to imagemagick
      // .end(function(err, res) {
      //   if (err) {
      //     return done(err);
      //   }

      //   im.identify(imagePath + JSON.parse(res.text).id + '.jpg', function(err, features) {
      //     if (err) {
      //       return done(err);
      //     }

      //     features.colorspace.should.equal('Gray');

      //     return done();
      //   });

      // });    
    });
  });

  describe('sepia', function() {
    it('should respond 200 when sepia is uploaded', function(done) {
      request(app)
      .get('/' + key + '/sepia')
      .expect(200, done);    
    });
  });

  describe('lomo', function() {
    it('should respond 200 when lomo is uploaded', function(done) {
      request(app)
      .get('/' + key + '/lomo')
      .expect(200, done);   
    });
  });

  describe('gotham', function() {
    it('should respond 200 when gotham is uploaded', function(done) {
      request(app)
      .get('/' + key + '/gotham')
      .expect(200, done);   
    });
  });

  //TODO: fix spec
  describe('bw_grad', function() {
    it('transforms image to have a gray colorspace', function(done) {
      request(app)
      .get('/' + key + '/bw_grad')
      .expect(200, done); 
      //TODO: pipe to imagemagick
      // .end(function(err, res) {
      //   if (err) {
      //     return done(err);
      //   }

      //   im.identify(imagePath + JSON.parse(res.text).id + '.jpg', function(err, features) {
      //     if (err) {
      //       return done(err);
      //     }

      //     features.colorspace.should.equal('Gray');

      //     return done();
      //   });
      //});
    });
  });

  describe('vintage', function() {
    it('should respond 200 when vintage is uploaded', function(done) {
      request(app)
      .get('/' + key + '/vintage')
      .expect(200, done);   
    });
  });
});

