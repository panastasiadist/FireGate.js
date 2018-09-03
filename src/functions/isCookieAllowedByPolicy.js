// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Checks if a cookie specified by its name is allowed by the supplied policy.
 * @param {object} policy The policy object to check against.
 * @param {string} cookieName The name of the cookie to check.
 * @returns {boolean} True if the cookie is allowed by the supplied policy.
 */
function isCookieAllowedByPolicy(details, policy, filters) {
  /**
   * Set the default of the policy to be returned if no detailed rules are
   * specified or no rule is being matched for this examined cookie.
   */
  let allow = policy.defaultsTo === 'allow';

  const { rules } = policy;

  /**
   * If rules have been specified, examine them. The first rule to be matched
   * for the cookie results to its action (allow / block) to be set effectively
   * overwriting the default of the policy already chosen.
   */
  if (rules) {
    for (let i = 0; i < rules.length; i += 1) {
      const rule = rules[i];
      let matches = false;

      /**
       * Apply each filter function according to the filters specified for the
       * this specific rule. All filters/conditions should be met for the rule
       * to be matched and its action to be taken.
       */
      const filterKeys = Object.keys(rule.when);
      for (let z = 0; z < filterKeys.length; z += 1) {
        const filter = filterKeys[z];
        const condition = rule.when[filter];
        matches = filters[filter].apply(this, [details, condition]);
        if (!matches) {
          break;
        }
      }

      /**
       * Apply the action of the rule overwriting the default action of the
       * policy only if got through here matching all conditions of the rule.
       * In addition, because the rule matched, we stop here not examining
       * further rule. The first rule to which a cookie is matched is enough
       * to decide to the action that must be taken. If the rule is not matched,
       * continue examining the rest of the rules specified for the policy.
       */
      if (matches) {
        allow = rule.action === 'allow';
        break;
      }
    }
  }

  /**
   * By now, a final decision will have been taken regarding if the cookie must
   * be allowed or not.
   */
  return allow;
}

export default isCookieAllowedByPolicy;
