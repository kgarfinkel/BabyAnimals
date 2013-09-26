//dependencies
//var utils = require('./utils');
var request = require('supertest');
var ImageModel = require('../app/models/imageMetaData');
var should = require('should');
var mongoose = require('mongoose');
var _ = require('underscore');


// express server
var app = require('../app.js');

//global image key
var key;

describe('#Upload', function() {
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

  describe('response', function(){
    it('should respond with status 201 and a JSON object when a url is requested', function(done){
      request(app)
      .post('/upload?src=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
      .expect(201, done)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        //response.body.should.be.a('object');
        return done();
      });
    });

    it('should add two numbers', function() {
      var two = true;
      two.should.be.true;
    });

    //TODO: handle spec
    it('should respond with status 201 and a JSON object when a local file is requested', function(done) {
      request(app)
      .post('/upload?src=/Users/Kristina/Desktop/newbw.jpg')
      .expect(201, done)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        //response.body.should.be.a('object');
        return done();
      });
    });
  });

  xdescribe('id assingment', function() {
    it('should assign a uuid key to an uploaded image', function(done) {
      request(app)
      .post('/upload?src=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        JSON.parse(response.text).should.have.property('id');
        return done();
      });
    });
  });

  describe('storage', function() {
    it('should store the uuid into a local db', function(done) {
      request(app)
      .post('/upload?src=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        var hasKey = false;
        key = JSON.parse(response.text).id;
        
        ImageModel.find({}, function(error, models) {
          lastModel = models[-1];

          _.each(models, function(model) {
            if (model.key === key) {
              hasKey = true;
            }            
          });

          hasKey.should.be.true;
          
          return done();
        });
      });

      it('should store the uploaded image in S3 bucket', function(done) {
        request(app)
        .get('https://testbucket1989.s3.amazonaws.com/' +  key)
        .expect(200)
        .end(function(error, response) {
          if (error) {
            return done(error);
          }

          return done();
        });
      });
    });
  });
});