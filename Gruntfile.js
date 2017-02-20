const loadGrunt = require('load-grunt-tasks');

module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc.json'
      },
      target: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ]
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: true // clear the require cache before running tests
        },
        src: ['test/**/*.js']
      }
    }
  });

  loadGrunt(grunt);

  grunt.registerTask('default', ['lint', 'test']);
  grunt.registerTask('lint', 'eslint');
  grunt.registerTask('test', 'mochaTest');
};
