// Dependencies
var path = require('path'),
  imagePath = path.join(__dirname, '..', 'data', 'images/');

module.exports = {
  // Send POST response
  postRes: function(req, res, key) {
    res.set('Content-Type', 'image/jpeg');
    res.status(201);
    res.send(JSON.stringify({id:key}));
  },

  // Send error response
  errRes: function(req, res, statusCode) {
    statusCode = statusCode || 404;
    res.status(statusCode);
    res.send('image not found');
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
    res.send('image' +  key + 'deleted');
  },

  // Send JSON with metadata for requested image
  metaData: function(req, res, key, w, h, statusCode) {
    var response = {};

    response.id = key;
    response.bucket = process.env.AWS_BUCKET;
    response.url = '/' + key;
    response.createdAt = new Date();
    response.width = w;
    response.height = h;

    res.status(statusCode);
    res.send(JSON.stringify(response));
  }
};