// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import CookiePolicy from '../interfaces/CookiePolicy';
import getPropertyAccessors from '../functions/getPropertyAccessors';
import setPropertyAccessors from '../functions/setPropertyAccessors';
import isCookieAllowedByPolicy from '../functions/isCookieAllowedByPolicy';
import getCookieDetails from '../functions/getCookieDetails';
import tests from '../tests';

function cookies() {
  // Holds information about the cookies.
  const cookieBag: { blocked: Array<string> } = {
    blocked: [],
  };

  // Built-in policy which allows all cookies to be set.
  const permissivePolicy: CookiePolicy = {
    defaultsTo: 'allow',
  };

  // Built-in policy which allows no cookies to be set.
  const restrictivePolicy: CookiePolicy = {
    defaultsTo: 'block',
  };

  // True if browser's cookie accessors have been replaced by our own, making filtering possible.
  let cookieFilteringActive = false;

  /**
   * Set the built-in permissive policy as default in order to avoid producing undesired effects to
   * third party code.
   */
  let activePolicy: CookiePolicy = permissivePolicy;

  // References to the original browser accessor functions for document.cookie.
  let handlers = getPropertyAccessors(Document.prototype, 'cookie');
  if (handlers === null) {
    handlers = getPropertyAccessors(HTMLDocument.prototype, 'cookie');
  }

  /**
   * At this point, the handlers should have been successfully queried from the browser. Otherwise,
   * the browser is older or non standard. This is taken into account by the rest of the code.
   */
  const browserCookieGetter = handlers !== null ? handlers.get : null;
  const browserCookieSetter = handlers !== null ? handlers.set : null;

  /**
   * Our own cookie getter function. Queries the browser to return its stored cookie string.
   * @returns The currently stored cookie string of the browser or empty string on failure.
   */
  function getCookieAccessor(): string {
    if (browserCookieGetter !== null) {
      return browserCookieGetter.call(document);
    }
    return '';
  }

  /**
   * Calls the browser to set a new cookie taking into account the policy set.
   * @returns True if the cookie was set.
   */
  function setCookieAccessor(cookie: string): boolean {
    // Get structured information about the supplied cookie string.
    const details = getCookieDetails(cookie);

    // Malformed cookie.
    if (details === null) {
      return false;
    }

    /**
     * If the current policy allows the cookie, then call the original browser setter to set the
     * cookie. Otherwise, mark the cookie as blocked. Maybe it will be freed later.
     */
    if (isCookieAllowedByPolicy(details, activePolicy, tests)) {
      if (browserCookieSetter !== null) {
        browserCookieSetter.call(document, cookie);
        return true;
      }
      return false;
    }

    cookieBag.blocked.push(cookie);
    return false;
  }

  /**
   * Starts filtering according to the current policy. If no policy has been set, then the default
   * fully permissive policy is in effect.
   * @returns {boolean} True on success.
   */
  function startFiltering() {
    // Check if already filtering.
    if (cookieFilteringActive) {
      return false;
    }

    /**
     * If accessors are null, then we could not retrieve browser's cookie accessors, as required for
     * filtering. Most probably the browser does not support this functionality.
     */
    if (!(browserCookieGetter && browserCookieSetter)) {
      return false;
    }

    /**
     * Sets our browser accessor functions and starts filtering document.cookie according to the
     * active policy.
     */
    const success = setPropertyAccessors(document, 'cookie', {
      get: getCookieAccessor,
      set: setCookieAccessor,
    });

    // Setting our own accessor function failed. Most probably the browser does not support this.
    if (!success) {
      return false;
    }

    // We have made it through here. Everything is OK.
    cookieFilteringActive = true;

    return true;
  }

  /**
   * Stops filtering allowing all cookies from now on.
   * @returns {boolean} True on success.
   */
  function stopFiltering() {
    // Are we really filtering cookies right now?
    if (!cookieFilteringActive) {
      return false;
    }

    // Recover the original browser's accessor functions, essentially disabling cookie filtering.
    if (browserCookieGetter && browserCookieSetter) {
      setPropertyAccessors(document, 'cookie', {
        get: browserCookieGetter,
        set: browserCookieSetter,
      });
    }

    cookieFilteringActive = false;

    return true;
  }

  /**
   * Sets the active policy. The policy immediately takes effect if cookie filtering is active.
   * @param policy The name of a built-in policy or a custom one.
   * @returns True on success.
   */
  function setFilteringPolicy(policy: string | CookiePolicy) {
    if (policy === 'permissive') {
      activePolicy = permissivePolicy;
    } else if (policy === 'restrictive') {
      activePolicy = restrictivePolicy;
    } else if (policy.constructor === Object) {
      activePolicy = policy as CookiePolicy;
    } else {
      return false;
    }
    return true;
  }

  /**
   * Sets browser cookies which previously got blocked because of the policy. May free/set all
   * previously blocked cookies or only those allowed by the currently active policy.
   * @param freeAll Whether to set all blocked cookies or not.
   * @returns The names of the cookies which got freed/set.
   */
  function freeCookies(which: 'all' | 'allowed' | string[]): string[] {
    const cookiesFreed = [];
    const newBlockedCookies = [];

    // We are not able to free cookies if we don't have access to browser's cookie setter.
    if (!browserCookieSetter) {
      return [];
    }

    for (let i = 0; i < cookieBag.blocked.length; i += 1) {
      // This is the original blocked cookie string.
      const cookieString = cookieBag.blocked[i];

      // Extract details from the cookie string in order to decide if it should be freed.
      const details = getCookieDetails(cookieString);

      // Prerequisite for a cookie to be freed is to be valid.
      if (details !== null) {
        /**
         * If an array of cookie names has been specified, then check if this cookie's name is
         * contained in the array. If not, the cookie won't be freed. However, the cookie will be
         * freed if the caller has requested freeing all blocked cookies.
         */
        let permit = Array.isArray(which) ? which.indexOf(details.name) > -1 : which === 'all';

        // One last chance to free the cookie if allowed by the active policy.
        if (!permit && which === 'allowed') {
          if (isCookieAllowedByPolicy(details, activePolicy, tests)) {
            permit = true;
          }
        }

        /**
         * Finally, a decision has been taken regarding this cookie. At this stage, if permit is
         * true, then it's final, the cookie should be set.
         */
        if (permit) {
          browserCookieSetter.call(document, cookieString);
          cookiesFreed.push(details.name);
        } else {
          // This cookie did not made it through the active policy. Keep it blocked.
          newBlockedCookies.push(cookieString);
        }
      }
    }

    cookieBag.blocked = newBlockedCookies;

    return cookiesFreed;
  }

  return {
    startFiltering,
    stopFiltering,
    setFilteringPolicy,
    freeCookies,
  };
}

export default cookies;
