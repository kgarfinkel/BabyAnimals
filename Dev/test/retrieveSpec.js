//dependencies
var utils = require('./utils');
var request = require('supertest');
var express = require('express');
var config = require('../config/config');
var mongoose = require('mongoose');
var ImageModel = require('../app/models/imageMetaData.js');
var should = require('should');

// express server
var app = require('../app.js');
var key;

describe('#retrieve', function() {
  before(function(done) {
    request(app)
    .post('/upload?imgUrl=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
    .expect(201)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      key = JSON.parse(res.text).imgId;
      done();
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

  it('should respond with a status of 404 when image has not been uploaded', function(done) {
    request(app)
    .get('1234')
    .expect(404)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      done();
    });
  });

  it('should respond with a sttus of 404 when image has been deleted', function(done) {
    //delete
    request(app)
    .get('/' + key)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(error);
      }
    });
  });
});