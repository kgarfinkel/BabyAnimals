//dependencies
var utils = require('./utils');
var config = require('../config/config');
var mongoose = require('mongoose');
var should = require('should');
var request = require('request');
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
    request.post('http://localhost:3000/upload?src=http://1.bp.blogspot.com/-HGBIS_Y39fk/TcgNplmclcI/AAAAAAAAZQE/KuzLXzyxhGQ/s400/Beautiful-Cute-Baby-Animals-Photos1.jpg', function(err, res) {
      if (err) {
        return done(err);
      }

      key = JSON.parse(res.body).id;
      res.statusCode.should.be.equal(201);
      return done;
    });
  });

  it('should respond with a status of 200 when image is retrieved', function(done) {
    request.get('http://localhost:3000/', function(err, res) {
      if (err) {
        return done(err);
      }

      res.statusCode.should.be.equal(200);
      return done;
    });
  });

  it('should respond with a status of 404 when image does not exist', function(done) {
    request.get('http://localhost:3000/1234', function(err, res) {
      if (err) {
        return done(err);
      }

      res.statusCode.should.be.equal(404);
      return done;
    });
  });
});