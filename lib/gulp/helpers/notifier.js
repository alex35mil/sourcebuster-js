"use strict";

var gutil     = require('gulp-util'),
    notifier  = require('node-notifier');

module.exports = function(file, is_fail, msg) {

  var say   = msg || 'Bundled!',
      color = is_fail ? 'red' : 'green';

  if (global.do_beep) {
    notifier.notify({
      title: file,
      message: say,
      sound: true
    });
  }

  gutil.log(say, gutil.colors[color](file));

};
