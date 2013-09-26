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
          'config/*.js',
          'lib/*.js'
        ],
        tasks: 'default'
      }
    },

    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logCurrentOutput: true
        }
      }
    },

    mochacov: {
      options: {
        reporter: 'spec',
        require: ['should'],
        ignoreLeaks: false,
        files: 'test/retrieveSpec.js'
      },

      htmlcov: {
        options: {
          reporter: 'html-cov',
          output: 'build/coverage.html'
        }
      },
      spec: {
        options: {
          reporter: 'spec',
          timeout: 10000
        }
      }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  //grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-cov');
  //grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('test', ['mochacov']);
  grunt.registerTask('default', ['develop', 'watch']);
  //grunt.registerTask('default', ['concurrent:target']);
};

