// Dependencies
var path = require('path'),
  imagePath = '/tmp/';

module.exports = {
  // Send POST response
  postRes: function(req, res, key) {
    res.set('Content-Type', 'image/jpeg');
    res.status(201);
    res.json({id:key});
  },

  // Send error response
  errRes: function(req, res, statusCode, body) {
    statusCode = statusCode || 404;
    body = body || 'image not found';
    res.status(statusCode);
    res.send(body);
  },

  // Send GET response
  getRes: function(req, res, key) {
    res.set({'Content-Type': 'image/jpeg'});
    res.status(200);
    res.sendfile(imagePath + key + '.jpg');
  },

  // Send DELETE response
  delRes: function(req, res, key) {
    res.status(204);
    res.json({id:key});
  },

  // Send JSON with metadata for requested image
  metaData: function(req, res, key, features, statusCode) {
    var response = {};

    response.id = key;
    response.bucket = process.env.AWS_BUCKET;
    response.url = '/babyanimals' + key;
    response.createdAt = new Date();
    response.width = features.width;
    response.height = features.height;
    response.filesize = features.filesize;
    response.format = features.format;

    res.status(statusCode);
    res.json(response);
  }
};