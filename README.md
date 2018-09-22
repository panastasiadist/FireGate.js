# FireGate.js - The JavaScript Cookie Firewall
FireGate.js is a tiny client side JavaScript library acting as a global and 
automated cookie firewall allowing or blocking cookies from being set according 
to the policy you specify. The important words here are global and automated. 
FireGate.js is able to automatically block cookies set by client-side JavaScript 
code without the need for the developer to take special care of each chunk of 
JavaScript code setting cookies. The way FireGate.js works, effectively reliefs 
a developer from a great frustration which gets even bigger especially when 
working with a CMS often accompanied by third-party code and plugins in order to 
provide functionality bits.

# Installation
## 1. Download the latest version
- [Non minified]()
- [Minified]()

## 2. Include it in your project
**Example:**
```html
<script src="https://example.com/js/firegate.min.js"></script>
```
**NOTE: You must include it in your project as the first script to be run before 
any other script get's executed.**

## 3. Read the next sections
FireGate.js makes itself available to your code through a global singleton 
instance. Read the example and the documentation following this section for more
information regarding its functionality.

# Quick Start Example
```javascript
/**
 * FireGate.js gets activated and filtering is enabled. Acts by default in a
 * fully permissive way regarding cookies, allowing all cookies to pass through.
 */
FireGate.attach();

/** 
 * That means that the following cookie will be set except if the browser
 * disallows it because of its privacy settings.
 */
document.cookie = 'cookieA=test';

/*
 * Set and immediately enforce (because attach() has been already called) the
 * special built-in permissive policy which allows all cookies to pass through.
 * It is the default policy.
 */
FireGate.setPolicy('permissive');

// That means that the next cookie will also be set/passed to the browser.
document.cookie = 'cookieB=test';

/*
 * But now we immediately enforce the special built-in, fully restrictive
 * policy which allows no cookies to be set/passed to the browser.
 */
FireGate.setPolicy('restrictive');

// That means that the next cookie won't be passed to the browser.
document.cookie = 'cookieC=test';

/*
 * This policy blocks all cookies and allows only cookies named cookieD to pass
 * through.
 */
var customPolicy = {
  defaultsTo: 'block',
  rules: [{
    action: 'allow',
    when: {
      cookieName: '^cookieD$'
    }
  }]
};

// Immediately enforce the new custom policy.
FireGate.setPolicy(customPolicy);

// As a result the next cookie will be allowed.
document.cookie = 'cookieD=test';

// But the next cookie will be blocked.
document.cookie = 'cookieE=test';

// Now allow all cookies except for cookies named cookieE.
var customPolicy2 = {
  defaultsTo: 'allow',
  rules: [{
    action: 'block',
    when: {
      cookieName: '^cookieE$'
    }
  }]
};

// Immediately enforce the new custom policy.
FireGate.setPolicy(customPolicy2);

/*
 * If we try to set cookieE again which was previously blocked, it will not be
 * allowed because of the new policy in effect. Will do it in another way later.
 * Now, we will have FireGate.js free/set all previously blocked cookies which 
 * are allowed by the new policy. 
 */

FireGate.freeCookies(false);

/* 
 * Now document.cookie will contain cookieC which was previously blocked due to
 * the built-in restrictive policy set at the time and because it is allowed by
 * the default of the currently active policy.
 */
console.log(document.cookie);

/*
 * But now let's free every previously blocked cookie even if not allowed by
 * the current policy. In our example, that means that we will free cookieE.
 */
FireGate.freeCookies(true);

// It will contain cookieA, cookieB, cookieC, cookieD, cookieE. 
console.log(document.cookie);

/*
 * Now, FireGate.js stopped its filtering. Any future cookie will be passed to 
 * the browser and only be stopped by the browser if its privacy settings tell
 * it so or there is a Firewall installed which blocks cookies.
 */
FireGate.detach();
```

# Documentation
In order FireGate.js to function properly, it must be the first script to be run
in your website/web application. That means that it must be included in your
project before any other raw JavaScript code or script is loaded.

The reason behind this special requirement is that FireGate.js must run before
any other code is able to set cookies which you wish to block. Actually, if any
cookie is set before FireGate.js is able to filter and block it, or before you
have configured it to do so, FireGate.js will not be able to delete it
afterwards.

