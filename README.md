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

[About (rus)](http://www.alexfedoseev.com/post/40/sourcebuster-js) &middot; [Download](http://statica.alexfedoseev.com/sourcebuster-js/download/sourcebuster-js-0.0.1.zip) &middot; [Test page](http://statica.alexfedoseev.com/sourcebuster-js/)

## Setup
Script is written in pure JavaScript, doesn’t have any dependency on third-party libraries and doesn’t interacts with DOM’s objects, so it can be called as soon as you want it. Higher you’ll place it in the `<head>` tag, sooner you’ll get the cookies, whose data can be used for DOM’s objects manipulation (phones change etc.).

### Simple setup
Place in the `<head>` tag:

```html
<script src="sourcebuster.js"></script>
```

Fits for those who:
* doesn’t have subdomains
* consider that Google and Yandex is the only organic traffic sources out there (everything else is insignificant or referral)

**What's in the box**  
* By default organic traffic is only visits from SERP of Google and Yandex. I will add more organic sources in default setup in the future (after some test on projects with traffic).
* User’s session duration: 30 minutes.
* Using default setup on projects with subdomains can cause unexpected results. See “Advanced setup” section for detailed explanation how to set it up on projects with subdomains.
* Script doesn’t store user ip by default.

### Advanced setup

```javascript
<script>
  var sbjs_location = '../sourcebuster.js';

  var _sbjs = _sbjs || [];
  _sbjs.push(['_setSessionLength', 15]);
  _sbjs.push(['_setBaseHost', 'statica.alexfedoseev.com']);
  _sbjs.push(['_addOrganicSource', 'yahoo.com', 'p']);
  _sbjs.push(['_addOrganicSource', 'bing.com', 'q']);
  _sbjs.push(['_addReferralSource', 'facebook.com', 'social']);
  _sbjs.push(['_addReferralSource', 't.co', 'social', 'twitter.com']);
  _sbjs.push(['_addReferralSource', 'plus.url.google.com', 'social', 'plus.google.com']);

  var sbjs = document.createElement('script'); sbjs.type = 'text/javascript'; sbjs.src = sbjs_location;
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(sbjs, s);
</script>
```

Put it in the `<head>` tag, provide the path to sourcebuster script in `sbjs_location` variable and push your custom settings into the core using `_sbjs.push`.

There are 5 types of user settings:  
* _setSessionLength
* _setBaseHost
* _addOrganicSource
* _addReferralSource
* _setUserIP

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

#### _addOrganicSource

```javascript
_sbjs.push(['_addOrganicSource', 'bing.com', 'q']);
```

Adds Organic source. You can use this setting if you want to add more organic sources.

For example you want the traffic from the SERP of **bing.com** to be organic. So you need to provide basehost — `'bing.com'`, and the param of keyword — `'q'`. Both params are required.

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
`fd=Thu Jun 19 2014 16:09:12 GMT+0800 (WITA)|ep=http://statica.alexfedoseev.com/sourcebuster-js/`

*Params*  

* ***fd***  
Date and time ofthe first visit.

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

To manipulate with DOM’s objects sourcebuster.js have 2 events:
* `'sbjs:set'` — cookies are placed
* `'sbjs:ready'` — data are available through get_sbjs

Example:

```javascript
document.addEventListener('sbjs:ready', function() {
  document.getElementById('sb_first_typ').innerHTML = get_sbjs.first.typ;
}, false);
```

### Limitations

#### Events in old browsers
It's about IE8 and lower, which don't understand `Event`. It can be solved the following way: for modern browsers we’ll fire the `Event`, for others old-school-hardcore-lovers we’ll fallback to `window.onload` (with the check — `if` or `conditional comment`).

```javascript
function place_data() {
  document.getElementById('sb_first_typ').innerHTML = get_sbjs.first.typ;
}

document.addEventListener('sbjs:ready', function() {
  place_data();
}, false);

window.onload = function() {
  if (document.getElementById('sb_first_typ').innerHTML === '') {
    place_data();
  }
}
```

#### Visits from https to http
When the visitor come from `https` web-site to `http`, the request don't have a referer. So the script will consider it as `typein` (direct visit). It's also apply to visits from Google's SERP.

In such cases **sourcebuster** will match the Google organic source only in desktop WebKit browsers (Chrome & Safari), because only they support `meta referrer` tag (google is using it).

```html
<meta name="referrer" content="origin">
```

#### Symbol "|" in utms
If you use `|` in your `utm`s, then `get_sbjs` probably will give you incorrect results. Sorry e.
