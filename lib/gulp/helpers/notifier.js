"use strict";

var gutil     = require('gulp-util'),
    notifier  = require('node-notifier');

module.exports = function(file, is_fail, msg) {

  var say   = msg || 'Bundled!',
      color = is_fail ? 'red' : 'green',
      icon = is_fail ? '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns' : false;

  if (global.do_beep) {
    notifier.notify({
      title: file,
      message: say,
      icon: icon,
      sound: true
    });
  }

  gutil.log(say, gutil.colors[color](file));

};
