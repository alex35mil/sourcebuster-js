"use strict";

var terms = require('./terms'),
    uri   = require('./helpers/uri');

module.exports = {

  fetch: function(u) {

    var params = {};

    // Set `lifetime of the cookie` in months
    params.lifetime = this.validate.checkFloat(u.lifetime) || 6;
    params.lifetime = parseInt(params.lifetime * 30 * 24 * 60);

    // Set `session length` in minutes
    params.session_length = this.validate.checkInt(u.session_length) || 30;

    // Set `timezone offset` in hours
    params.timezone_offset = this.validate.checkInt(u.timezone_offset);

    // Set `campaign param` for AdWords links
    params.campaign_param = u.campaign_param || false;

    // Set `user ip`
    params.user_ip = u.user_ip || terms.none;

    // Set `promocode`
    if (u.promocode) {
      params.promocode = {};
      params.promocode.min = parseInt(u.promocode.min) || 100000;
      params.promocode.max = parseInt(u.promocode.max) || 999999;
    } else {
      params.promocode = false;
    }

    // Set `typein attributes`
    if (u.typein_attributes && u.typein_attributes.source && u.typein_attributes.medium) {
      params.typein_attributes = {};
      params.typein_attributes.source = u.typein_attributes.source;
      params.typein_attributes.medium = u.typein_attributes.medium;
    } else {
      params.typein_attributes = { source: '(direct)', medium: '(none)' };
    }

    // Set `domain`
    if (u.domain && this.validate.isString(u.domain)) {
      params.domain = { host: u.domain, isolate: false };
    } else if (u.domain && u.domain.host) {
      params.domain = u.domain;
    } else {
      params.domain = { host: uri.getHost(document.location.hostname), isolate: false };
    }

    // Set `referral sources`
    params.referrals = [];

    if (u.referrals && u.referrals.length > 0) {
      for (var ir = 0; ir < u.referrals.length; ir++) {
        if (u.referrals[ir].host) {
          params.referrals.push(u.referrals[ir]);
        }
      }
    }

    // Set `organic sources`
    params.organics = [];

    if (u.organics && u.organics.length > 0) {
      for (var io = 0; io < u.organics.length; io++) {
        if (u.organics[io].host && u.organics[io].param) {
          params.organics.push(u.organics[io]);
        }
      }
    }

    params.organics.push({ host: 'bing.com',      param: 'q',     display: 'bing'       });
    params.organics.push({ host: 'yahoo.com',     param: 'p',     display: 'yahoo'      });
    params.organics.push({ host: 'about.com',     param: 'q',     display: 'about'      });
    params.organics.push({ host: 'aol.com',       param: 'q',     display: 'aol'        });
    params.organics.push({ host: 'ask.com',       param: 'q',     display: 'ask'        });
    params.organics.push({ host: 'globososo.com', param: 'q',     display: 'globo'      });
    params.organics.push({ host: 'go.mail.ru',    param: 'q',     display: 'go.mail.ru' });
    params.organics.push({ host: 'rambler.ru',    param: 'query', display: 'rambler'    });
    params.organics.push({ host: 'tut.by',        param: 'query', display: 'tut.by'     });

    return params;

  },

  validate: {

    checkFloat: function(v) {
      return v && this.validate.isNumeric(parseFloat(v)) ? parseFloat(v) : false;
    },

    checkInt: function(v) {
      return v && this.validate.isNumeric(parseInt(v)) ? parseInt(v) : false;
    },

    isNumeric: function(v){
      return !isNaN(v);
    },

    isString: function(v) {
      return Object.prototype.toString.call(v) === '[object String]';
    }

  }

};