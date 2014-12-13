"use strict";

var gulp    = require('gulp'),
    jshint  = require('gulp-jshint'),
    finder  = require('../helpers/finder'),
    config  = require('../config').scripts.lint;

module.exports = function() {
  return gulp.src(finder(config.dir, 'js'))
      .pipe(jshint(config.options))
      .pipe(jshint.reporter())
      .pipe(jshint.reporter('fail'));
};
