//dependencies
var utils = require('./utils');
var config = require('../config/config');
var mongoose = require('mongoose');
var should = require('should');
var request = require('supertest');
var _ = require('underscore');
var im = require('imagemagick');
process.env.NODE_ENV = 'test';

// express server
var app = require('../app.js');
var key;

before(function(done) {
  request(app)
  .put('/upload?src=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
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
    it('should respond 200 when blur is uploaded', function() {
      request(app)
      .get('/' + key + '/blur')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('blur');
      });    
    });
  });

  xdescribe('charcoal', function() {
    it('should respond 200 when blur is uploaded', function() {
      request(app)
      .get('/' + key + '/charcoal')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('charcoal');
      });    
    });
  });

  xdescribe('channel', function() {
    it('should respond 200 when blur is uploaded', function() {
      request(app)
      .get('/' + key + '/channel')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('channel');
      });    
    });
  });

  xdescribe('brighten', function() {
    it('should respond 200 when blur is uploaded', function() {
      request(app)
      .get('/' + key + '/brighten')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('brighten');
      });    
    });
  });

  xdescribe('bw', function() {
    it('should respond 200 when blur is uploaded', function() {
      request(app)
      .get('/' + key + '/bw')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('bw');

        im.identify(process.env.LOCAL_FILE_PATH + '/' + JSON.parse(res.text).id + '.jpg', function(err, features) {
          if (err) {
            return done(err);
          }

          features.colorspace.should.equal('Gray');

          return done();
        });

      });    
    });
  });

  xdescribe('sepia', function() {
    it('should respond 200 when blur is uploaded', function() {
      request(app)
      .get('/' + key + '/sepia')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('sepia');
      });    
    });
  });

  xdescribe('lomo', function() {
    it('should respond 200 when blur is uploaded', function() {
      request(app)
      .get('/' + key + '/lomo')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('lomo');
      });    
    });
  });

  xdescribe('gotham', function() {
    it('should respond 200 when blur is uploaded', function() {
      request(app)
      .get('/' + key + '/gotham')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('gotham');
      });    
    });
  });

  //TODO: fix spec
  xdescribe('bw_grad', function() {
    it('transforms image to have a gray colorspace', function(done) {
      request(app)
      .get('/' + key + '/bw_grad')
      .expect(200) 
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('gotham');


        im.identify(process.env.LOCAL_FILE_PATH + '/' + JSON.parse(res.text).id + '.jpg', function(err, features) {
          if (err) {
            return done(err);
          }

          features.colorspace.should.equal('Gray');

          return done();
        });
      });
    });
  });

  xdescribe('vintage', function() {
    it('should respond 200 when blur is uploaded', function() {
      request(app)
      .get('/' + key + '/vintage')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var filter = JSON.parse(res.text).id.filter;
        filter.should.equal('vintage');
      });    
    });
  });
});

