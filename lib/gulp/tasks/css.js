"use strict";

var gulp      = require('gulp'),
    sass      = require('gulp-sass'),
    prefix    = require('gulp-autoprefixer'),
    compress  = require('gulp-minify-css'),
    gulpif    = require('gulp-if'),
    rename    = require('gulp-rename'),
    notifier  = require('../helpers/notifier'),
    config    = require('../config').css;

gulp.task('css', function(cb) {

  var bundle_queue = config.bundle_configs.length;

  var sassThis = function(bundle_config) {

    var bundle = function() {
      return gulp.src(bundle_config.in_dir + bundle_config.in_file)
          .pipe(sass(config.sass))
          .pipe(prefix(config.autoprefixer))
          .pipe(gulpif(bundle_config.compress, compress(config.compress)))
          .pipe(gulpif(bundle_config.compress, rename({suffix: '.min'})))
          .pipe(gulp.dest(bundle_config.out_public_dir))
          .on('end', handleQueue);
    };

    var handleQueue = function() {
      notifier(bundle_config.out_file);
      if (bundle_queue) {
        bundle_queue--;
        if (bundle_queue === 0) {
          cb();
        }
      }
    };

    return bundle();
  };

  config.bundle_configs.forEach(sassThis);

});