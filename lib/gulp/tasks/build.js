"use strict";

var gulp    = require('gulp'),
    del     = require('del'),
    finder  = require('../helpers/finder'),
    config  = require('../config').clean;

gulp.task('bundle', ['scripts', 'css', 'imgs', 'html'], function() {
  if (global.not_4production) { global.do_beep = true; }
});

gulp.task('clean', function(cb) {

  del([].concat(
          finder(config.html, 'html'),
          finder(config.imgs),
          finder(config.css, 'css'),
          finder(config.scripts, 'js'),
          finder(config.scripts, 'map'),
          finder(config.dist, 'js'),
          finder(config.dist, 'map')
      ),
      cb
  );

});

gulp.task('build', ['clean'], function() {
  gulp.start('bundle')
});
