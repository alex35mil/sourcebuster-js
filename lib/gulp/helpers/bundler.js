"use strict";

module.exports = function(bundles, type, paths) {

  var makeBundle = function(bundle) {

    var type_dir = type + '/',
        in_dir = paths.in_base + type_dir,
        in_file = bundle.name + '.' + (type === 'css' ? '{sass,scss}' : type),
        out_dir = paths.out_public + type_dir,
        out_file = bundle.name + '.' + type;

    return {
      in_dir: in_dir,
      in_file: in_file,
      out_dist_dir: paths.out_dist,
      out_public_dir: out_dir,
      out_file: out_file,
      global: bundle.global,
      compress: bundle.compress,
      save_to_dist: bundle.save_to_dist
    };
  };

  var pack = [];
  for (var i = 0; i < bundles.length; i++) {
    pack.push(makeBundle(bundles[i]));
  }
  return pack;

};