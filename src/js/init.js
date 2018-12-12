"use strict";

var data        = require('./data'),
    terms       = require('./terms'),
    cookies     = require('./helpers/cookies'),
    uri         = require('./helpers/uri'),
    utils       = require('./helpers/utils'),
    params      = require('./params'),
    migrations  = require('./migrations');

module.exports = function(prefs) {

  var p         = params.fetch(prefs);
  var get_param = uri.getParam();
  var domain    = p.domain.host,
      isolate   = p.domain.isolate,
      lifetime  = p.lifetime;

  migrations.go(lifetime, domain, isolate);

  var __sbjs_type,
      __sbjs_source,
      __sbjs_medium,
      __sbjs_campaign,
      __sbjs_content,
      __sbjs_term;

  function mainData() {
    var sbjs_data;
    if (
        typeof get_param.utm_source        !== 'undefined' ||
        typeof get_param.utm_medium        !== 'undefined' ||
        typeof get_param.utm_campaign      !== 'undefined' ||
        typeof get_param.utm_content       !== 'undefined' ||
        typeof get_param.utm_term          !== 'undefined' ||
        typeof get_param.gclid             !== 'undefined' ||
        typeof get_param.yclid             !== 'undefined' ||
        typeof get_param[p.campaign_param] !== 'undefined' ||
        typeof get_param[p.term_param]     !== 'undefined' ||
        typeof get_param[p.content_param]  !== 'undefined'
    ) {
      setFirstAndCurrentExtraData();
      sbjs_data = getData(terms.traffic.utm);
    } else if (checkReferer(terms.traffic.organic)) {
      setFirstAndCurrentExtraData();
      sbjs_data = getData(terms.traffic.organic);
    } else if (!cookies.get(data.containers.session) && checkReferer(terms.traffic.referral)) {
      setFirstAndCurrentExtraData();
      sbjs_data = getData(terms.traffic.referral);
    } else if (!cookies.get(data.containers.first) && !cookies.get(data.containers.current)) {
      setFirstAndCurrentExtraData();
      sbjs_data = getData(terms.traffic.typein);
    } else {
      return cookies.get(data.containers.current);
    }

    return sbjs_data;
  }

  function getData(type) {

    switch (type) {

      case terms.traffic.utm:

        __sbjs_type = terms.traffic.utm;

        if (typeof get_param.utm_source !== 'undefined') {
          __sbjs_source = get_param.utm_source;
        } else if (typeof get_param.gclid !== 'undefined') {
          __sbjs_source = 'google';
        } else if (typeof get_param.yclid !== 'undefined') {
          __sbjs_source = 'yandex';  
        } else {
          __sbjs_source = terms.none;
        }

        if (typeof get_param.utm_medium !== 'undefined') {
          __sbjs_medium = get_param.utm_medium;
        } else if (typeof get_param.gclid !== 'undefined') {
          __sbjs_medium = 'cpc';
        } else if (typeof get_param.yclid !== 'undefined') {
          __sbjs_medium = 'cpc';  
        } else {
          __sbjs_medium = terms.none;
        }

        if (typeof get_param.utm_campaign !== 'undefined') {
          __sbjs_campaign = get_param.utm_campaign;
        } else if (typeof get_param[p.campaign_param] !== 'undefined') {
          __sbjs_campaign = get_param[p.campaign_param];
        } else if (typeof get_param.gclid !== 'undefined') {
          __sbjs_campaign = 'google_cpc';
        } else if (typeof get_param.yclid !== 'undefined') {
          __sbjs_campaign = 'yandex_cpc';  
        } else {
          __sbjs_campaign = terms.none;
        }

        if (typeof get_param.utm_content !== 'undefined') {
          __sbjs_content = get_param.utm_content;
        } else if (typeof get_param[p.content_param] !== 'undefined') {
          __sbjs_content = get_param[p.content_param];
        } else {
          __sbjs_content = terms.none;
        }

        if (typeof get_param.utm_term !== 'undefined') {
          __sbjs_term = get_param.utm_term;
        } else if (typeof get_param[p.term_param] !== 'undefined') {
          __sbjs_term = get_param[p.term_param];
        } else {
          __sbjs_term = getUtmTerm() || terms.none;
        }

        break;

      case terms.traffic.organic:
        __sbjs_type     = terms.traffic.organic;
        __sbjs_source   = __sbjs_source || uri.getHost(document.referrer);
        __sbjs_medium   = terms.referer.organic;
        __sbjs_campaign = terms.none;
        __sbjs_content  = terms.none;
        __sbjs_term     = terms.none;
        break;

      case terms.traffic.referral:
        __sbjs_type     = terms.traffic.referral;
        __sbjs_source   = __sbjs_source || uri.getHost(document.referrer);
        __sbjs_medium   = __sbjs_medium || terms.referer.referral;
        __sbjs_campaign = terms.none;
        __sbjs_content  = uri.parse(document.referrer).path;
        __sbjs_term     = terms.none;
        break;

      case terms.traffic.typein:
        __sbjs_type     = terms.traffic.typein;
        __sbjs_source   = p.typein_attributes.source;
        __sbjs_medium   = p.typein_attributes.medium;
        __sbjs_campaign = terms.none;
        __sbjs_content  = terms.none;
        __sbjs_term     = terms.none;
        break;

      default:
        __sbjs_type     = terms.oops;
        __sbjs_source   = terms.oops;
        __sbjs_medium   = terms.oops;
        __sbjs_campaign = terms.oops;
        __sbjs_content  = terms.oops;
        __sbjs_term     = terms.oops;
    }
    var sbjs_data = {
      type:             __sbjs_type,
      source:           __sbjs_source,
      medium:           __sbjs_medium,
      campaign:         __sbjs_campaign,
      content:          __sbjs_content,
      term:             __sbjs_term
    };

    return data.pack.main(sbjs_data);

  }

  function getUtmTerm() {
    var referer = document.referrer;
    if (get_param.utm_term) {
      return get_param.utm_term;
    } else if (referer && uri.parse(referer).host && uri.parse(referer).host.match(/^(?:.*\.)?yandex\..{2,9}$/i)) {
      try {
        return uri.getParam(uri.parse(document.referrer).query).text;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  }

  function checkReferer(type) {
    var referer = document.referrer;
    switch(type) {
      case terms.traffic.organic:
        return (!!referer && checkRefererHost(referer) && isOrganic(referer));
      case terms.traffic.referral:
        return (!!referer && checkRefererHost(referer) && isReferral(referer));
      default:
        return false;
    }
  }

  function checkRefererHost(referer) {
    if (p.domain) {
      if (!isolate) {
        var host_regex = new RegExp('^(?:.*\\.)?' + utils.escapeRegexp(domain) + '$', 'i');
        return !(uri.getHost(referer).match(host_regex));
      } else {
        return (uri.getHost(referer) !== uri.getHost(domain));
      }
    } else {
      return (uri.getHost(referer) !== uri.getHost(document.location.href));
    }
  }

  function isOrganic(referer) {

    var y_host  = 'yandex',
        y_param = 'text',
        g_host  = 'google';

    var y_host_regex  = new RegExp('^(?:.*\\.)?'  + utils.escapeRegexp(y_host)  + '\\..{2,9}$'),
        y_param_regex = new RegExp('.*'           + utils.escapeRegexp(y_param) + '=.*'),
        g_host_regex  = new RegExp('^(?:www\\.)?' + utils.escapeRegexp(g_host)  + '\\..{2,9}$');

    if (
        !!uri.parse(referer).query &&
        !!uri.parse(referer).host.match(y_host_regex) &&
        !!uri.parse(referer).query.match(y_param_regex)
      ) {
      __sbjs_source = y_host;
      return true;
    } else if (!!uri.parse(referer).host.match(g_host_regex)) {
      __sbjs_source = g_host;
      return true;
    } else if (!!uri.parse(referer).query) {
      for (var i = 0; i < p.organics.length; i++) {
        if (
            uri.parse(referer).host.match(new RegExp('^(?:.*\\.)?' + utils.escapeRegexp(p.organics[i].host)  + '$', 'i')) &&
            uri.parse(referer).query.match(new RegExp('.*'         + utils.escapeRegexp(p.organics[i].param) + '=.*', 'i'))
          ) {
          __sbjs_source = p.organics[i].display || p.organics[i].host;
          return true;
        }
        if (i + 1 === p.organics.length) {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  function isReferral(referer) {
    if (p.referrals.length > 0) {
      for (var i = 0; i < p.referrals.length; i++) {
        if (uri.parse(referer).host.match(new RegExp('^(?:.*\\.)?' + utils.escapeRegexp(p.referrals[i].host) + '$', 'i'))) {
          __sbjs_source = p.referrals[i].display  || p.referrals[i].host;
          __sbjs_medium = p.referrals[i].medium   || terms.referer.referral;
          return true;
        }
        if (i + 1 === p.referrals.length) {
          __sbjs_source = uri.getHost(referer);
          return true;
        }
      }
    } else {
      __sbjs_source = uri.getHost(referer);
      return true;
    }
  }

  function setFirstAndCurrentExtraData() {
    cookies.set(data.containers.current_extra, data.pack.extra(p.timezone_offset), lifetime, domain, isolate);
    if (!cookies.get(data.containers.first_extra)) {
      cookies.set(data.containers.first_extra, data.pack.extra(p.timezone_offset), lifetime, domain, isolate);
    }
  }

  (function setData() {

    // Main data
    cookies.set(data.containers.current, mainData(), lifetime, domain, isolate);
    if (!cookies.get(data.containers.first)) {
      cookies.set(data.containers.first, cookies.get(data.containers.current), lifetime, domain, isolate);
    }

    // User data
    var visits, udata;
    if (!cookies.get(data.containers.udata)) {
      visits  = 1;
      udata   = data.pack.user(visits, p.user_ip);
    } else {
      visits  = parseInt(cookies.parse(data.containers.udata)[cookies.unsbjs(data.containers.udata)][data.aliases.udata.visits]) || 1;
      visits  = cookies.get(data.containers.session) ? visits : visits + 1;
      udata   = data.pack.user(visits, p.user_ip);
    }
    cookies.set(data.containers.udata, udata, lifetime, domain, isolate);

    // Session
    var pages_count;
    if (!cookies.get(data.containers.session)) {
      pages_count = 1;
    } else {
      pages_count = parseInt(cookies.parse(data.containers.session)[cookies.unsbjs(data.containers.session)][data.aliases.session.pages_seen]) || 1;
      pages_count += 1;
    }
    cookies.set(data.containers.session, data.pack.session(pages_count), p.session_length, domain, isolate);

    // Promocode
    if (p.promocode && !cookies.get(data.containers.promocode)) {
      cookies.set(data.containers.promocode, data.pack.promo(p.promocode), lifetime, domain, isolate);
    }

  })();

  return cookies.parse(data.containers);

};