module.exports = {
  //send response statusCode and body
  postRes: function(req, res, key) {
    res.set('Content-Type', 'image/jpeg');
    res.status(201);
    res.send(JSON.stringify({id:key}));
  },

  //
  errRes: function(req, res) {
    res.status(404);
    res.send('image not found');
  },

  //send response object
  getRes: function(req, res, key) {
    res.set({'Content-Type': 'image/jpeg'});
    res.status(200);
    res.sendfile(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
  },

  delRes: function(req, res, key) {
    res.status(200);
    res.send('image' +  key + 'deleted');
  },

  metaData: function(req, res, key, w, h, statusCode) {
    var response = {};

    response.id = key;
    response.bucket = process.env.AWS_BUCKET;
    response.url = '/' + key;
    response.createdAt = new Date();
    response.width = w;
    response.height = h;
    res.set('Content-Type', 'image/jpeg');

    res.status(statusCode);
    res.send(JSON.stringify(response));
  }
};