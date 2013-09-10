var request = require('request');

module.exports = function (grunt) {
  var files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },

    nodemon: {
      dev: {}
    },

    watch: {
      options: {
        nospawn: true,
      },

      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js'
        ],
        tasks: ['develop', 'nodemon']
      }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['develop', 'watch']);
};

