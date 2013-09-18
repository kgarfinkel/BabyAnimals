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
var hashKey;

describe('#Resize', function() {
    
});