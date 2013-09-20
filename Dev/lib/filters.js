//dependencies
var helpers = require('./helperfunctions');
var filterHelpers = require('./filterhelpers.js');
var upload = require('./upload');
var resize = require('./resize');
var fs = require('fs');
var gm = require('gm');
var im = require('imagemagick');
var uuid = require('node-uuid');
var knox = require('knox');
var spawn = require('child_process').spawn;
var Q = require('q');

module.exports = {
  //route filter based on filter param
  routeFilter: function(req, res) {
    filters[req.filter](req, res);  
  }
};

var filters = {
  blur : function(req, res) {
    //default values for radius and sigma of blur filter
    var rad = req.query.r || 2;
    var sig = req.query.s || 2;

    //create new s3 key
    var key = uuid.v4().split('-').pop();

    //read file at requested path
    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .blur(rad, sig)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    });  
  },

  charcoal: function(req, res) {
    //default value for charcoal factor
    var factor = req.query.f || 3;

    //create new s3 key
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .charcoal(factor)
    .write(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', function(err) {
      if (err) {
        throw err;
      }

      helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key );
    }); 
  },

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

  //brighten

  bw_grad: function(req, res)  {
    var w;
    var h;
    var key = uuid.v4().split('-').pop();
    
    //obtain the dimensions of the requested image
    im.convert([process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', '-colorspace', 'gray', process.env.LOCAL_FILE_PATH + 'temp_' + req.key + '.jpg' ], 
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

        Q.fcall(resize(req, res, w, h, key))
        .then(bw_grad2(req, res, key))
        .then(helpers.helper.upload(req, res, process.env.LOCAL_FILE_PATH + '/' + key + '.jpg', 'transform', key ))
        .catch(function(err) {
          throw err;
        });

      });
    });
  },

  vintage: function(req, res) {
    var w;
    var h;
    var key = uuid.v4().split('-').pop();

    im.identify(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(err, features) {
      if (err) {
        console.error('could not process image </3');
        throw err;
      }

      w = features.width;
      h = features.height;


      resize(req, res, w, h, key);
    });
  }
};


var resize =  function(req, res, w, h, key) {
  im.resize({
    srcPath: '/Users/Kristina/Desktop/antiquep.jpg',
    dstPath: '/Users/Kristina/Desktop/tempantique.jpg',
    width: w,
    height: h
  }, function(err, stdout, stderr) {
    if (err) {
      console.error('could not process image </3');
      throw err;
    }

    if (stderr) {
      throw stderr;
    }
  });

  addHipsterOverlay(res, req, key);

};

var addHipsterOverlay = function(res, req, key) {
  var args = [process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', '/Users/Kristina/Desktop/tempantique.jpg', '-compose', 'Overlay', '-composite', process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'];
  var convert = spawn('convert', args);

  convert.stdout.pipe(fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'));
};

// var bw_grad2 = function(res, req, key) {
//   console.log('key', key);
//   var args = ['-watermark', '90%', '-gravity', 'center', process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg' , '/Users/Kristina/Desktop/temp_bwgrad_1.jpg', '-'];
//   var composite = spawn('composite', args);
    
//   composite.stdout.pipe(fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'));
// };