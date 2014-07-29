# Sourcebuster JS

## About
* Sourcebuster tracks the sources of your site’s visitors and stores the data in the cookies for further analysis.
* It handles sources-overriding just like Google Analytics does.
* Script is completely independent in the way it gets the data.
* It’s written in pure JavaScript, without any dependency from third-party libraries.
* You can use received data for:
 * phones change
 * site content change
 * export data within forms to your CRM or analysis system.

## Links

[About (rus)](http://www.alexfedoseev.com/post/40/sourcebuster-js) &middot; [Download](https://github.com/alexfedoseev/sourcebuster-js/archive/master.zip) &middot; [Test page](http://statica.alexfedoseev.com/sourcebuster-js/) &middot; [Changelog](https://github.com/alexfedoseev/sourcebuster-js/blob/master/CHANGELOG.md)

## Install
You can [download this repo](https://github.com/alexfedoseev/sourcebuster-js/archive/master.zip) and use `sourcebuster.min.js` from `/js` folder.

Or install it from Bower:

```
bower install --save sourcebuster-js
```

## Setup
Script is written in pure JavaScript, doesn’t have any dependency on third-party libraries and doesn’t interacts with DOM’s objects, so it can be called as soon as you want it. Higher you’ll place it in the `<head>` tag, sooner you’ll get the cookies, whose data can be used for DOM’s objects manipulation (phones change etc.).

### Simple setup
Place in the `<head>` tag:

```html
<script src="/path/to/sourcebuster.min.js" id="sbjs"></script>
```

Fits for those who:
* doesn’t have subdomains
* consider that Google and Yandex is the only organic traffic sources out there (everything else is insignificant or referral)

**What's in the box**  
* By default organic traffic is the visits from SERP of Google and Yandex + from number of sources listed below.
* User’s session duration: 30 minutes.
* Using default setup on projects with subdomains can cause unexpected results. See “Advanced setup” section for detailed explanation how to set it up on projects with subdomains.
* Script doesn’t store user ip by default.

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

### Advanced setup

```javascript
<script>
  var _sbjs = _sbjs || [];
  _sbjs.push(['_setSessionLength', 15]);
  _sbjs.push(['_setBaseHost', 'statica.alexfedoseev.com']);
  _sbjs.push(['_setTimeZoneOffset', 4]);
  _sbjs.push(['_setCampaignParam', 'custom_campaign']);
  _sbjs.push(['_addOrganicSource', 'lycos.com', 'q']);
  _sbjs.push(['_addOrganicSource', 'bing.com', 'q', 'bing_in_da_house']);
  _sbjs.push(['_addReferralSource', 'facebook.com', 'social']);
  _sbjs.push(['_addReferralSource', 't.co', 'social', 'twitter.com']);
  _sbjs.push(['_addReferralSource', 'plus.url.google.com', 'social', 'plus.google.com']);
</script>
<script src="/path/to/sourcebuster.min.js" id="sbjs"></script>
```

Put it in the `<head>` tag: push your custom settings into the core using `_sbjs.push` and load sourcebuster script right after it.

There are 7 types of user settings:  
* _setSessionLength
* _setBaseHost
* _setTimeZoneOffset
* _addOrganicSource
* _addReferralSource
* _setUserIP
* _setCampaignParam

#### _setSessionLength

```javascript
_sbjs.push(['_setSessionLength', 15]);
```

Setting up user session duration (in minutes).  
In **sourcebuster.js** this parameter affects only referral sources overriding.

A few words about sources overriding. When the visitor comes on your site for the first time, we receive and store the data about his source. After some time this visitor can return to your website, but from another source, and we need to have some rules to decide — should we overwrite previous source or we should not.

The rules are the same with Google Analytics:
* UTM and Organic source always overrides any previous source.
* Typein never overrides a previous source.
* Referral source overrides previous source only if there is no user session at the moment. If it’s inside the same session — a referral source will never override previous source.

Explanation to Referral logic: sometimes visitor within the current visit (session) comes to the website from the “source” which is not actually a “source”. For example, it can be visit from the email service, where he had a registration activation link.

#### _setBaseHost

```javascript
_sbjs.push(['_setBaseHost', 'alexfedoseev.com']);
```

Setting up Base host. Use this setup only if you have subdomains on your site.

Let’s take a look at examples.

**No. 1**  
The first scenario. You have a site: **wow.com**. Also you have a blog on this site: **blog.wow.com**. And you don’t  want to separate traffic between them. It means that when the visitor come from **blog.wow.com** to **wow.com**, it won’t be a new visit for **wow.com** (with **blog.wow.com** as Referral source), it will be a common inner click without source change (to sourcebuster.js this scenario will be equal to inner page change: from *wow.com/about* to *wow.com/contacts* for example). To achive this you have to add this line on both sites: **wow.com & blog.wow.com**.

```javascript
_sbjs.push(['_setBaseHost', 'wow.com']);
```

**No. 2**  
That was simple. Now lets take a look at opposite scenario — you want to separate traffic between your subdomains and consider it as Referral. There is the main site — **wow.com**, and there is a blog on this site — **blog.wow.com**, which also has user subdomains — **alex.blog.wow.com** is one of them. You don’t want to separate traffic between **blog.wow.com** and **alex.blog.wow.com**, but you do want to separate it between all the blogs and the main site. Here’s how we can sort it out:

```javascript
// put this on the main site wow.com
_sbjs.push(['_setBaseHost', 'wow.com', false]);

// and this on the blogs subdomains (blog.wow.com & alex.blog.wow.com) 
_sbjs.push(['_setBaseHost', 'blog.wow.com']);
```

Pay attention to the third param `false` in the line for the main domain. Use it only when all incoming traffic from all subdomains should be referral in relation to provided host. 

In our example if the visitor came for the first time on the main site **wow.com** by clicking on the link in user’s blog **alex.blog.wow.com**, his source (for the **wow.com**) will be **alex.blog.wow.com** (traffic type: *referral*).

How to check that third param `false` in `_setBaseHost` is in the right place:  
* host of the page, which code have setting `_setBaseHost` with param `false` must be equal to the host provided in `_setBaseHost` line:

```javascript
// CORRECT: on the pages of wow.com
_sbjs.push(['_setBaseHost', 'wow.com', false]);

// DOESN’T MAKE SENSE: on the pages blog.wow.com
_sbjs.push(['_setBaseHost', 'wow.com', false]);
```
* all incoming traffic from all subdomains will be referral in relation to provided host:

```javascript
_sbjs.push(['_setBaseHost', 'wow.com', false]);
=> *.wow.com → wow.com will be referral
```

#### _setTimeZoneOffset

```javascript
_sbjs.push(['_setTimeZoneOffset', 4]);
```

Setting up time zone.    
Date is saved in UTC by default. But you can set different time zone via `_setTimeZoneOffset`.

#### _addOrganicSource

There are already a number of predefined organic sources in the core:

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
_sbjs.push(['_addOrganicSource', 'lycos.com', 'q']);
_sbjs.push(['_addOrganicSource', 'bing.com', 'q', 'bing_in_da_house']);
```

For example you want the traffic from the SERP of **bing.com** to be organic and the alias for this source to be `bing_in_da_house`. So you need to provide basehost — `'bing.com'`, and the param of keyword — `'q'`. Both params are required. Also, to set custom alias for the source, provide optional third param (`'bing_in_da_house'`).

To get the keyword param go to **bing.com** and search for smth, **“apple”** for example. After you’ll get to the SERP, explore its URL:  
*http://www.bing.com/search?q=apple&go=&qs=n&form=QBLH&pq=apple&sc=8-5&sp=-1&sk=&cvid=718ad07527244c319ecebf44aa261f64*

Keyword param — `'q'` — is a symbol/word between `“?”` (or `“&”` if the param is not the first after question sign) and `“=apple”` in URL of SERP.

#### _addReferralSource

```javascript
_sbjs.push(['_addReferralSource', 'facebook.com', 'social']);
_sbjs.push(['_addReferralSource', 't.co', 'social', 'twitter.com']);
```

Adds Referral source.

In general if you’re ok with the fact that medium (`utm_medium`) of traffic from facebook.com is referral, you don’t need this setting. But if you want to make this kind of traffic “social” (`utm_medium=social`), you can set it up using `_addReferralSource`. First param is `base host` of the source, second — preferred value of `utm_medium`.

Moreover some of the traffic sources have different referer host in relation to their main domain (for example, traffic from Twitter has referer with the host — *t.co*). In these cases you can assign alias to the source using optional third param. Also with this param you can group the traffic from the set of the sites into one virtual source.

#### _setUserIP

```javascript
_sbjs.push(['_setUserIP', <%= request.remote_ip %>]);
```

Sets user’s ip address.
By default sourcebuster can’t store ip address of the visitor. But if you need it, you can get it on your back-end and push it using `_setUserIP` setting. In this example we get it using Ruby.

#### _setCampaignParam (and Google AdWords `gclid` param handler)

```javascript
_sbjs.push(['_setCampaignParam', 'custom_campaign']);
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

You can provide a custom `utm_campaign` name via `_setCampaignParam` and value of this GET-param:    
http://statica.alexfedoseev.com/sourcebuster-js/?gclid=sMtH&custom_campaign=test_custom

You'll get the following:
* Traffic type: utm
* utm_source: google
* utm_medium: cpc
* utm_campaign: test_custom
* utm_content:  (none)
* utm_term: (none)

**WARNING** 
* If there is original utm-param in request (`utm_source`, `utm_medium`, `utm_campaign`), it will override `gclid` param and `_setCampaignParam` param value.
* If there is only custom campaign param (`_setCampaignParam`) in request, Sourcebuster will consider it as `utm` traffic. 

## Usage
### Cookies
When the script is setted up and pushed to production, visitors will get the following cookies:  
* sbjs_current
* sbjs_first
* sbjs_first_add
* sbjs_session
* sbjs_referer
* sbjs_udata

#### sbjs_current

*Data*  
Params of the latest visitor’s source.
If the visitor had more than one source, in this cookie will be the latest.

*Format*  
`typ=organic|src=google|mdm=organic|cmp=(none)|cnt=(none)|trm=(none)`

*Params*  

* ***typ***  
Traffic type. Possible values: utm, organic, referral, typein.

* ***src***  
Source. utm_source, actually.

* ***mdm***  
Medium, utm_medium. Can be customized using utm-params and `_addReferralSource`.

* ***cmp***  
Campaign. Value of utm_campaign.

* ***cnt***  
Content. Value of utm_content.

* ***trm***  
Keyword. Value of utm_term.

*Examples*  
```python
# source: adv campaign with utms
typ=utm|src=yandex|mdm=cpc|cmp=my_adv_campaign|cnt=banner_1|trm=buy_my_stuff

# source: google's SERP
typ=organic|src=google|mdm=organic|cmp=(none)|cnt=(none)|trm=(none)

# source: referral from site.com
typ=referral|src=site.com|mdm=referral|cmp=(none)|cnt=(none)|trm=(none)

# source: facebook with _addReferralSource setting
typ=referral|src=facebook.com|mdm=social|cmp=(none)|cnt=(none)|trm=(none)

# source: direct visit
typ=typein|src=typein|mdm=typein|cmp=(none)|cnt=(none)|trm=(none)
```

#### sbjs_first

*Data*  
Just like `sbjs_current`, but stores params of the very first visit. Placed once, never overwritten.

#### sbjs_first_add

*Data*  
Additional info of the first visit. Date and time + entrance point.

*Format*  
`fd=2014-06-11 17:28:26|ep=http://statica.alexfedoseev.com/sourcebuster-js/`

*Params*  

* ***fd***  
Date and time ofthe first visit. Format: `yyyy-mm-dd hh:mm:ss`. In UTC by default. Time zone can be customized via `_setTimeZoneOffset`.


* ***ep***  
Entrance point.

#### sbjs_session

*Data*  
Cookie-flag, that user have opened session. Life duration: 30 minutes or your setting using `_setSessionLength` (from the moment of the latest activity).

#### sbjs_referer

*Data*  
Referer, which was stored when the current source was written (and previous source was overwritten).

*Format*  
`ref=https://twitter.com`

*Params*  

* ***ref***  
Referer URL.

#### sbjs_udata

*Data*  
Additional user data: ip & user-agent.

*Format*  
`uip=80.20.123.77|uag=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36`

*Params*  

* ***uip***  
Current ip-address.

* ***uag***  
Current user-agent (browser).


### Getting the data

Stored data are available through `get_sbjs`:

```javascript
get_sbjs.name_of_cookie_without_prefix_sbjs_.name_of_param

// for example, to get current utm_source
get_sbjs.current.src

// first utm_medium
get_sbjs.first.mdm

// entrance point
get_sbjs.first_add.ep

// user-agent
get_sbjs.udata.uag

// and so on
```

Of course you can parse the cookies on your back.

### Using the data

Let's print on the page current source of the visitor. To do this we need `get_sbjs` to be defined. If it's not, we have to wait until sourcebuster is loaded, and only after it, run the function, which will place the current source on the page. Also we will need a little fix-function for IE8 and lower to run the function in the right time (after sourcebuster is loaded).

Here it is:

```javascript
// container for current source
<div id="data-box"></div>

<script type="text/javascript">

  // fix/helper for IE: run callback-function only after main script is loaded
  function ie_load_bug_fix(script, callback) {
    if (script.readyState == 'loaded' || script.readyState == 'completed') {
      callback();
    } else {
      setTimeout(function() { ie_load_bug_fix(script, callback); }, 100);
    }
  }

  // function, which places current source
  function place_data() {
    document.getElementById('data-box').innerHTML = get_sbjs.current.src;
  }
  
  // and action:
  // first we're checking if get_sbjs is defined
  // if it is, we are placing the data
  // otherwise, we're checking the browser and placing the data only after sourcebuster is loaded
  if (typeof get_sbjs !== 'undefined') {
    place_data();
  } else {
    if (window.addEventListener) {
      sbjs.addEventListener('load', place_data, false);
    } else if (window.attachEvent) {
      ie_load_bug_fix(sbjs, place_data);
    }
  }

</script>
```

### Limitations

#### Visits from https to http
When the visitor come from `https` web-site to `http`, the request don't have a referer. So the script will consider it as `typein` (direct visit).

#### Symbol "|" in utms
If you use `|` in your `utm`s, then `get_sbjs` probably will give you incorrect results. Sorry e.
