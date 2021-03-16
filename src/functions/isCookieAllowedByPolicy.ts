// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import CookieDetails from '../interfaces/CookieDetails';
import CookiePolicy from '../interfaces/CookiePolicy';
import CookieTestDictionary from '../interfaces/CookieTestDictionary';

/**
 * Returns whether a cookie is allowed by the supplied policy.
 * @param details A cookie's details object to test against the supplied policy.
 * @param policy The policy object to check the cookie's details against.
 * @param tests A function dictionary of all supported tests.
 * @returns {boolean} True if the cookie is allowed by the supplied policy.
 */
function isCookieAllowedByPolicy(
  this: unknown,
  details: CookieDetails,
  policy: CookiePolicy,
  tests: CookieTestDictionary,
): boolean {
  // Set the default decision according to the default action of the policy.
  let allow = policy.defaultsTo === 'allow';

  const { rules } = policy;

  /**
   * If the policy contains rules, then the default action may get overwritten according to the
   * first rule that matched.
   */
  if (rules) {
    for (let i = 0; i < rules.length; i += 1) {
      const rule = rules[i];
      let matches = false;

      // Apply each required test. The rule matches if all conditions (tests) are satified.
      const testKeys = Object.keys(rule.when);
      for (let z = 0; z < testKeys.length; z += 1) {
        const testName = testKeys[z];
        const testRegex = rule.when[testName];

        matches = tests[testName].apply(this, [details, testRegex]);
        if (!matches) {
          break;
        }
      }

      // The rule matched. Overwrite the default decision of the policy and early exit.
      if (matches) {
        allow = rule.action === 'allow';
        break;
      }
    }
  }

  // The final decision has been made.
  return allow;
}

export default isCookieAllowedByPolicy;
