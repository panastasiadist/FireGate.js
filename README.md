# FireGate.js - The JavaScript Cookie Firewall
FireGate.js is a client side JavaScript library acting as a cookie firewall, allowing or blocking
cookies according to the specified policy. It is able to automatically block cookies set by client
side JavaScript code, relieving the developer from the hassle of handling each JavaScript code chunk
that sets cookies.

<br>
<br>

# Usage
## 1. Load FireGate.js in your client side code.
```html
<script src="https://example.com/js/firegate.min.js"></script>
```
**Note:** You should make sure that FireGate.js is the first script to run before any other script.

<br>

## 2. Try the Quick Start Example.
FireGate.js is available through the global **```FireGate```** instance. Try the example and consult
the Guide to make the most out of FireGate.js.

<br>
<br>

# Quick Start Example
```javascript
// Start cookie filtering. By default, using the built-in permissive policy that allows all cookies.
var success = FireGate.cookies.startFiltering();

// This cookie is allowed to be set except if browser's settings disallow it.
document.cookie = 'cookieA=test';

// Immediately enforce the built-in permissive policy (actually already active by default).
success = FireGate.cookies.setFilteringPolicy('permissive');

// That means that the next cookie will also be allowed/set to the browser.
document.cookie = 'cookieB=test';

// Immediately enforce the built-in restrictive policy, blocking all cookies from being set.
FireGate.cookies.setFilteringPolicy('restrictive');

// That means that the next cookie won't be set.
document.cookie = 'cookieC=test';

// Prepare a custom policy that blocks all cookies except for the cookie named 'cookieD'.
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
FireGate.cookies.setFilteringPolicy(customPolicy);

// As a result, the next cookie will be set.
document.cookie = 'cookieD=test';

// But the next cookie will be blocked.
document.cookie = 'cookieE=test';

// Prepare a custom policy that allows all cookies except for the cookie named 'cookieE'.
var customPolicy2 = {
  defaultsTo: 'allow',
  rules: [{
    action: 'block',
    when: {
      cookieName: '^cookieE$'
    }
  }]
};

// Immediately enforce the new policy.
FireGate.cookies.setFilteringPolicy(customPolicy2);

// cookieE is blocked again, now due to the new policy keeping it blocked.
document.cookie = 'cookieE=test';

// Free (set) previously blocked cookies which are allowed by the active policy.
var freedCookieNameArray = FireGate.cookies.freeCookies('allowed');

// cookieC is now set, because it is allowed by customPolicy2 (due to its default action).
console.log(document.cookie);

// Free/set all previously blocked cookies, even if not allowed by the active policy.
FireGate.cookies.freeCookies('all');

// Contains cookieA, cookieB, cookieC, cookieD, cookieE.
console.log(document.cookie);

// Stop filtering. Cookies will be passed to the browser without being checked.
var success = FireGate.cookies.stopFiltering();
```

<br>
<br>

# Update Notice
FireGate.js v2.0 features significant changes to its API. Read the changelog before updating to it.

<br>
<br>

# Guide
In order for FireGate.js to be truly effective, its filtering should start before any other
JavaScript code is run, essentially allowing it to filter cookies early on.

<br>

## Policies
---------------------------------------------
FireGate.js is built upon the concept of policies. A policy specifies which cookies are allowed to
pass to the browser or should be blocked. A policy may contain rules instructing FireGate.js how to
handle cookies that meet the conditions imposed by the rules.

A policy may be a simple string (for built-in policies), or a Plain Old JavaScript Object (POJO)
containing fine-grained rules setting out which cookies should be allowed or should be blocked. Two
built-in policies are supported: **permissive** and **restrictive**.