## Policies
---------------------------------------------
FireGate.js is built upon the concept of policies. A policy specifies which
cookies are allowed to be set or must be blocked. A policy may contain detailed
rules which tell FireGate.js how to handle specific cookies. When FireGate.js is
active, the active policy instructs FireGate.js how it must handle cookies.

A policy may be a simple string (for built-in helper policies) or a Plain Old
JavaScript Object (POJO) for a custom policy with more detailed rules. A single
policy is active at each moment which may contain an unlimited number of rules.

The flexible nature of policies, allows the developer to instantly configure the
behavior of FireGate.js on the fly and without the need for page reloading. This
is something especially useful for the purpose of having different policies
enforced depending on user action such as when a user must first accept the
usage of cookies.

### 1. Permissive Policy - Allowing all cookies
The permissive policy is a special, built-in policy, provided by FireGate.js
which permits all cookies being set by another code. It is active by default, 
effectively making FireGate.js follow the normal browser behavior (and its
privacy settings) until you specify another policy.

**Example**
```javascript
var success = FireGate.setPolicy('permissive');
```
**Note that setting the permissive policy, does not automatically free any 
previously blocked cookies which got blocked because of another policy.**

### 2. Restrictive Policy - Blocking all cookies
The restrictive policy is a special, built-in policy, which blocks all cookies
from being set by another code. No cookie is even passed to the browser for
further processing and storage according to its privacy settings or any Firewall
the user may have installed.

**Example**
```javascript
var success = FireGate.setPolicy('restrictive');
```
**Note that setting the restrictive policy, will not delete/unset any previously
allowed cookies.**

### 3. Custom Policy
A custom policy is a Plain Old JavaScript Object (POJO) containing configuration
fields. A custom policy may contain rules checked against each cookie with a
default action (to allow or block) for any cookies not catched by the specified
rules. That means that a default action is mandatory while specific rules are
optional.

**Example #1 - Custom policy allowing all cookies**
```javascript
/**
 * Custom policy object which allows all cookies with no detailed rules.
 * Effectively the same as the built-in permissive policy.
 */
var policy = {
  defaultsTo: 'allow'
};
```

**Example #2 - Custom policy blocking all cookies**
```javascript
/**
 * Custom policy object which blocks all cookies with no detailed rules.
 * Effectively the same as the built-in restrictive policy.
 */
var policy = {
  defaultsTo: 'block',
};
```

**Example #3 - Custom policy blocking cookies by default with detailed rules**
```javascript
var policy = {
  defaultsTo: 'block',
  rules:[{
    action: 'allow',
    when: {
      cookieName: '^cookieA$' // Regular Expression
    }
  }, {
    action: 'allow',
    when: {
      cookieName: '^cookieA[0-9]$'
    }
  }]
};
```
The policy shown above will allow any cookie named **cookieA** as well as every
cookie named **cookieA1**, **cookieA2**, etc. The policy will block any other 
cookie not catched by the rules because the policy defaults to **block**.

**Example #4 - Custom policy with multiple overlapping rules**
```javascript
var policy = {
  defaultsTo: 'allow',
  rules:[{
    action: 'block',
    when: {
      cookieName: '^cookieA$'
    }
  }, {
    action: 'allow',
    when: {
      cookieName: '^cookieA$'
    }
  }]
};
```
The policy shown above will block any cookie named **cookieA** but it will allow
any other cookie. The second rule allows **cookieA** but the first one does not. 
The first matching rule has utmost priority and its action is being enforced.

## Setting a policy
You may set a policy as shown below:
```javascript
// Setting a custom policy object.
var success = FireGate.setPolicy(policy);
// Setting the built-in permissive policy.
success = FireGate.setPolicy('permissive');
// Setting the built-in restrictive policy.
success = FireGate.setPolicy('restrictive');
// Setting a non-existent built-in policy.
success = FireGate.setPolicy('restrictive_invalid');
```
In the example shown above, each call to ```setPolicy()``` will 
return ```true``` if the policy supplied is valid and gets successfully set up. 
In the end, the last valid policy will be applied overwriting the previously set 
valid policies. That means that the last policy set will return false and the 
policy to be enforced will be the third one, the **restrictive** policy.

