//dependencies
var utils = require('./utils');
var request = require('supertest');
var express = require('express');
var config = require('../config/config');
var mongoose = require('mongoose');
var ImageModel = require('../app/models/imageMetaData.js');
var should = require('should');
var _ = require('underscore');


// express server
var app = require('../app.js');
var hashKey;

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

      it('should assign a uuid key to an uploaded image', function(done) {
        request(app)
        .post('/upload?imgUrl=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
        .end(function(error, response) {
          if (error) {
            return done(error);
          }
          response.text = JSON.parse(response.text);
          
          //use for later request
          hashKey = response.text.imgId;

          response.text.should.be.a('object').and.have.property('imgId');
          done();
        });
      });

      it('should store the uuid into a local db', function(done) {
        request(app)
        .post('/upload?imgUrl=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
        .end(function(error, response) {
          if (error) {
            return done(error);
          }

          ImageModel.find({}, function(error, models) {
            _.each(models, function(model) {
              model.should.have.property('key', hashKey);
            });

            done();
          });
        });
      });

    });
});