"use strict";

var gulp        = require('gulp'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    uglify      = require('gulp-uglify'),
    sourcemaps  = require('gulp-sourcemaps'),
    derequire   = require('gulp-derequire'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    rename      = require('gulp-rename'),
    header      = require('gulp-header'),
    gulpif      = require('gulp-if'),
    linter      = require('../helpers/linter'),
    notifier    = require('../helpers/notifier'),
    config      = require('../config').scripts;

gulp.task('scripts', function(cb) {

  var bundle_queue = config.bundle_configs.length,
      not_4production = process.env.NODE_ENV !== 'production';

  var browserifyThis = function(bundle_config) {

    var bundler = browserify({
      cache: {}, packageCache: {}, fullPaths: not_4production,
      entries: bundle_config.in_dir + bundle_config.in_file,
      standalone: bundle_config.global,
      extensions: config.extensions,
      debug: config.debug
    });

    var bundle = function() {

      linter();

      return bundler
          .bundle()
          .pipe(source(bundle_config.out_file))
          .pipe(derequire())
          .pipe(gulpif(global.not_4production, gulp.dest(bundle_config.out_public_dir)))
          .pipe(gulpif(bundle_config.save_to_dist, gulp.dest(bundle_config.out_dist_dir)))
          .pipe(gulpif(bundle_config.compress, buffer()))
          .pipe(gulpif(bundle_config.compress && global.not_4production, sourcemaps.init({loadMaps: true})))
          .pipe(gulpif(bundle_config.compress, uglify()))
          .pipe(gulpif(bundle_config.compress, rename({suffix: '.min'})))
          .pipe(gulpif(!global.not_4production, header(config.banner)))
          .pipe(gulpif(bundle_config.compress && global.not_4production, sourcemaps.write('./')))
          .pipe(gulpif(bundle_config.save_to_dist, gulp.dest(bundle_config.out_dist_dir)))
          .pipe(gulp.dest(bundle_config.out_public_dir))
          .on('end', handleQueue);
    };

    if (global.is_watching) {
      bundler = watchify(bundler);
      bundler.on('update', bundle);
    }

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

  config.bundle_configs.forEach(browserifyThis);

});

gulp.task('lint', function() {
  linter();
});