## Attaching (activating filtering)
FireGate.js refers to the action of being activated / filtering cookies as being
_attached_. This is because, FireGate.js _attaches_ its filtering mechanism to 
the browser on which it runs. 

In order to have FireGate.js start filtering, you must attach it and set a
policy. The order of actions does not matter. You may either first attach it and 
then set a policy or the opposite. If you first attach it and then set a policy,
FireGate.js will initially enforce the **default permissive** policy and switch 
to the new one, as soon as you have set it. If you set a policy first and then 
attach FireGate.js, it will start filtering using your own policy as soon as you
have attached it. 

**Example #1 - Attaching**
```javascript
// Returns true or false.
var success = FireGate.attach();
// Filtering using default permissive policy which allows all cookies.
```
When calling ```attach()```, it will return either true or false:
- ```true``` if FireGate.js successfully attached its filtering mechanism. The
active policy is enforced and any other future policy will be immediately
enforced when it is set.
- ```false``` if FireGate.js failed to attach its filtering mechanism. The active
policy is not enforced. The browser continues operating on its own according to
its privacy settings. ```false``` may be returned if the browser does not
support the functionality required by FireGate.js or if the system is already
attached.

**Example #2 - Attaching before setting a policy**
```javascript
var success = FireGate.attach();
// Filtering using default permissive policy which allows all cookies.
FireGate.setPolicy('restrictive');
// Now filtering using the restrictive policy. It immediately takes effect.
```

**Example #3 - Setting a policy before attaching**
```javascript
FireGate.setPolicy('restrictive');
var success = FireGate.attach();
// Filtering using the restrictive policy.
```

**Example #4 - Setting an non-existent policy before attaching**
```javascript
FireGate.setPolicy('restrictive_invalid');
var success = FireGate.attach();
// Filtering using the default permissive policy.
```
In the example shown above, the policy enforced will be the default built-in
**permissive** policy because **restrictive_invalid** policy does not exist.

## Detaching (deactivating filtering)
In the same way you attach FireGate.js, you may detach it in order to have it 
stop filtering. That means that the active policy will stop being enforced for 
cookies being set after FireGate.js has stopped filtering.

**Example #1 - Detaching**
```javascript
// Returns true or false.
var success = FireGate.detach(); 
// Now all cookies allowed - no policy enforcement - plain browser behavior
```
When calling ```detach()```, it will return either true or false:
- ```true``` if FireGate.js successfully detached its filtering mechanism. The 
active policy is not enforced. The last policy set will be enforced only when 
```attach()``` is called again.
- ```false``` if FireGate.js failed to detach its filtering mechanism.
```false``` will be returned if FireGate.js is not currently attached.

## Freeing cookies
FireGate.js supports freeing, that is, setting previously blocked cookies. It is
able to free all previously blocked cookies or only the cookies which are
allowed by the current policy, supposed that the currently active policy is
different to the policy that was active when the respective got blocked.

**Example #1:**
```javascript
/*
 * This will free all cookies previously blocked which are allowed by the
 * current policy.
 */
FireGate.freeCookies(false);
```

**Example #2:**
```javascript
/*
 * This will free all cookies previously blocked even if not allowed by the
 * current policy.
 */
FireGate.freeCookies(true);
```
Once a cookie is freed/set, there is no way to delete it using FireGate.js. You
should delete/expire it on your own either using code or using the browser's
controls.

# Frequently Asked Questions

## How FireGate.js works?
FireGate.js works by intercepting document.cookie. It replaces the browser\'s accessor functions with its own. It then filters everything going in and our of the browser\'s cookie storage according to the specified policy.

## Which is the key feature of FireGate.js?
The way FireGate.js works, allows it to handle cookies before even being set by other JavaScript code instead of acting on a delayed basis. This enables it to act as an automatic and global firewall.

## Does FireGate.js automatically handle all cookies?
It depends. FireGate.js is able to automatically handle/intercept all cookies set by other JavaScript code provided that it is activated before any other cookie-setting code is run. It doesn't handle cookies set in iframes as it is not possible to directly inject code in an iframe due to each browser's security features.

# Our Great Supporters
![Browserstack](https://firegatejs.anastasiadis.online/assets/browserstack-logo-200x43.png)

We use [BrowserStack](https://browserstack.com) for R&D and testing purposes while developing FireGate.js.
