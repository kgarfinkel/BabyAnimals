// Dependencies
var path = require('path'),
  helpers = require('./helperfunctions'),
  filterHelp = require('./filterhelpers'),
  response = require('./responseHelpers'),
  fs = require('fs'),
  gm = require('gm'),
  im = require('imagemagick'),
  uuid = require('node-uuid'),
  spawn = require('child_process').spawn,
  imagePath = '/tmp/';

module.exports = {
  // Route which filter should be applied based on the request filter param
  routeFilter: function(req, res) {
    filters[req.filter](req, res);  
  }
};

var filters = {
  // Blur filter
  // Defaults to a radius of 0 and a sigma of 6
  blur : function(req, res) {
    var key = uuid.v4().split('-').pop(),
      rad = req.query.r || 0,
      sig = req.query.s || 6;

    gm(imagePath + req.key + '.jpg')
    .blur(rad, sig)
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(imagePath + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();

        response.getRes(req, res, key);
      });
    }); 
  },

  // Charcoal image filter
  // Defaults to a factor of 3
  charcoal: function(req, res) {
    var key = uuid.v4().split('-').pop(),
      factor = req.query.f || 3;

    gm(imagePath + req.key + '.jpg')
    .charcoal(factor)
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(imagePath + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
      });
    }); 
  },

  // Channel image
  // Defaults to red channel
  channel: function(req, res) {
    var type = req.query.t || 'red',
      key = uuid.v4().split('-').pop();

    gm(imagePath + req.key + '.jpg')
    .channel(type)
    .stream(function(err, stdout, stderr) {
      var writeStream = fs.createWriteStream(imagePath + key + '.jpg');
      
      stdout.pipe(writeStream);

      stdout.on('close', function() {
        writeStream.close();
        response.getRes(req, res, key);
      });
    });  
  },

  // Nashville filter
  // Tints with peach and blue, and increases the contrast of the image 
  nashville: function(req, res) {
    var key = uuid.v4().split('-').pop(),
      source = imagePath + req.key + '.jpg',
      target = imagePath + key + '.jpg',
      args = [source, '-fill', '#f7daae', '-colorize', '20', '-fill','#222b6d', '-colorize', '20', '+contrast', '+contrast', target],
      convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(target));
      
    convert.on('close', function() {
      response.getRes(req, res, key);
    });
  },

  // Auroral filter
  // Increase hue, brightness, and saturation
  // Tint with red tone
  auroral: function(req, res) {
    var key = uuid.v4().split('-').pop(),
      source = imagePath + req.key + '.jpg',
      target = imagePath + key + '.jpg',
      args = [source, '-modulate', '150,80,80', '-fill', '#330000', '-colorize', '40', '+contrast', '+contrast', target],
      convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(target));
      
    convert.on('close', function() {
      response.getRes(req, res, key);
    }); 
  },

  // Enhance filter
  // Increase red and green channels
  enhance: function(req, res) {
    var key = uuid.v4().split('-').pop(),
      source = imagePath + req.key + '.jpg',
      target = imagePath + key + '.jpg',
      args = [source, '-channel', 'R', '-level', '33%', '-channel', 'G', '-level', '33%', target],
      convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(target));
    
    convert.on('close', function() {
      response.getRes(req, res, key);
    });
  },

  // Standard black and gray filter
  bw: function(req, res) {
    var key = uuid.v4().split('-').pop(),
      source = imagePath + req.key + '.jpg',
      target = imagePath + key + '.jpg',
      args = [source, '-colorspace', 'Gray', target],
      convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(target));
    
    convert.on('close', function() {
      response.getRes(req, res, key);
    });
  },

  // Standard sepia filter
  sepia: function(req, res) {
    var key = uuid.v4().split('-').pop(),
      source = imagePath + req.key + '.jpg',
      target = imagePath + key + '.jpg',
      args = [source, '-modulate', '115,0,100', '-colorize', '7,21,50', target],
      convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(target));
    
    convert.on('close', function() {
      response.getRes(req, res, key);
    });
  },

  // Lomo filter
  // Tint with indigo
  // Decrease brightness and saturation
  lomo: function(req, res) {
    var key = uuid.v4().split('-').pop(),
      source = imagePath + req.key + '.jpg',
      target = imagePath + key + '.jpg',
      args = [source, '-fill', '#222b6d', '-colorize', '30','-modulate', '90,80,100', '-compose', 'Over', target],
      convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(target));
      
    convert.on('close', function() {
      response.getRes(req, res, key);
    });
  },

  // Gothic filter 
  // Tint with blue
  // Increase contrast
  gotham: function(req, res) {
    var key = uuid.v4().split('-').pop(),
      source = imagePath + req.key + '.jpg',
      target = imagePath + key + '.jpg',
      args = [source,'-colorspace', 'gray', '-modulate', '120,100,100', '-fill', '#222b6d', '-colorize', '20', '-gamma', '0.5', '+contrast', '+contrast', '-compose', 'Over', 
      '-bordercolor', 'black', '-border', '7', target],
      convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(target));
    
    convert.on('close', function() {
      response.getRes(req, res, key);
    }); 
  },

  // Black and white gradient filter
  // Convert target image to grayscale
  // Overlay target image with a gradient image
  bw_grad: function(req, res)  {
    var key = uuid.v4().split('-').pop(),
      source = imagePath + req.key + '.jpg',
      target = imagePath + key + '.jpg',
      args = [source, '-colorspace', 'gray', target],
      convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(target));
    
    convert.on('close', function() {
      //obtain the dimensions of the requested image
      im.identify(target, function(err, features) {
        if (err) {
          console.error('Image transformation failed with error:', err);
          throw err;
        }

        filterHelp.resizeBW(req, res, features.width, features.height, key, filterHelp.addBWGrad);
      });
    });
  },

  // Vintage filter
  // Overlay target image with antique image
  vintage: function(req, res) {
    var key = uuid.v4().split('-').pop(),
      source = imagePath + req.key + '.jpg',
      target = imagePath + key + '.jpg',
      args = [source, target],
      convert = spawn('convert', args);

    convert.stdout.pipe(fs.createWriteStream(target));
      
    convert.on('close', function() {
      //obtain the dimensions of the requested image
      im.identify(target, function(err, features) {
        if (err) {
          console.error('Image transformation failed with error:', err);
          throw err;
        }

        filterHelp.resizeVintage(req, res, features.width, features.height, key);
      });
    }); 
  }
};