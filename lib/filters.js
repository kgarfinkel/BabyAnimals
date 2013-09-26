//dependencies
var helpers = require('./helperfunctions');
var filterHelp = require('./filterHelpers.js');
var fs = require('fs');
var gm = require('gm');
var im = require('imagemagick');
var uuid = require('node-uuid');
var spawn = require('child_process').spawn;

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

    //read file at requested path
    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .blur(rad, sig)
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        helpers.upload(req, res, key);
      });
    }); 
  },

  //charcoal image filter
  charcoal: function(req, res) {
    var key = uuid.v4().split('-').pop();
    var factor = req.query.f || 3;

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .charcoal(factor)
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        helpers.upload(req, res, key);
      });
    }); 
  },

  //channel image
  channel: function(req, res) {
    var type = req.query.t || 'red';
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .channel(type)
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        helpers.upload(req, res, key);
      });
    });  
  },

  nashville: function(req, res) {
    var key = uuid.v4().split('-').pop();
    var source = process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg';

    gm(source)
    .fill('#f7daae')
    .colorize(30)
    .fill('#222b6d')
    .colorize(20)
    .contrast(+2)
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        helpers.upload(req, res, key);
      });
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
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        helpers.upload(req, res, key);
      });
    });  
  },

  enhance: function(req, res) {
    var key = uuid.v4().split('-').pop();
    var source = process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg';
    var target = process.env.LOCAL_FILE_PATH + '/' + key + '.jpg';
    var args = [source, '-channel', 'R', '-level', '33%', '-channel', 'G', '-level', '33%', target];
    var convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg'));
    helpers.upload(req, res, key);
  },

  //standard black and gray filter
  bw: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .colorspace('Gray')
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        helpers.upload(req, res, key);
      });
    }); 
  },

  //standard sepia filter
  sepia: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .modulate(115, 0, 100)
    .colorize(7, 21, 50)
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        helpers.upload(req, res, key);
      });
    }); 
  },

  //TODO:check filter
  lomo: function(req, res) {
    var key = uuid.v4().split('-').pop();

    gm(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg')
    .fill('#222b6d')
    .colorize(30)
    .modulate(90, 80, 100)
    .compose('Over')
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        helpers.upload(req, res, key);
      });
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
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(process.env.LOCAL_FILE_PATH + '/' + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        helpers.upload(req, res, key);
      });
    }); 
  },

  //black and gray gradient filter
  bw_grad: function(req, res)  {
    var key = uuid.v4().split('-').pop();
  
    //convert requested image to grayscale    
    im.convert([process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', '-colorspace', 'gray', process.env.LOCAL_FILE_PATH + '/temp_' + req.key + '.jpg' ], 
    function(err, stdout){
      if (err) {
        throw err;
      }
      
      //obtain the dimensions of the requested image
      im.identify(process.env.LOCAL_FILE_PATH + '/temp_' + req.key + '.jpg', function(err, features) {
        if (err) {
          console.error('could not process image </3');
          throw err;
        }

        filterHelp.resizeBW(req, res, features.width, features.height, key, filterHelp.addBWGrad);
      });
    });
  },

  //noisy, vintage filter
  vintage: function(req, res) {
    var key = uuid.v4().split('-').pop();

    //obtain the dimensions of the requested image
    im.identify(process.env.LOCAL_FILE_PATH + '/' + req.key + '.jpg', function(err, features) {
      if (err) {
        console.error('could not process image </3');
        throw err;
      }

      filterHelp.resizeVintage(req, res, features.width, features.height, key, filterHelp.addHipsterOverlay);
    });
  }
};