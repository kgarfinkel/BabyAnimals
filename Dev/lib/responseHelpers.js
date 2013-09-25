module.exports = {
  //send response statusCode and body
  getRes: function(req, res, statusCode, key) {
    res.set('Content-Type', 'image/jpeg');
    res.status(statusCode);
    res.send(JSON.stringify({id:key}));
  },

  //send response object
  postRes: function(req, res, key, statusCode) {
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