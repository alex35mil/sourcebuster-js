## From 0.0.x to 1.0.0

I'm gonna walk you through the inline-HTML setup pattern, but keep in mind, that Sourcebuster `1.0.0` is available as `CommonJS` / `AMD` module, so you can `require` it as dependency as well.

### Install

```python
# from `npm`
npm install --save sourcebuster

# or `bower`
bower install --save sourcebuster
```

Or you can [download this repo](https://github.com/alexfedoseev/sourcebuster-js/archive/master.zip) and use `sourcebuster.min.js` from `/dist` folder.

### Setup

Place inside the `<head>` tag:

```html
<script src="/path/to/sourcebuster.min.js"></script>
```

Unlike `0.0.x`, in `1.0.0` this line will do nothing (I mean no cookies will be set) except it will make available Sourcebuster object — `sbjs`.

This object has just 2 methods: `init` and `get`. Basically first one is `setter`, and the second one is `getter`.

So, lets initialize it:

```html
<script src="/path/to/sourcebuster.min.js"></script>
<script>

  sbjs.init();

</script>
```

This will:

  - set all the cookies
  - give you the data (through the second method `sbjs.get`)

### Configure

`sbjs.init` accepts one argument: object with the settings. It's optional and usually it will be something like this:

```javascript
sbjs.init({
  domain: 'alexfedoseev.com',
  lifetime: 3,
  callback: doSmth
});
```

Now I'll show you the whole list of configurable options. The short description is provided in comments. Some critical changes explained in this guide. The rest is explained in the documentation.

```javascript
sbjs.init({

  // Set custom expiration period for cookies in months
  // 6 months is default
  lifetime: 6,

  // Set custom session length in minutes (no changes since 0.0.x)
  // 30 minutes is default
  session_length: 30,

  // Set domain name in cookies
  // Behaviour is changed! Detailed explanation below
  domain: {
    host: 'alexfedoseev.com',
    isolate: false
  },

  // Set custom referrals (no changes since 0.0.x)
  // This is an array of objects
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
  ],

  // Set custom organics (no changes since 0.0.x)
  // This is an array of objects
  organics: [
    {
      host: 'bing.com',
      param: 'q',
      display: 'bing'
    }
  ],

  // Set `utm_source` & `utm_medium` values for `typein` traffic
  // Defaults are changed, now it's `(direct)` & `(none)`, detailed explanation below
  typein_attributes: {
    source: '(direct)',
    medium: '(none)'
  },

  // Set time zone
  // Default behaviour is changed, detailed explanation below
  timezone_offset: 3,

  // Set custom `utm_campaign` param (no changes since 0.0.x)
  campaign_param: 'my_adwords_campaign',

  // Set user ip (no changes since 0.0.x)
  user_ip: '192.168.1.1',

  // Set promocode (no changes since 0.0.x)
  // Default range is [100000..999999]
  promocode: {
    min: 100000,
    max: 999999
  },

  // Set callback-function,
  // It will be executed right after `sbjs` cookies will be set
  // Detailed explanation below
  callback: doSmth
});
```

#### Highlights

##### domain

```javascript
// 0.0.x
_sbjs.push(['_setBaseHost', 'alexfedoseev.com']);


//1.0.0
domain: 'alexfedoseev.com'

// the same
domain: {
  host: 'alexfedoseev.com',
  isolate: false
}
```

The main thing, that changed, is how the script handles **the absence** of this custom option. When no `BaseHost` was set, script's cookie was set **only for current host**. That is ok, if the site doesn't have subdomains to share traffic with and it **never will**.

But what's gonna happen if someday subdomains will occur? In `0.0.x` they won't get the cookies, it means they won't share the traffic, and visitors from main domain to subdomains will be considered as `referral`.

I changed this behaviour, so if the setting is absent, cookies will be set for **current domain and all its subdomains**.

However if you don't want to share the cookies — use `isolate: true`, to isolate this domain.

So, how to update: just pick suitable configuration and pass it to `init` method. Migration tool will do the rest. It's one-time migration, so chose wisely.

Lets see how to set this option in common cases.

**— You don't have subdomains, but someday maybe**

```javascript
// just don't use this option or use this one
domain: 'your-domain.com'
```

**— You don't have subdomains, and don't want to share cookies for some reason**

```javascript
domain: {
  host: 'your-domain.com',
  isolate: true
}
```

**— You have subdomains and want to share traffic between them**

```javascript
// on all pages of domain and its subdomains
domain: 'your-domain.com'
```

**— You have subdomains, but don't want to share traffic between them**
(so visits from domain to subdomains and vise versa will be considered as `referral`)

```javascript
// on all pages of domain
domain: {
  host: 'your-domain.com',
  isolate: true
}

// and on all pages of subdomain
domain: 'sub.your-domain.com'

// or
domain: {
  host: 'sub.your-domain.com',
  isolate: false // or use `isolate: true` if you'd like to isolate it too
}
```

Hope you've got the point. If you have any questions — check [documentation](README.md) for more detailed explanation or [post an issue](https://github.com/alexfedoseev/sourcebuster-js/issues/new).

After you'll roll out the `1.0.0` to production, visitor's old cookies will be updated to chosen setup. Again: it's one-time migration, so chose wisely.

**NB! Do not change `isolate` value after update. If you'll do — your visitors will get doubled cookies and bad things may happen.**

The option, that will give the ability to force-update cookies domain (if you need to change subdomains handling rules), is in my TODO-list, but not available yet.

##### typein_attributes

```javascript
// 0.0.x
_sbjs.push(['_setTypeinAttributes', '(typein)', '(typein)']);


//1.0.0
typein_attributes: {
  source: '(direct)',
  medium: '(none)'
}
```

In `0.0.x` default `utm_source` & `utm_medium` values for `typein` traffic was `(typein)`. And they differ from Google Analytics values: `(direct)` & `(none)`. So I made them equal by default.

How to update.

If you haven't used `_setTypeinAttributes` and wish to keep `utm_source` & `utm_medium` values as `(typein)`, then you need to add:

```javascript
typein_attributes: {
  source: '(typein)',
  medium: '(typein)'
}
```

Otherwise just don't use this setting. Values will be `(direct)` & `(none)`.

##### timezone_offset

```javascript
// 0.0.x
_sbjs.push(['_setTimeZoneOffset', 3]);

//1.0.0
timezone_offset: 3
```

Nothing changed except default behaviour. In `0.0.x`, if no custom value was set, time was normalized to UTC. `1.0.0` have no normalization by default, script uses user's system time.

Example. Your visitor is in London (`UTC +00:00`). His local time is `03:00 AM`. If no `timezone_offset` was set, the time in cookie will be `03:00 AM`. Another visitor at the same moment is from Berlin (`UTC +01:00`) and his local time is `04:00 AM`. The time in cookie will be `04:00 AM`.

If you want to normalize time of all visitors (let it be `UTC +03:00` for example), you should set it via `timezone_offset: 3`. So the time in cookies of both visitors will be `06:00 AM`.

##### callback

```javascript
callback: doSmth
```

No workarounds anymore, just pass the name of the function to `callback` option, and it will be executed right after the cookies will be set. Callback will get the object with `sbjs` data as argument.

```javascript
sbjs.init({ callback: go });

function go(sb) {
  console.log('Cookies are set! Your current source is: ' + sb.current.src);
}
```

### Get data

`get_sbjs` is gone. Grab the data through `sbjs.get` method.

If you don't want to replace `get_sbjs` in your code, just do this:

```javascript
var get_sbjs = sbjs.get;

// and your old code is fine
document.getElementById('user-source').innerHTML = get_sbjs.current.src;
```

### Cookies

Changed params delimiter in cookies: from `|` to `|||`. Cookies will be automatically upgraded by migration tool without data loss. You don't have to worry about this change unless you parse these cookies by yourself.


That's it. If you have any questions — [place an issue](https://github.com/alexfedoseev/sourcebuster-js/issues/new).