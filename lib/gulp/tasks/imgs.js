"use strict";

var gulp      = require('gulp'),
    changed   = require('gulp-changed'),
    gulpif    = require('gulp-if'),
//  imgmin    = require('gulp-imagemin'),
    notifier  = require('../helpers/notifier'),
    finder    = require('../helpers/finder'),
    config    = require('../config').imgs;

gulp.task('imgs', function(cb) {

  gulp.src(finder(config.in_dir))
      .pipe(gulpif(global.not_4production, changed(config.out_dir)))
//    .pipe(imgmin(config.imagemin))
      .pipe(gulp.dest(config.out_dir))
      .on('end', function() {
          notifier('imgs');
          cb();
      });

});