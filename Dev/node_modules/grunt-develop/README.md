
# grunt-develop [![Build Status](https://secure.travis-ci.org/edwardhotchkiss/grunt-develop.png)](http://travis-ci.org/edwardhotchkiss/grunt-develop)

> Run a Node.js application for development, with support for auto-reload.

## Notes:

  * Requires Grunt >= 0.4.0;
  * does not provide a file-watch, [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)
    is helpful here;
  * no need to modify/export your server or alter your applications code;
  * is not blocking (the task completes immediately and the application will
    run in the background);
  * reloads cleanly the application when the task is called again,
    allowing for auto-reload.

## Install

```bash
$ npm install grunt-develop
```

## Basic Gruntfile.js Example

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    develop: {
      server: {
        file: 'app.js',
        nodeArgs: ['--debug'],            // optional
        args: ['appArg1', 'appArg2']      // optional
      }
    }
  });

  grunt.loadNpmTasks('grunt-develop');

  grunt.registerTask('default', ['develop']);

};
```

## A more complex Gruntfile.js

 To support auto-reload on changes, for example:

```javascript
module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      js: {
        files: [
          'app.js',
          'routes/**/*.js',
          'lib/*.js'
        ],
        tasks: ['develop'],
        options: { nospawn: true }
      }
    },
    develop: {
      server: {
        file: 'app.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-develop');

  grunt.registerTask('default', ['develop']);

};
```

The [nospawn](https://github.com/gruntjs/grunt-contrib-watch/blob/master/README.md#optionsnospawn)
is required to keep the grunt context in which `grunt-develop` is running
your application.

Then you can run grunt as the following and get automatic restart of the
application on file changes:

```bash
$ grunt
```

You may add any other task in the watch, like JS linting, asset compiling,
etc. and customize the watch to your needs. See
[grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch).

## License (MIT)

Copyright (c) 2013, Edward Hotchkiss.

## Author: [Edward Hotchkiss][0]

[0]: http://github.com/edwardhotchkiss/
