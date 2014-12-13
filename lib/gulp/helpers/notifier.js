"use strict";

var gutil     = require('gulp-util'),
    notifier  = require('node-notifier');

module.exports = function(file) {
  if (global.do_beep) {
    notifier.notify({
      title: file,
      message: 'Done!',
      sound: true
    });
  }
  gutil.log('Bundled!', gutil.colors.green(file));
};