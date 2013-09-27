var fs = require('fs'),
  _ = require('underscore');

// Helper function for cron job 
module.exports = function(dirPath) {
  fs.readdir(dirPath, function(err, files) {
    if (err) {
      console.error('</3');
      throw err; 
    } 

    if (files.length > 0) {
      _.each(files, function(file) {
        var filePath = dirPath + file;
        console.log('filepath', filePath);

        fs.stat(filePath, function(err, stats) {
          if (err) {
            console.error('</3');
            throw err;
          }
          
          if (stats.isFile()) {
            fs.unlink(filePath, function(err) {
              if (err) {
                console.error('</3');
                throw err;
              }
            });
          }
        });
      });
    }

  });
};