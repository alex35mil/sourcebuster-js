// It's Sourcebuster [JS Edition], baby! (poolparty)
// Author: Alex Fedoseev (www.alexfedoseev.com)
// Version: 0.0.7

// Github: https://github.com/alexfedoseev/sourcebuster-js
// Blog post (rus): http://www.alexfedoseev.com/post/40/sourcebuster-js

// Ready Steady
// Let's set some vars first

// SBJS cookies
var SBJS_CURRENT_COOKIE = 'sbjs_current',
    SBJS_CURRENT_ADD_COOKIE = 'sbjs_current_add',
    SBJS_FIRST_COOKIE = 'sbjs_first',
    SBJS_FIRST_ADD_COOKIE = 'sbjs_first_add',
    SBJS_SESSION_COOKIE = 'sbjs_session',
    SBJS_UDATA_COOKIE = 'sbjs_udata',
    SBJS_PROMOCODE_COOKIE = 'sbjs_promo',
    SBJS_COOKIE_EXPIRES = 1000000;

// Encode/Decode helpers
function encode_data(s) {
  return encodeURIComponent(s).replace(/\!/g, "%21")
                              //.replace(/\-/g, "%2D")
                              //.replace(/\_/g, "%5F")
                              //.replace(/\./g, "%2E")
                              .replace(/\~/g, "%7E")
                              .replace(/\*/g, "%2A")
                              .replace(/\'/g, "%27")
                              .replace(/\(/g, "%28")
                              .replace(/\)/g, "%29");
}

function decode_data(s) {
  try {
    return decodeURIComponent(s).replace(/\%21/g, "!")
                                //.replace(/\%2D/g, "-")
                                //.replace(/\%5F/g, "_")
                                //.replace(/\%2E/g, ".")
                                .replace(/\%7E/g, "~")
                                .replace(/\%2A/g, "*")
                                .replace(/\%27/g, "'")
                                .replace(/\%28/g, "(")
                                .replace(/\%29/g, ")");
  } catch(err1) {
    // try unescape for backward compatibility
    try { return unescape(s); } catch(err2) { return ""; }
  }
}

// It's not a Rails, we don't have a waiters here
function set_cookie(name, value, minutes, domain, excl_subdomains) {
  var expires, basehost;

  if (minutes) {
    var date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    expires = '; expires=' + date.toGMTString();
  } else {
    expires = '';
  }
  if (domain && !excl_subdomains) {
    basehost = ';domain=.' + domain;
  } else {
    basehost = '';
  }
  document.cookie = encode_data(name) + '=' + encode_data(value) + expires + basehost + '; path=/';
}

function get_cookie(name) {
  var nameEQ = encode_data(name) + '=',
      ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
    if (c.indexOf(nameEQ) === 0) { return decode_data(c.substring(nameEQ.length, c.length)); }
  }
  return null;
}

function destroy_cookie(name) {
  set_cookie(name, '', -1);
}

// Set predefined organic custom sources
var _sbjs = _sbjs || [];
_sbjs.push(['_addOrganicSource', 'bing.com', 'q', 'bing']);
_sbjs.push(['_addOrganicSource', 'yahoo.com', 'p', 'yahoo']);
_sbjs.push(['_addOrganicSource', 'about.com', 'q', 'about']);
_sbjs.push(['_addOrganicSource', 'aol.com', 'q', 'aol']);
_sbjs.push(['_addOrganicSource', 'ask.com', 'q', 'ask']);
_sbjs.push(['_addOrganicSource', 'globososo.com', 'q', 'globo']);
_sbjs.push(['_addOrganicSource', 'go.mail.ru', 'q', 'go.mail.ru']);
_sbjs.push(['_addOrganicSource', 'rambler.ru', 'query', 'rambler']);
_sbjs.push(['_addOrganicSource', 'tut.by', 'query', 'tut.by']);

