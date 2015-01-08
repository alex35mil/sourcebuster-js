# Sourcebuster JS

#### 1.0.5 is merged to master

Read [upgrade guide](UPGRADING.md) for details.

## About
* Sourcebuster tracks the sources of your site’s visitors and stores the data in the cookies for further analysis.
* It handles sources-overriding just like Google Analytics does.
* It’s written in pure JavaScript, without any dependency from third-party libraries.
* You can use received data for:
 * phones change
 * site content change
 * export data within forms to your CRM or analysis system.

## Links

[Download](https://github.com/alexfedoseev/sourcebuster-js/archive/master.zip) &middot; [Upgrade guide](UPGRADING.md) &middot; [Changelog](CHANGELOG.md) &middot; [Test page](http://statica.alexfedoseev.com/sourcebuster-js/)

## Install

```python
# from `npm`
npm install --save sourcebuster

# or `bower`
bower install --save sourcebuster
```

Or you can [download this repo](https://github.com/alexfedoseev/sourcebuster-js/archive/master.zip) and use `sourcebuster.min.js` from `/dist` folder.

## Setup
I'm gonna walk you through the inline-HTML setup pattern, but keep in mind, that Sourcebuster is available as `CommonJS` / `AMD` module, so you can `require` it as dependency as well.

Script is written in pure JavaScript, doesn’t have any dependency on third-party libraries and doesn’t interacts with DOM’s objects, so it can be called as soon as you want it. Higher you’ll place it in the `<head>` tag, sooner you’ll get the cookies, whose data can be used for DOM’s objects manipulation (phones change etc.).

Place in the `<head>` tag:

```html
<script src="/path/to/sourcebuster.min.js"></script>
```

Or require it:

```javascript
var sbjs = require('sourcebuster');
```

It will expose Sourcebuster object — `sbjs`. This object has just 2 methods: `init` and `get`. Basically first one is `setter`, and the second one is `getter`.

So, lets initialize it:

```html
<script src="/path/to/sourcebuster.min.js"></script>
<script>

  sbjs.init();

</script>
```

This will:

  - set all the cookies
  - give you the data (available through the second method `sbjs.get`)

### Configure

`sbjs.init` accepts one argument: object with the settings. It's optional and usually it will be something like this:

```javascript
sbjs.init({
  domain: 'alexfedoseev.com',
  lifetime: 3,
  callback: doSmth
});
```

There are 11 types of user settings:
* lifetime
* session_length
* domain
* referrals
* organics
* typein_attributes
* timezone_offset
* campaign_param
* user_ip
* promocode
* callback

Now I'll show you the whole list of configurable options. The short description is provided in comments. The rest is explained below.

```javascript
sbjs.init({

  // Set custom expiration period for cookies in months
  // 6 months is default
  lifetime: 6,

  // Set custom session length in minutes
  // 30 minutes is default
  session_length: 30,

  // Set domain name in cookies
  domain: {
    host: 'alexfedoseev.com',
    isolate: false
  },

  // Set custom referral sources
  referrals: [
    {
      host: 't.co',          // This is host from Twitter's `http referer`
      medium: 'social',      // This is custom `utm_medium`, you can drop it and it'll be `referral`
      display: 'twitter.com' // And this is how you'll see it in the result data
    },
    {
      host: 'plus.url.google.com',
      display: 'plus.google.com'
    }
  ],

  // Set custom organic sources
  organics: [
    {
      host: 'bing.com',
      param: 'q',
      display: 'bing'
    }
  ],

  // Set `utm_source` & `utm_medium` values for `typein` traffic
  // Defaults are `(direct)` & `(none)`
  typein_attributes: {
    source: '(direct)',
    medium: '(none)'
  },

  // Set time zone
  timezone_offset: 3,

  // Set custom `utm_campaign` param
  campaign_param: 'my_adwords_campaign',

  // Set user ip
  user_ip: '192.168.1.1',

  // Set promocode
  // Default range is [100000..999999]
  promocode: {
    min: 100000,
    max: 999999
  },

  // Set callback-function,
  // It will be executed right after `sbjs` cookies will be set
  callback: doSmth
});
```

#### lifetime

```javascript
lifetime: 6
```

Setting up custom expiration period for `sbjs` cookies (in months). Default is 6.

#### session_length

```javascript
session_length: 30
```

Setting up user's session duration (in minutes). Default is 30.

This parameter affects only referral sources overriding. When the visitor comes on your site for the first time, we receive and store the data about his source. After some time this visitor can return to your website, but from another source, and we need to have some rules to decide — should we overwrite previous source or we should not.

The rules are the same with Google Analytics:
* UTM and Organic source always overrides any previous source.
* Typein never overrides a previous source.
* Referral source overrides previous source only if there is no user session at the moment. If it’s inside the same session — a referral source will never override previous source.

Explanation to `referral` logic: sometimes visitor within the current visit (session) comes to the website from the “source” which is not actually a “source”. For example, it can be visit from the email service, where he had a registration activation link.

#### domain

```javascript
domain: {
  host: 'alexfedoseev.com',
  isolate: false
}
```

Setting up cookies domain.

First of all lets talk about how script handles **the absence** of this custom option: if no value is set, cookies will be placed for **current domain and all its subdomains**.

Why it is so. Lets say the site doesn't have subdomains to share traffic with, and now it doesn't matter: do we share the cookies with subdomains or we do not. But what's gonna happen if someday subdomains will occur? If cookies wasn't shared — subdomains won't get them, it means they won't share the traffic, and visitors, which came from main domain to subdomains (and vise versa), will be considered as `referral` traffic.

So by default the cookies are shared. However if you don't want to share them — use `isolate: true`, to isolate domain.

Let’s take a look at further examples.

**No. 1**  
The first scenario. You have a site: **wow.com**. Also you have a blog on this site: **blog.wow.com**. And you don’t want to separate traffic between them. It means that when the visitor come from **blog.wow.com** to **wow.com**, it won’t be a new visit for **wow.com** (with **blog.wow.com** as Referral source), it will be a common inner click without source change (to sourcebuster.js this scenario will be equal to inner page change: from *wow.com/about* to *wow.com/contacts* for example). To achive this you have to add this line on both sites: **wow.com & blog.wow.com**.

```javascript
domain: 'wow.com'
```

**No. 2**  
That was simple. Now lets take a look at opposite scenario — you want to separate traffic between your subdomains and consider it as Referral. There is the main site — **wow.com**, and there is a blog on this site — **blog.wow.com**, which also has users subdomains — **alex.blog.wow.com** is one of them. You don’t want to separate traffic between **blog.wow.com** and **alex.blog.wow.com**, but you do want to separate it between all the blogs and the main site. Here’s how we can sort it out:

```javascript
// put this on the main domain wow.com
domain: {
  host: 'wow.com',
  isolate: true
}

// and this on the blogs subdomains (blog.wow.com & alex.blog.wow.com) 
domain: 'blog.wow.com'
```

Pay attention to the `isolate: true` param in setting for the main domain. Use it only when all incoming traffic from all subdomains should be referral in relation to provided host.

In our example if the visitor came for the first time on the main site **wow.com** by clicking on the link in user’s blog **alex.blog.wow.com**, his source (for the **wow.com**) will be **alex.blog.wow.com** (traffic type: *referral*).

**NB! Do not change `isolate` value after you pushed the script in production! If you'll do — your visitors will get doubled cookies and bad things may happen.**

The option, that will give the ability to force-update cookies domain (if you need to change subdomains handling rules), is in my TODO-list, but not available yet.

How to check that `isolate` is set right:

* host of the page, which code have setting `domain` with param `isolate: true` must be equal to the host provided in `domain` line:

```javascript
// CORRECT: on the pages of wow.com
domain: {
  host: 'wow.com',
  isolate: true
}

// DOESN’T MAKE SENSE: on the pages blog.wow.com
domain: {
  host: 'wow.com',
  isolate: true
}
```
* all incoming traffic from all subdomains will be referral in relation to provided host:

```javascript
domain: {
  host: 'wow.com',
  isolate: true
}
// visit from *.wow.com → wow.com will be referral
```

#### referrals

```javascript
referrals: [
  {
    host: 't.co',            // This is host from Twitter's `http referer`
    medium: 'social',        // This is custom `utm_medium`, you can drop it and it'll be `referral`
    display: 'twitter.com'   // And this is how you'll see it in the result data
  },
  {
    host: 'plus.url.google.com',
    display: 'plus.google.com'
  }
]
```

Adds custom `referral` sources.

In general if you’re ok with the fact that medium (`utm_medium`) of traffic from `facebook.com` is `referral`, you don’t need this setting. But if you want to make this kind of traffic `social` (`utm_medium=social`), you can set it up using `referrals`. First param is `host` of the source from `http referer`, second — `medium` — preferred value of `utm_medium`.

Moreover some of the traffic sources have different referer host in relation to their main domain (for example, traffic from Twitter has referer with the host — `t.co`). In these cases you can assign alias to the source using optional `display` param. Also with this param you can group the traffic from the set of the sites into one virtual source.

Twitter (`host: 't.co', display: 'twitter.com'`) and Google+ (`host: 'plus.url.google.com', display: 'plus.google.com'`) added to default `referral` sources. You still can override it by your custom setting (to mark it as `social` for example).

#### organics

There are already a number of predefined `organic` sources in the core:

```
Source         ->  Alias
-------------------------
google.all     ->  google
yandex.all     ->  yandex
bing.com       ->  bing
yahoo.com      ->  yahoo
about.com      ->  about
aol.com        ->  aol
ask.com        ->  ask
globososo.com  ->  globo
go.mail.ru     ->  go.mail.ru
rambler.ru     ->  rambler
tut.by         ->  tut.by
```

But you can use this setting, if you want to add more organic sources or override aliases of predefined ones.

```javascript
organics: [
  {
    host: 'bing.com',
    param: 'q',
    display: 'bing_in_da_house'
  }
]
```

For example you want the traffic from the SERP of **bing.com** to be organic and the alias for this source to be `bing_in_da_house`. So you need to provide `host: 'bing.com'`, and the query `param` of keyword — `'q'`. Both are required. Also, to set custom alias for the source, provide optional third param `display: 'bing_in_da_house'`.

To get the keyword param go to **bing.com** and search for smth, **“apple”** for example. After you’ll get to the SERP, explore its URL:
*http://www.bing.com/search?q=apple&go=&qs=n&form=QBLH&pq=apple&sc=8-5&sp=-1&sk=&cvid=718ad07527244c319ecebf44aa261f64*

Keyword param — `'q'` — is a symbol/word between `“?”` (or `“&”` if the param is not the first after question sign) and `“=apple”` in URL of SERP.

#### typein_attributes

```javascript
typein_attributes: {
  source: '(direct)',
  medium: '(none)'
}
```

Sets custom `utm_source` and `utm_medium` for `typein` traffic.
By default the values of `source` and `medium` for `typein` traffic are `(direct)` & `(none)`.
You can override this via `typein_attributes`.

#### timezone_offset

```javascript
timezone_offset: 3
```

Setting up time zone.

By default datetime is taken from the visitor's system. But you can normalize it to predefined time zone via `timezone_offset`.

Example. Your visitor is in London (`UTC +00:00`). His local time is `03:00 AM`. If no `timezone_offset` was set, the time in cookie will be `03:00 AM`. Another visitor at the same moment is from Berlin (`UTC +01:00`) and his local time is `04:00 AM`. The time in cookie will be `04:00 AM`.

If you want to normalize time of all visitors (let it be `UTC +03:00` for example), you should set it via `timezone_offset: 3`. So the time in cookies of both visitors will be `06:00 AM`.

#### campaign_param (Google AdWords `gclid` param handler)

```javascript
campaign_param: 'my_adwords_campaign'
```

Sets custom GET-param, whose value (if present) will be set as `utm_campaign` in cookies (if there is no original `utm_campaign` in request). This feature was added mainly because of Google AdWords `gclid` param.

Here is the use-case. If you have traffic from Google AdWords and you use `gclid` param, you can shorten your urls by removing `utm` out of it. Sourcebuster will match this traffic as `utm` from Google.

If there is only `gclid` param in url:
http://statica.alexfedoseev.com/sourcebuster-js/?gclid=sMtH

This will give you the following results:
* Traffic type: utm
* utm_source: google
* utm_medium: cpc
* utm_campaign: google_cpc
* utm_content:  (none)
* utm_term: (none)

You can provide a custom `utm_campaign` name via `campaign_param` and value of this GET-param:
http://statica.alexfedoseev.com/sourcebuster-js/?gclid=sMtH&my_adwords_campaign=test_custom

You'll get the following:
* Traffic type: utm
* utm_source: google
* utm_medium: cpc
* utm_campaign: test_custom
* utm_content:  (none)
* utm_term: (none)

**WARNING**
* If there is original utm-param in request (`utm_source`, `utm_medium`, `utm_campaign`), it will override `gclid` param and `campaign_param` param value.
* If there is only custom campaign param (`campaign_param`) in request, Sourcebuster will consider it as `utm` traffic.

#### user_ip

```javascript
user_ip: '192.168.1.1'
```

Sets user’s ip address.
By default sourcebuster can’t get ip address of the visitor. But if you need it, you can get it on your back-end and push it using `user_ip` setting.

#### promocode (beta)

```javascript
promocode: true

// or
promocode: {
  min: 100000,
  max: 999999
}
```

Sets random promocode for visitor.

If you don't want to do promocode-stuff on your back, Sourcebuster can generate them or you.
There is no check for uniqueness, of course. But you can rely on probability and set range of promocode values `min` and `max` params.
They are optional, by the way. If they are not set, range will be between 100 000 and 999 999.

**This option is beta — mainly because I haven't check the percent of duplicated promos on big projects.**

#### callback

```javascript
callback: doSmth
```

Callback. Just pass the name of the function to the option, and it will be executed right after the cookies will be set. Callback will get the object with `sbjs` data as argument.

```javascript
sbjs.init({ callback: go });

function go(sb) {
  console.log('Cookies are set! Your current source is: ' + sb.current.src);
}
```


## Usage

### Getting the data

Grab the data through `sbjs.get` method (it's `object` actually).

Here is the list of what you can get.

#### `sbjs.get.current`
Params of the latest visitor’s source. If the visitor had more than one source, this will be the latest values.

* `sbjs.get.current.typ`
Traffic type. Possible values: `utm`, `organic`, `referral`, `typein`.

* `sbjs.get.current.src`
Source. utm_source, actually.

* `sbjs.get.current.mdm`
Medium, utm_medium. Values can be customized using utm-params and `referrals`.

* `sbjs.get.current.cmp`
Campaign. Value of utm_campaign.

* `sbjs.get.current.cnt`
Content. Value of utm_content.

* `sbjs.get.current.trm`
Keyword. Value of utm_term.


#### `sbjs.get.current_add`
Additional info about the visit, when the `current` source was written.

* `sbjs.get.current_add.fd`
Date and time of the visit. Format: `yyyy-mm-dd hh:mm:ss`. Time zone can be customized via `timezone_offset`.

* `sbjs.get.current_add.ep`
Entrance point.

* `sbjs.get.current_add.rf`
Referer URL.


#### `sbjs.get.first` & `sbjs.get.first_add`
Just like `sbjs.get.current` & `sbjs.get.current_add`, but holds params of the very first visit. Stored once, never overwritten.


#### `sbjs.get.session`
Current opened session data.

* `sbjs.get.session.pgs`
How many pages user have seen during the current session.

* `sbjs.get.session.cpg`
Current page URL.


#### `sbjs.get.udata`
Additional user data: visits, ip & user-agent.

* `sbjs.get.udata.vst`
How many times user visited site.

* `sbjs.get.udata.uip`
Current ip-address.

* `sbjs.get.udata.uag`
Current user-agent (browser).


#### `sbjs.get.promo`
Visitor's promocode. Cookie set only if `promocode` option is present.

* `sbjs.get.promo.code`
Promocode.


### Cookies

All data are stored in cookies. When the script is pushed to production, visitors will get the following yummies:
* sbjs_current
* sbjs_current_add
* sbjs_first
* sbjs_first_add
* sbjs_session
* sbjs_udata
* sbjs_promo

#### sbjs_current & sbjs_first

*Format*  
`typ=organic|||src=google|||mdm=organic|||cmp=(none)|||cnt=(none)|||trm=(none)`

*Examples*

```
# source: adv campaign with utms
typ=utm|||src=yandex|||mdm=cpc|||cmp=my_adv_campaign|||cnt=banner_1|||trm=buy_my_stuff

# source: google's SERP
typ=organic|||src=google|||mdm=organic|||cmp=(none)|||cnt=(none)|||trm=(none)

# source: referral from site.com/referer-path
typ=referral|||src=site.com|||mdm=referral|||cmp=(none)|||cnt=/referer-path|||trm=(none)

# source: facebook with custom `referrals` setting
typ=referral|||src=facebook.com|||mdm=social|||cmp=(none)|||cnt=(none)|||trm=(none)

# source: direct visit
typ=typein|||src=(direct)|||mdm=(none)|||cmp=(none)|||cnt=(none)|||trm=(none)
```


#### sbjs_current_add & sbjs_first_add

*Format*  
`fd=2014-06-11 17:28:26|||ep=http://statica.alexfedoseev.com/sourcebuster-js/|||rf=https://www.google.com`


#### sbjs_session

*Format*
`pgs=3|||cpg=http://statica.alexfedoseev.com/sourcebuster-js/`


#### sbjs_udata

*Format*  
`vst=2|||uip=192.168.1.1|uag=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36`


#### sbjs_promo

*Format*
`code=002354`


### Limitations

#### Visits from https to http
When the visitor come from `https` web-site to `http`, the request don't have a referer. So the script will consider it as `typein` (direct visit).