The flexible nature of policies enables configuring the behavior of FireGate.js on the fly without
the need for page reloading. This is useful when requiring policy enforcement based on user action
(such as user's acceptance of cookies) without forcing the user's browser to reload the page.

<br>

### 1. Permissive Policy - Allowing all cookies
The **permissive** policy is a built-in policy, allowing all cookies to pass through. It is active
by default in order to prevent unintented side effects when filtering starts without explicitly
having set a policy.

**Example #1**
```javascript
var success = FireGate.cookies.setFilteringPolicy('permissive');
```
**Note:** Setting the permissive policy, does not automatically set any previously blocked cookies.

<br>

### 2. Restrictive Policy - Blocking all cookies
The **restrictive** policy is a built-in policy, blocking all cookies from being set to the browser.

**Example #2**
```javascript
var success = FireGate.cookies.setFilteringPolicy('restrictive');
```
**Note:** Setting the restrictive policy will not delete any cookies already set.

<br>

### 3. Custom Policy
A custom policy is shaped as a Plain Old JavaScript Object (POJO), enabling fine-tuned control on
how FireGate.js should handle each cookie. A custom policy may contain an unlimited number of rules.
Each rule specifies an action to apply to cookies meeting the conditions imposed by the rule. A
cookie should satisfy all conditions of a rule in order for the latter's action to be enforced on
the cookie. Rules' evaluation stops to the first rule that applies to a cookie, respecting rules'
order as specified by the developer.

Each policy object must have at least one property named **```defaultsTo```**, supporting the
following values: **```'allow'```** and **```'block'```**. The said property informs FireGate.js of how
it should handle cookies which are not catched by the rules of the policy. Moreover, a policy may
contain no rules. If that is the case, then the default action is enforced on all cookies. The
following examples demonstrate usage of **```defaultsTo```** property.

**Example #3 - Custom policy allowing all cookies**
```javascript
// Custom policy without rules, allowing all cookies, acting as the permissive policy.
var policy = {
  defaultsTo: 'allow'
};
```

**Example #4 - Custom policy blocking all cookies**
```javascript
// Custom policy without rules, allowing all cookies, acting as the restrictive policy.
var policy = {
  defaultsTo: 'block',
};
```

However, the aforementioned usage scenarios may be too simplistic in a real-world situation. The
real power of a custom policy comes in the form of rules specifying an action to take on cookies
meeting the conditions imposed by each rule.

A custom policy object may contain a **```rules```** property, holding an array of objects that
specify an action to take on cookies that meet specific requirements. Each rule contained in the
**```rules```** array is shaped an as object requiring exactly two properties: **```action```** and
**```when```**:
- **```action```**: supports two values: **```'allow'```** and **```'block'```**.
- **```when```**: is shaped as an object:
  - each property specifies a test to run on each cookie.
  - each property's value is a regular expression used by the test against the cookie's details.

Each property in the **```when```** object is named after a test supported by FireGate.js.
Currently, the only supported test is **```cookieName```** that allows checking the name of a cookie according to a regex specified. The action specified by **```action```** is enforced on a cookie if
the latter meets the **```when```** conditions of a rule.

In case more than one rules are registered in a policy, each cookie is checked against each rule,
respecting the order of rules as specified by the developer. Rules' evaluation stops on the first
rule to apply on a cookie. If no rules apply to a cookie, **```defaultsTo```** action is enforced on
it. The following examples englighten the usage of rules.

**Example #5 - Custom policy with rules blocking cookies by default**
```javascript
// Block all cookies except for those named cookieA, cookieA1, cookieA2, etc.
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

**Example #6 - Custom policy with multiple overlapping rules**
```javascript
/**
 * Allow all cookies except for the cookie named 'cookieA'. The first rule takes precedence as it is
 * the first rule to apply to cookieA.
 */
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

<br>

## Setting a policy
---------------------------------------------
Setting a policy is performed using **```cookies.setFilteringPolicy()```** function, passing either
a string corresponding to a supported built-in policy, or passing a policy object. The function
returns true or false depending on the success of the operation.

Setting a policy does not automatically enforce it, however it does replace the previously loaded
policy. A policy is enforced when filtering is activated. If filtering is enabled at the time of
setting a policy, then the new policy is immediately enforced for future cookie attempts. You may
set a policy as demonstrated below:

**Example #7**
```javascript
// Set a policy object.
var success = FireGate.cookies.setFilteringPolicy(policy);

// Enforces the policy set above.
success = FireGate.cookies.startFiltering();

// Set the built-in permissive policy which immediatelly get's enforced.
success = FireGate.cookies.setFilteringPolicy('permissive');

// Set the built-in restrictive policy, replacing the permissive policy.
success = FireGate.cookies.setFilteringPolicy('restrictive');
```
**Note:** The **permissive** policy is already enabled by default when starting cookie filtering.

<br>

## Activating filtering
---------------------------------------------
Filtering is enabled using the **```cookies.startFiltering()```** function that returns true or
false depending on the success of the operation. If no policy has been set before calling this
function, then the permissive policy is enforced by default, allowing all cookies to pass through.

**Example #8**
```javascript
/**
 * Start filtering using default permissive policy which allows all cookies.
 * If false is returned, then filtering wasn't enabled and all cookies are directly passed to the
 * browser. This behavior should be encountered only if the browser does not support the
 * functionality required by FireGate.js or if filtering has already started.
 */
var success = FireGate.cookies.startFiltering();
```

**Example #9 - Setting a policy when filtering is already enabled**
```javascript
// Filtering using default permissive policy which allows all cookies.
var success = FireGate.cookies.startFiltering();

// Now filtering using the restrictive policy which blocks all cookies. It immediately takes effect.
success = FireGate.cookies.setFilteringPolicy('restrictive');
```

**Example #10 - Setting a policy before starting filtering**
```javascript
var success = FireGate.cookies.setFilteringPolicy('restrictive');

// Filtering starts using the restrictive policy.
success = FireGate.cookies.startFiltering();
```

**Example #11 - Setting an non-existent built-in policy before starting filtering**
```javascript
// The specified built-in policy is invalid. False will be returned.
var success = FireGate.cookies.setFilteringPolicy('restrictive_invalid');

// Starting filtering using the default permissive policy.
success = FireGate.cookies.startFiltering();
```

<br>

## Deactivating filtering
---------------------------------------------
Filtering is deactivated using the **```cookies.stopFiltering()```** function which returns true or
false to signal the success of the operation. All cookies are passed to the browser when filtering
stops. False will be returned if filtering is already disabled.

**Example #12**
```javascript
var success = FireGate.cookies.stopFiltering();

// Now all cookies are allowed - no policy enforcement, just the browser's behavior.
```

<br>

## Freeing cookies
---------------------------------------------
FireGate.js supports freeing, that is, setting previously blocked cookies. It supports setting all
previously blocked cookies, only those allowed by the current policy, or specific cookies without
checking if allowed by the current policy.

**Example #13:**
```javascript
// Free all cookies previously blocked, but now allowed by the current policy.
FireGate.cookies.freeCookies('allowed');
```

**Example #14:**
```javascript
// Free all previously blocked cookies, even if not allowed by the current policy.
FireGate.freeCookies('all');
```

**Example #15:**
```javascript
// Free all previously blocked cookies, even if not allowed by the current policy.
FireGate.freeCookies(['cookie1', 'cookie2']);
```

Once a cookie is freed/set, there is no way to delete/unset it using FireGate.js.

<br>
<br>

# Frequently Asked Questions

## How FireGate.js works?
FireGate.js intercepts document.cookie, replacing the browser's accessor functions with its own. It
filters everything going in and out of the browser's cookie storage according to the specified
policy.

## Does FireGate.js automatically handle all cookies?
FireGate.js is able to automatically handle/intercept all cookies set by other JavaScript code
provided that it is activated with an appropriate cookie policy before any other cookie-setting code
is run. However, it can't handle cookies set in iframes.

<br>
<br>

# Browser Compatibility
We tested FireGate.js on a vast array of devices and OS versions offered by
[BrowserStack](https://browserstack.com) using the major browsers. The following table presents the results. Empty cells signify either test failure or browser absense.

| OS                 | Chrome  | Firefox | Safari    | Opera   | Internet Explorer | Edge    |
|--------------------|---------|---------|-----------|---------|-------------------|---------|
| Android (4.3+)     | ✔       | ✔       |           |         |                   |         |
| iOS (10+)          | ✔       |         | ✔         |         |                   |         |
| Windows            | ✔ (43+) | ✔ (20+) |           | ✔ (30+) | ✔ (10+)           | ✔ (15+) |
| macOS              | ✔ (43+) | ✔ (20+) | ✔ (10.1+) | ✔ (30+) |                   |         |

<br>
<br>

# FireGate.js Great Supporters
[BrowserStack](https://browserstack.com) is used for R&D and testing purposes while developing FireGate.js.