(function sourcebuster_js() {

      // Traffic types
  var SBJS_UTM = 'utm',
      SBJS_ORGANIC = 'organic',
      SBJS_REFERRAL = 'referral',
      SBJS_TYPEIN = 'typein';

      // Medium types
  var SBJS_REFERER_REFERRAL = 'referral',
      SBJS_REFERER_ORGANIC = 'organic',
      SBJS_REFERER_SOCIAL = 'social';

      // Aliases for params names in main cookies
  var SBJS_TYPE_ALIAS = 'typ',
      SBJS_SOURCE_ALIAS = 'src',
      SBJS_MEDIUM_ALIAS = 'mdm',
      SBJS_CAMPAIGN_ALIAS = 'cmp',
      SBJS_CONTENT_ALIAS = 'cnt',
      SBJS_TERM_ALIAS = 'trm';

  var SBJS_FIRST_DATE_ALIAS = 'fd',
      SBJS_ENTRANCE_POINT_ALIAS = 'ep',
      SBJS_REFERRAL_URL_ALIAS = 'rf';

  var SBJS_USER_IP_ALIAS = 'uip',
      SBJS_USER_AGENT_ALIAS = 'uag';

  var SBJS_PROMOCODE_ALIAS = 'code';

  var SBJS_NONE = '(none)',
      SBJS_OOPS = '(Houston, we have a problem)';

      // source params
  var __sbjs_type,
      __sbjs_source,
      __sbjs_medium,
      __sbjs_campaign,
      __sbjs_content,
      __sbjs_term;


  // Set user params
  for (var i = 0; i < _sbjs.length; i++) {

    if (_sbjs[i][0] === '_setBaseHost') {
      var SBJS_BASEHOST = _sbjs[i][1];
      var SBJS_IS_TRUE_BASEHOST;
      if (_sbjs[i].length > 2) {
        SBJS_IS_TRUE_BASEHOST = _sbjs[i][2];
      } else {
        SBJS_IS_TRUE_BASEHOST = true;
      }
    }

    if (_sbjs[i][0] === '_setSessionLength') {
      var SBJS_SESSION_LENGTH = parseInt(_sbjs[i][1]);
    }

    if (_sbjs[i][0] === '_setUserIP') {
      var SBJS_USER_IP = _sbjs[i][1];
    }

    if (_sbjs[i][0] === '_addOrganicSource') {
      var SBJS_CUSTOM_SOURCES_ORGANIC = SBJS_CUSTOM_SOURCES_ORGANIC || [];
      SBJS_CUSTOM_SOURCES_ORGANIC.push(_sbjs[i]);
    }

    if (_sbjs[i][0] === '_addReferralSource') {
      var SBJS_CUSTOM_SOURCES_REFERRAL = SBJS_CUSTOM_SOURCES_REFERRAL || [];
      SBJS_CUSTOM_SOURCES_REFERRAL.push(_sbjs[i]);
    }

    if (_sbjs[i][0] === '_setTypeinAttributes') {
      var SBJS_TYPEIN_CUSTOM_SOURCE = _sbjs[i][1] || SBJS_TYPEIN;
      var SBJS_TYPEIN_CUSTOM_MEDIUM = _sbjs[i][2] || SBJS_TYPEIN;
    }

    if (_sbjs[i][0] === '_setCampaignParam') {
      var SBJS_CAMPAIGN_PARAM = _sbjs[i][1];
    }

    if (_sbjs[i][0] === '_setTimeZoneOffset') {
      var SBJS_TIMEZONE_OFFSET = parseInt(_sbjs[i][1]);
    }

    if (_sbjs[i][0] === '_setPromocode') {
      var SBJS_SET_PROMO = true,
          SBJS_PROMOCODE_MIN = parseInt(_sbjs[i][1]) || 100000,
          SBJS_PROMOCODE_MAX = parseInt(_sbjs[i][2]) || 999999;
    }

  }

  // A few more helpers
  var get_param = function () {
    var query_string = {},
        query = window.location.search.substring(1),
        vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (typeof query_string[pair[0]] === 'undefined') {
        query_string[pair[0]] = pair[1];
      } else if (typeof query_string[pair[0]] === 'string') {
        var arr = [ query_string[pair[0]], pair[1] ];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    }
    return query_string;
  }();


  // parseUri 1.2.2
  // (c) Steven Levithan <stevenlevithan.com>
  // MIT License

  function parseUri(str) {
    var o = parseUri.options,
        m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
        uri = {},
        i = 14;

    while (i--) { uri[o.key[i]] = m[i] || ''; }

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) { uri[o.q.name][$1] = $2; }
    });

    return uri;
  }

  parseUri.options = {
    strictMode: false,
    key: ['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'],
    q: {
      name:   'queryKey',
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  };
  // parseUri 1.2.2


  function escape_regexp(string) {
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }


  // Let's get this party started
  function set_first_and_current_add_cookie() {
    var basehost = typeof SBJS_BASEHOST !== 'undefined' ? SBJS_BASEHOST : undefined;
    var is_true_basehost = typeof SBJS_IS_TRUE_BASEHOST !== 'undefined' ? SBJS_IS_TRUE_BASEHOST : true;

    set_cookie(SBJS_CURRENT_ADD_COOKIE, combine_sbjs_source_add_data_string(), SBJS_COOKIE_EXPIRES, basehost, !is_true_basehost);
    if (!get_cookie(SBJS_FIRST_ADD_COOKIE)) {
      set_cookie(SBJS_FIRST_ADD_COOKIE, combine_sbjs_source_add_data_string(), SBJS_COOKIE_EXPIRES, basehost, !is_true_basehost);
    }
  }

  function main_cookie_data() {
    var data;
    if (typeof get_param.utm_source !== 'undefined' || 
        typeof get_param.utm_medium !== 'undefined' ||
        typeof get_param.utm_campaign !== 'undefined' ||
        typeof get_param.utm_content !== 'undefined' ||
        typeof get_param.utm_term !== 'undefined' ||
        typeof get_param.gclid !== 'undefined' ||
        typeof get_param[SBJS_CAMPAIGN_PARAM] !== 'undefined') {
      set_first_and_current_add_cookie();
      data = get_data(SBJS_UTM);
    } else if (check_referer(SBJS_ORGANIC)) {
      set_first_and_current_add_cookie();
      data = get_data(SBJS_ORGANIC);
    } else if (!get_cookie(SBJS_SESSION_COOKIE) && check_referer(SBJS_REFERRAL)) {
      set_first_and_current_add_cookie();
      data = get_data(SBJS_REFERRAL);
    } else if (!get_cookie(SBJS_FIRST_COOKIE) && !get_cookie(SBJS_CURRENT_COOKIE)) {
      set_first_and_current_add_cookie();
      data = get_data(SBJS_TYPEIN);
    } else {
      return get_cookie(SBJS_CURRENT_COOKIE);
    }
    return data;
  }

  function get_data(type) {
    switch (type) {
      case SBJS_UTM:
        __sbjs_type = SBJS_UTM;

        if (typeof get_param.utm_source !== 'undefined') {
          __sbjs_source = get_param.utm_source;
        } else if (typeof get_param.gclid !== 'undefined') {
          __sbjs_source = 'google';
        } else {
          __sbjs_source = SBJS_NONE;
        }
        
        if (typeof get_param.utm_medium !== 'undefined') {
          __sbjs_medium = get_param.utm_medium;
        } else if (typeof get_param.gclid !== 'undefined') {
          __sbjs_medium = 'cpc';
        } else {
          __sbjs_medium = SBJS_NONE;
        }

        if (typeof get_param.utm_campaign !== 'undefined') {
          __sbjs_campaign = get_param.utm_campaign;
        } else if (typeof get_param[SBJS_CAMPAIGN_PARAM] !== 'undefined') {
          __sbjs_campaign = get_param[SBJS_CAMPAIGN_PARAM];
        } else if (typeof get_param.gclid !== 'undefined') {
          __sbjs_campaign = 'google_cpc';
        } else {
          __sbjs_campaign = SBJS_NONE;
        }

        __sbjs_content = get_param.utm_content || SBJS_NONE;
        __sbjs_term = get_param.utm_term || SBJS_NONE;
        break;

      case SBJS_ORGANIC:
        __sbjs_type = SBJS_ORGANIC;
        __sbjs_source = __sbjs_source || clean_host(document.referrer);
        __sbjs_medium = SBJS_REFERER_ORGANIC;
        __sbjs_campaign = SBJS_NONE;
        __sbjs_content = SBJS_NONE;
        __sbjs_term = SBJS_NONE;
        break;

      case SBJS_REFERRAL:
        __sbjs_type = SBJS_REFERRAL;
        __sbjs_source = __sbjs_source || clean_host(document.referrer);
        __sbjs_medium = __sbjs_medium || SBJS_REFERER_REFERRAL;
        __sbjs_campaign = SBJS_NONE;
        __sbjs_content = parseUri(document.referrer).path;
        __sbjs_term = SBJS_NONE;
        break;

      case SBJS_TYPEIN:
        __sbjs_type = SBJS_TYPEIN;
        __sbjs_source = SBJS_TYPEIN_CUSTOM_SOURCE || SBJS_TYPEIN;
        __sbjs_medium = SBJS_TYPEIN_CUSTOM_MEDIUM || SBJS_TYPEIN;
        __sbjs_campaign = SBJS_NONE;
        __sbjs_content = SBJS_NONE;
        __sbjs_term = SBJS_NONE;
        break;

      default:
        __sbjs_type = SBJS_OOPS;
        __sbjs_source = SBJS_OOPS;
        __sbjs_medium = SBJS_OOPS;
        __sbjs_campaign = SBJS_OOPS;
        __sbjs_content = SBJS_OOPS;
        __sbjs_term = SBJS_OOPS;
    }
    var data = {  sbjs_type: __sbjs_type,
                  sbjs_source: __sbjs_source,
                  sbjs_medium: __sbjs_medium,
                  sbjs_campaign: __sbjs_campaign,
                  sbjs_content: __sbjs_content,
                  sbjs_term: __sbjs_term
        };
    return combine_sbjs_main_data_string(data);
  }

  function clean_host(request) {
    return parseUri(request).host.replace('www.', '');
  }

  function check_referer(type) {
    var referer = document.referrer;
    switch(type) {
      case SBJS_ORGANIC:
        return (!!referer && check_referer_host(referer) && is_organic(referer));
      case SBJS_REFERRAL:
        return (!!referer && check_referer_host(referer) && is_referral(referer));
      default:
        return false;
    }
  }

  function check_referer_host(referer) {
    if (typeof SBJS_BASEHOST !== 'undefined' && SBJS_BASEHOST.length > 0) { 
      if (SBJS_IS_TRUE_BASEHOST) {
        var host_regex = new RegExp('^(.*\\.)?' + escape_regexp(SBJS_BASEHOST) + '$', 'i');
        return !(!!clean_host(referer).match(host_regex));
      } else {
        return (clean_host(referer) !== clean_host(SBJS_BASEHOST));
      }
    } else { 
      return (clean_host(referer) !== clean_host(location.href));
    }
  }

  function is_organic(referer) {
    var y_host = 'yandex',
        y_param = 'text',
        g_host = 'google';
    var y_host_regex = new RegExp('^(.*\\.)?' + escape_regexp(y_host) + '\\..{2,9}$'),
        y_param_regex = new RegExp('.*' + escape_regexp(y_param) + '=.*'),
        g_host_regex = new RegExp('^(www\\.)?' + escape_regexp(g_host) + '\\..{2,9}$');

    if (!!parseUri(referer).query && 
        !!parseUri(referer).host.match(y_host_regex) && 
        !!parseUri(referer).query.match(y_param_regex)) {
      __sbjs_source = y_host;
      return true;
    } else if (!!parseUri(referer).host.match(g_host_regex)) {
      __sbjs_source = g_host;
      return true;
    } else if (!!parseUri(referer).query && typeof SBJS_CUSTOM_SOURCES_ORGANIC !== 'undefined' && SBJS_CUSTOM_SOURCES_ORGANIC.length > 0) {
      for (var i = 0; i < SBJS_CUSTOM_SOURCES_ORGANIC.length; i++) {
        if (SBJS_CUSTOM_SOURCES_ORGANIC[i].length >= 3 && parseUri(referer).host.match(new RegExp('^(.*\\.)?' + escape_regexp(SBJS_CUSTOM_SOURCES_ORGANIC[i][1]) + '$', 'i')) && parseUri(referer).query.match(new RegExp('.*' + escape_regexp(SBJS_CUSTOM_SOURCES_ORGANIC[i][2]) + '=.*', 'i'))) {
          __sbjs_source = SBJS_CUSTOM_SOURCES_ORGANIC[i][3] || SBJS_CUSTOM_SOURCES_ORGANIC[i][1];
          return true;
        }
        if (i + 1 === SBJS_CUSTOM_SOURCES_ORGANIC.length) {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  function is_referral(referer) {
    if (typeof SBJS_CUSTOM_SOURCES_REFERRAL !== 'undefined' && SBJS_CUSTOM_SOURCES_REFERRAL.length > 0) {
      for (var i = 0; i < SBJS_CUSTOM_SOURCES_REFERRAL.length; i++) {
        if (SBJS_CUSTOM_SOURCES_REFERRAL[i].length > 1 && parseUri(referer).host.match(new RegExp('^(.*\\.)?' + escape_regexp(SBJS_CUSTOM_SOURCES_REFERRAL[i][1]) + '$', 'i'))) {
          __sbjs_source = SBJS_CUSTOM_SOURCES_REFERRAL[i][3] || SBJS_CUSTOM_SOURCES_REFERRAL[i][1];
          __sbjs_medium = SBJS_CUSTOM_SOURCES_REFERRAL[i][2] || SBJS_REFERER_REFERRAL;
          return true;
        }
        if (i + 1 === SBJS_CUSTOM_SOURCES_REFERRAL.length) {
          __sbjs_source = clean_host(referer);
          return true;
        }
      }
    } else {
      __sbjs_source = clean_host(referer);
      return true;
    }
  }

  function set_leading_zero_to_int(num, size) {
    var s = num + '';
    while (s.length < size) { s = '0' + s; }
    return s;
  }

  function set_date(date) {
    var utc_offset = date.getTimezoneOffset() / 60,
        now_hours = date.getHours(),
        custom_offset;
    if (typeof SBJS_TIMEZONE_OFFSET !== 'undefined' && typeof SBJS_TIMEZONE_OFFSET === 'number' && SBJS_TIMEZONE_OFFSET % 1 === 0) {
      custom_offset = SBJS_TIMEZONE_OFFSET;
    } else {
      custom_offset = 0;
    }
    date.setHours(now_hours + utc_offset + custom_offset);

    var date_string,
        year = date.getFullYear(),
        month = set_leading_zero_to_int(date.getMonth(), 2),
        day = set_leading_zero_to_int(date.getDate(), 2),
        hour = set_leading_zero_to_int(date.getHours(), 2),
        minute = set_leading_zero_to_int(date.getMinutes(), 2),
        second = set_leading_zero_to_int(date.getSeconds(), 2);

    date_string = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return date_string;
  }

  function random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Pre-pack data
  function combine_sbjs_main_data_string(data) {
    return  SBJS_TYPE_ALIAS + '=' + data.sbjs_type + '|' + 
            SBJS_SOURCE_ALIAS + '=' + data.sbjs_source + '|' + 
            SBJS_MEDIUM_ALIAS + '=' + data.sbjs_medium + '|' + 
            SBJS_CAMPAIGN_ALIAS + '=' + data.sbjs_campaign + '|' + 
            SBJS_CONTENT_ALIAS + '=' + data.sbjs_content + '|' + 
            SBJS_TERM_ALIAS + '=' + data.sbjs_term;
  }

  function combine_sbjs_user_data_string() {
    var user_agent_string = '|' + SBJS_USER_AGENT_ALIAS + '=' + navigator.userAgent;
    if (typeof SBJS_USER_IP !== 'undefined' && SBJS_USER_IP.length > 0) {
      return (SBJS_USER_IP_ALIAS + '=' + SBJS_USER_IP + user_agent_string);
    } else {
      return (SBJS_USER_IP_ALIAS + '=' + SBJS_NONE + user_agent_string);
    }
  }

  function combine_sbjs_source_add_data_string() {
    var current_date = new Date();
    var referer = document.referrer || SBJS_NONE;
    return (SBJS_FIRST_DATE_ALIAS + '=' + set_date(current_date) + '|' + SBJS_ENTRANCE_POINT_ALIAS + '=' + location.href + '|' + SBJS_REFERRAL_URL_ALIAS + '=' + referer);
  }

  function combine_sbjs_promocode_string() {
    return (SBJS_PROMOCODE_ALIAS + '=' + set_leading_zero_to_int(random_int(SBJS_PROMOCODE_MIN, SBJS_PROMOCODE_MAX), SBJS_PROMOCODE_MAX.toString().length));
  }

  function set_sbjs_data() {

    var session_length = typeof SBJS_SESSION_LENGTH !== 'undefined' && SBJS_SESSION_LENGTH > 0 ? SBJS_SESSION_LENGTH : 30;
    var basehost = typeof SBJS_BASEHOST !== 'undefined' ? SBJS_BASEHOST : undefined;
    var is_true_basehost = typeof SBJS_IS_TRUE_BASEHOST !== 'undefined' ? SBJS_IS_TRUE_BASEHOST : true;

    set_cookie(SBJS_CURRENT_COOKIE, main_cookie_data(), SBJS_COOKIE_EXPIRES, basehost, !is_true_basehost);
    if (!get_cookie(SBJS_FIRST_COOKIE)) {
      set_cookie(SBJS_FIRST_COOKIE, get_cookie(SBJS_CURRENT_COOKIE), SBJS_COOKIE_EXPIRES, basehost, !is_true_basehost);
    }
    set_cookie(SBJS_SESSION_COOKIE, '1', session_length, basehost, !is_true_basehost);
    set_cookie(SBJS_UDATA_COOKIE, combine_sbjs_user_data_string(), SBJS_COOKIE_EXPIRES, basehost, !is_true_basehost);

    if (SBJS_SET_PROMO && !get_cookie(SBJS_PROMOCODE_COOKIE)) {
      set_cookie(SBJS_PROMOCODE_COOKIE, combine_sbjs_promocode_string(), SBJS_COOKIE_EXPIRES, basehost, !is_true_basehost);
    }

  }

  // Boom!
  set_sbjs_data();

}).call(this);


// What we've got here is getter to communicate
var get_sbjs = function() {
  var cookies = {},
      cookies_names_src = [
        SBJS_CURRENT_COOKIE,
        SBJS_CURRENT_ADD_COOKIE,
        SBJS_FIRST_COOKIE,
        SBJS_FIRST_ADD_COOKIE,
        SBJS_UDATA_COOKIE,
        SBJS_PROMOCODE_COOKIE
      ];

  function unsbjs(string) {
    return string.replace('sbjs_', '');
  }

  for (var i1 = 0; i1 < cookies_names_src.length; i1++) {
    var cookie_array;
    cookies[unsbjs(cookies_names_src[i1])] = {};
    if (get_cookie(cookies_names_src[i1])) {
      cookie_array = get_cookie(cookies_names_src[i1]).split('|');
    } else {
      cookie_array = [];
    }
    for (var i2 = 0; i2 < cookie_array.length; i2++) {
      var tmp_array = cookie_array[i2].split('='),
          result_array = tmp_array.splice(0, 1);
      result_array.push(tmp_array.join('='));
      cookies[unsbjs(cookies_names_src[i1])][result_array[0]] = decode_data(result_array[1]);
    }
  }
  return cookies;
}();
