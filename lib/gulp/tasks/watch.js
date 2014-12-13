var gulp    = require('gulp'),
    finder  = require('../helpers/finder'),
    config  = require('../config');

gulp.task('watch', ['watching', 'build'], function() {
  gulp.watch(finder(config.css.in_dir),  ['css']);
  gulp.watch(finder(config.imgs.in_dir), ['imgs']);
  gulp.watch(finder(config.html.in_dir), ['html']);
});

gulp.task('watching', function() {
  global.is_watching = true;
});
