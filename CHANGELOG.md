## 0.0.4

Features:

  - add Sourcebuster to `bower` ([bower.io](http://bower.io))

Changes:

  - switch from Closure Compiler to UglifyJS minification library
  - switch from deprecated `escape()`/`unescape()` methods to custom `encode_data()`/`decode_data()` functions (which uses `encodeURIComponent()`/`decodeURIComponent()` with some additions) to set/get cookies. **Please pay attention to this if you parse `sbjs` cookies by yourself.**

## 0.0.3

Features:

  - add `_setTimeZoneOffset` user setting to set default time zone
  - add alias param to custom organic source (added via `_addOrganicSource`)

Changes:

  - change simple and advanced setup methods
  - change datetime format to `yyyy-mm-dd hh:mm:ss` (`2014-06-11 17:28:26`)
  - store datetime in UTC by default
  - remove events `'sbjs:set'` and `'sbjs:ready'` (see *Using the data* section for details)

Fixes:

  - fix matching of Yandex organic source
  - fix matching of custom organic source (added via `_addOrganicSource`)
  - fix getter (`get_sbjs`) in IE8 and lower
  - fix output of non-ASCII chars via `get_sbjs`

## 0.0.2

Features:

  - add Google AdWords `gclid` param handler
  - add `_setCampaignParam` user setting to set custom GET-param, whose value will be set as `utm_campaign` in cookies (if there is no original `utm_campaign` in request)

## 0.0.1

Sourcebuster JS released.