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

//test data
var data = {
  url: 'https://www.google.com/images/srpr/logo4w.png', 
  content_type: 'image/png'
};

describe('#Upload', function() {
  describe('POST', function(){
      it('should have a response with status 200 on /image request', function(done){
        request(app)
        .post('/upload?imgUrl=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
        .expect(200)
        .end(function(error, response) {
          if (error) {
            return done(error);
          }
      
          done();
        });
      });


      // it('should send an ImageMetaData instance in response to /image request', function(done) {
      //   request(app)
      //   .post('/image')
      //   .send(data)
      //   .set('Accept', 'application/json')
      //   .end(function(error, response) {
      //     if (error) {
      //       return done(error);
      //     }

      //     response.body.should.be.a('object').and.have.property('url', 'https://www.google.com/images/srpr/logo4w.png');
      //     response.body.should.have.property('format', 'image/png');
      //     done();
      //   });
      // });

      // it('should store ImageMetaData instance into local db', function(done) {
      //   request(app)
      //   .post('/image')
      //   .send(data)
      //   .end(function(error, response) {
      //     if (error) {
      //       return done(error);
      //     }


      //     ImageModel.find({}, function(err, models) {
      //       models.should.have.length(1);
      //     });

      //     done();
      //   });
      // });
    });
});