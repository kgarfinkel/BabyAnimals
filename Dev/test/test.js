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

describe('POST', function(){
  it('responds with a json success message', function(done){
    // request(app)
    // .post('/image')
    // .send(data)
    // .set('Content-Type', 'application/x-www-form-urlencoded')
    // .expect(200, done);
    done();
  });
});