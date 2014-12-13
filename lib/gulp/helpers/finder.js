"use strict";

module.exports = function(location, extension) {
  var files = [];
  if (extension) {
    files.push(location + '*.' + extension);
    files.push(location + '**/*.' + extension);
  } else {
    files.push(location + '**')
  }
  return files;
};
