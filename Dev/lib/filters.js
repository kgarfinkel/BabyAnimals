//dependencies
var helpers = require('./helperfunctions');
var filterHelp = require('./filterhelpers.js');
var fs = require('fs');
var gm = require('gm');
var im = require('imagemagick');
var uuid = require('node-uuid');
var Q = require('q');

module.exports = {
  //route filter based on filter param
  routeFilter: function(req, res) {
    filters[req.filter](req, res);  
  }
};

var filters = {
  //blur image filter
  blur : function(req, res) {
    var key = uuid.v4().split('-').pop();
    var rad = req.query.r || 0;
    var sig = req.query.s || 6;
    var w, h;

    //read file at requested path
    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .blur(rad, sig)
    .size(function (err, size) {
      if (err) {
        console.log('</3');
        throw err;
      }

      w = size.width;
      h = size.height; 
    })
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      Q.fcall(helpers.helper.upload(req, res, 'blur', key))
      .then(helpers.helper.addToDb(req, res, key))
      .then(helpers.helper.getDimensions(req, res, key, 'blur'))
      .then(helpers.helper.response(req, res, key, w, h, 'blur'));
    });  
  },

  //charcoal image filter
  charcoal: function(req, res) {
    var key = uuid.v4().split('-').pop();
    var factor = req.query.f || 3;
    var w, h;

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .charcoal(factor)
    .size(function (err, size) {
      if (err) {
        console.log('</3');
        throw err;
      }

      w = size.width;
      h = size.height;
    })
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      Q.fcall(helpers.helper.upload(req, res, 'charcoal', key))
      .then(helpers.helper.addToDb(req, res, key))
      .then(helpers.helper.getDimensions(req, res, key, 'charcoal'))
      .then(helpers.helper.response(req, res, key, w, h, 'charcoal'));
    }); 
  },

  //channel image
  channel: function(req, res) {
    //default value for color type
    var type = req.query.t || 'red';

    //create new s3 key
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .channel(type)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    }); 
  },

  //TODO: take out?
  brighten: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .modulate(150, 80, 80)
    .gamma(1.2)
    .fill('#330000')
    .colorize(40)
    .contrast(+1)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    }); 
  },

  //standard black and gray filter
  bw: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .colorspace('Gray')
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    });
  },

  //standard sepia filter
  sepia: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .modulate(115, 0, 100)
    .colorize(7, 21, 50)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    });
  },

  //TODO:check filter
  lomo: function(req, res) {
    console.log('red');
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .fill('#222b6d')
    .colorize(30)
    .modulate(90, 80, 100)
    .compose('Over')
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    });
  },

  //gothic filter with black border
  gotham: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .modulate(120, 10, 100)
    .fill('#222b6d')
    .colorize(20)
    .gamma(0.5)
    .contrast()
    .contrast()
    .compose('Over')
    .borderColor('black')
    .border(7,7)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    });
  },

  //black and gray gradient filter
  bw_grad: function(req, res)  {
    var w;
    var h;
    var key = uuid.v4().split('-').pop();
    
    //obtain the dimensions of the requested image
    im.convert([process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', '-colorspace', 'gray', process.env.LOCAL_FILE_PATH + '/temp_' + req.key + '.jpg' ], 
    function(err, stdout){
      if (err) {
        throw err;
      }
    
      im.identify(process.env.LOCAL_FILE_PATH + '/temp_' + req.key + '.jpg', function(err, features) {
        if (err) {
          console.error('could not process image </3');
          throw err;
        }

        w = features.width;
        h = features.height;

        Q.fcall(filterHelp.resizeBW(req, res, w, h, key))
        .then(filterHelp.addBWGrad(res, req, key))
        .then(helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key ))
        .catch(function(err) {
          throw err;
        });

      });
    });
  },

  //noisy, vintage filter
  vintage: function(req, res) {
    var key = uuid.v4().split('-').pop();
    var w;
    var h;

    im.identify(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(err, features) {
      if (err) {
        console.error('could not process image </3');
        throw err;
      }

      w = features.width;
      h = features.height;

      Q.fcall(filterHelp.resizeVintage(req, res, w, h, key))
      .then(filterHelp.addHipsterOverlay(res, req, key))
      .then(helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key ))
      .then(helpers.helper.addToDb(req, res, key))
      .then(helpers.helper.response(req, res, key, w, h, 'vintage'))
      .catch(function(err) {
        throw err;
      });
    });
  }
};