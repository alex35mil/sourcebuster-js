"use strict";

var gulp      = require('gulp'),
    slim      = require('gulp-slim'),
    gulpif    = require('gulp-if'),
    changed   = require('gulp-changed'),
    finder    = require('../helpers/finder'),
    notifier  = require('../helpers/notifier'),
    config    = require('../config').html;

gulp.task('html', function(cb) {
  gulp.src(finder(config.in_dir, 'slim'))
      .pipe(gulpif(global.not_4production, changed(config.out_dir)))
      .pipe(slim(config.slim_options))
      .pipe(gulp.dest(config.out_dir))
      .on('end', function() {
          notifier('html');
          cb();
      });

});