//dependencies
var utils = require('./utils');
var request = require('supertest');
var ImageModel = require('../app/models/imageMetaData.js');
var should = require('should');
var _ = require('underscore');


// express server
var app = require('../app.js');
var key;

describe('#Upload', function() {
  describe('POST', function(){
      it('should respond with status 201 and a JSON object', function(done){
        request(app)
        .post('/upload?imgUrl=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
        .expect(201)
        .end(function(error, response) {
          if (error) {
            return done(error);
          }
          
          response.body.should.be.a('object');
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

          JSON.parse(response.text).should.have.property('imgId');
          done();
        });
      });

      it('should store the uuid into a local db', function(done) {
        request(app)
        .post('/upload?imgUrl=http://maxcdn.thedesigninspiration.com/wp-content/uploads/2009/09/cute-animals/baby01.jpg')
        .end(function(error, response) {
          var hasKey = false;

          if (error) {
            return done(error);
          }

          key = JSON.parse(response.text).imgId;
          
          ImageModel.find({}, function(error, models) {
            lastModel = models[-1];

            _.each(models, function(model) {
              if (model.key === key) {
                hasKey = true;
              }            
            });

            hasKey.should.be.true;
            done();
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

            done();
          });
        });
      });

    });
});