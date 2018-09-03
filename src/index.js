// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import getPropertyAccessors from './functions/getPropertyAccessors';
import setPropertyAccessors from './functions/setPropertyAccessors';
import isCookieAllowedByPolicy from './functions/isCookieAllowedByPolicy';
import isCookiePolicyValid from './functions/isCookiePolicyValid';
import getCookieDetails from './functions/getCookieDetails';
import filters from './filters';

function FireGate() {
  // Holds information about the cookies during the lifetime of this instance.
  const cookieBag = {
    blocked: [],
  };

  // Policy which allows all cookies to be set.
  const permissivePolicy = {
    defaultsTo: 'allow',
  };

  // Policy which allows no cookies to be set.
  const restrictivePolicy = {
    defaultsTo: 'block',
  };

  /**
   * If true then this instance has been attached to the browser accessors and
   * filters cookies.
   */
  let instanceAttached = false;

  /**
   * Make the default policy permissive for all cookies in order to avoid
   * producing undesired third party effects if the script has been attached
   * without a specific policy set.
   */
  let activePolicy = permissivePolicy;

  /**
   * Store references to the original, underlying browser accessor functions for
   * document.cookie.
   */
  let handlers = getPropertyAccessors(Document.prototype, 'cookie');
  if (!(handlers.get && handlers.set)) {
    handlers = getPropertyAccessors(HTMLDocument.prototype, 'cookie');
  }

  /**
   * At this point, the handlers should either have been successfully queried
   * from the browser or not found (for older or non standard browsers). On
   * failure, get and set accessors will be undefined. This is taken into
   * account by the rest of the code.
   */
  const browserCookieGetter = handlers.get;
  const browserCookieSetter = handlers.set;

  /**
   * Queries the browser to return its stored cookie string.
   * @returns {string} The currently set document.cookie string of the browser.
   */
  function getCookieAccessor() {
    return browserCookieGetter.call(document);
  }

  /**
   * Calls the browser to set a new cookie taking into account the policy set.
   * @returns {boolean} True if the cookie was allowed and got set successfully.
   */
  function setCookieAccessor(cookie) {
    // Get structured information about the supplied cookie string.
    const details = getCookieDetails(cookie);

    /**
     * If the cookie supplied by third party code is allowed by the current
     * policy, then call the original browser setter in order to set/allow the
     * cookie. Otherwise, mark the cookie as blocked.
     * Maybe it will be freed later.
     */
    if (isCookieAllowedByPolicy(details, activePolicy, filters)) {
      browserCookieSetter.call(document, cookie);
      return true;
    }

    cookieBag.blocked.push(cookie);
    return false;
  }

  /**
   * Starts filtering according to the current policy. If no policy has been set
   * by the caller, then the default fully permissive policy is in effect.
   * @returns {boolean} True if FireGate.js has been successfully attached.
   */
  function attach() {
    // Check if the script is already attached.
    if (instanceAttached) {
      return false;
    }

    /**
     * If null/undefined then something got wrong when querying the browser for
     * its accessor functions. Most probably the browser does not support this
     * functionality.
     */
    if (!(browserCookieGetter && browserCookieSetter)) {
      return false;
    }

    /**
     * Attaches our browser accessor interceptor functions and starts filtering
     * document.cookie according to the active policy.
     */
    const success = setPropertyAccessors(document, 'cookie', {
      get: getCookieAccessor,
      set: setCookieAccessor,
    });

    /*
     * For some reason we could not set our own accessor functions. Most
     * probably the browser is not supported.
     */
    if (!success) {
      return false;
    }

    // We have made it through here. Everything is OK.
    instanceAttached = true;

    return true;
  }

  /**
   * Stops filtering. All cookies will be allowed from now on.
   * @returns {boolean} True if FireGate.js has been successfully detached.
   */
  function detach() {
    // Check if the script is not yet attached / has been already detached.
    if (!instanceAttached) {
      return false;
    }

    /**
     * Detaches our browser accessor interceptor functions recovering the
     * original browsers accessor functions. That means the script stops
     * filtering document.cookie.
     */
    setPropertyAccessors(document, 'cookie', {
      get: browserCookieGetter,
      set: browserCookieSetter,
    });

    // We set the current state of the script for bookkeeping reasons.
    instanceAttached = false;

    return true;
  }

  /**
   * Sets the currently active policy. If FireGate.js is attached, then the
   * policy immediately takes effect. Otherwise it will take effect when
   * FireGate.js gets attached.
   * @param {(string|object)} policy The name of a builtin policy or a custom one
   * @returns {boolean} True if the policy is valid and got set.
   */
  function setCookiePolicy(policy) {
    if (policy === 'permissive') {
      activePolicy = permissivePolicy;
    } else if (policy === 'restrictive') {
      activePolicy = restrictivePolicy;
    } else if (isCookiePolicyValid(policy, filters)) {
      activePolicy = policy;
    } else {
      return false;
    }
    return true;
  }

  /**
   * Sets browser cookies which previously got blocked because of the policy.
   * May free/set all previously blocked cookies or only those allowed by the
   * currently active policy.
   * @param {boolean} freeAll Whether to set all blocked cookies or not.
   * @returns {Array} The names of the cookies which got freed/set.
   */
  function freeCookies(freeAll) {
    const cookiesFreed = [];
    const newBlockedCookies = [];

    for (let i = 0; i < cookieBag.blocked.length; i += 1) {
      // This is the original blocked cookie string as supplied by another code.
      const cookieString = cookieBag.blocked[i];

      /**
       * Extract information from the cookie string in order to decide if it
       * should be freed, that is, set by the browser.
       */
      const details = getCookieDetails(cookieString);

      /**
       * If the cookie string somehow is invalid, then do nothing regarding
       * this cookie.
       */
      if (details !== null) {
        /**
         * If freeAll is true then all blocked cookies should be set even if not
         * allowed by the currently active policy.
         */
        let permit = freeAll;

        /**
         * If permit is false, then freeAll flag is not set and each blocked
         * cookie must be checked again the active policy in order to be set.
         */
        if (!permit) {
          if (isCookieAllowedByPolicy(details, activePolicy, filters)) {
            permit = true;
          }
        }

        /**
         * Finally, a decision has been taken regarding the current cookie.
         * At this stage, if permit is true, then it's final, the cookie should
         * be set.
         */
        if (permit) {
          browserCookieSetter.call(document, cookieString);
          cookiesFreed.push(details.name);
        } else {
          newBlockedCookies.push(cookieString);
        }
      }
    }

    cookieBag.blocked = newBlockedCookies;

    return cookiesFreed;
  }

  return {
    attach,
    detach,
    setCookiePolicy,
    freeCookies,
  };
}

export default FireGate();
