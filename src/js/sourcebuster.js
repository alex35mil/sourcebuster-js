"use strict";

var init = require('./init');

var sbjs = {
  init: function(params) {
    this.get = init(params);
    if (params.callback && typeof params.callback === 'function') {
      params.callback(this.get);
    }
  }
};

module.exports = sbjs;