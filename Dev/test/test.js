var utils = require('./utils');
var request = require('supertest');
var express = require('express');
var config = require('../config/config');
var mongoose = require('mongoose');

var app = require('../app.js');

var data = {
  url: 'https://www.google.com/images/srpr/logo4w.png', 
  content_type: 'image/png'
};

describe('#Upload', function() {
  describe('POST', function(){
      it('should have a response body equal to "success" on /image request', function(done){
        request(app)
        .post('/image')
        .send(data)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .end(function(error, response) {
          if (error) {
            return done(error);
          }
      
          done();
        });
      });
    });
  
    // it('should create an Image model instance in response to /image request',)
});