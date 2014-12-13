"use strict";

var requireDir = require('require-dir');

global.not_4production = process.env.NODE_ENV !== 'production';

requireDir('./lib/gulp/tasks', { recurse: true });