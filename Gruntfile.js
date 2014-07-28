module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>.min.js (v.<%= pkg.version %>) - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'js/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqnull: true,
        eqeqeq: true,
        undef: true,
        expr: true,
        browser: true,
        nonstandard:true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        sub: true,
        boss: true,
        strict: false,
        indent: 2
      },
      beforeuglify: ['js/<%= pkg.name %>.js']
    }
  });

  // Load the plugin that provides "jshint" and "uglify" tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default tasks
  grunt.registerTask('default', ['jshint', 'uglify']);

};
