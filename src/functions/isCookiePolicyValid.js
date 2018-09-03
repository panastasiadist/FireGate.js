// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Checks if the supplied policy object has valid structure and options.
 * @param {object} policy The policy object to check.
 * @returns {boolean} True if the policy object is valid.
 */
function isCookiePolicyValid(policy, filters) {
  if (policy == null) {
    return false;
  }

  if (['allow', 'block'].indexOf(policy.defaultsTo) < 0) {
    return false;
  }

  const { rules } = policy;

  // Specific rules may have or may have not been specified for the policy.
  if (rules) {
    /**
     * If rules are specified then the property must be an array containing
     * the action to take when various conditions are met.
     */
    if (rules.constructor !== Array) {
      return false;
    }

    for (let i = 0; i < rules.length; i += 1) {
      // Get a reference to the rule for easy examination in the next steps.
      const rule = rules[i];

      /**
       * A rule must always contain the action to take (allow / block) when the
       * conditions are satisfied.
       */
      if (['allow', 'block'].indexOf(rule.action) < 0) {
        return false;
      }

      /**
       * A rule must always contain the conditions to be checked in order to
       * take apply the defined action.
       */
      if (!(rule.when && rule.when.constructor === Object)) {
        return false;
      }

      let filtersFound = false;

      const filterKeys = Object.keys(rule.when);
      for (let z = 0; z < filterKeys.length; z += 1) {
        filtersFound = true;
        // A filter must exist in the registered filters.
        if (!filters[filterKeys[z]]) {
          return false;
        }
      }

      if (!filtersFound) {
        return false;
      }
    }
  }

  return true;
}

export default isCookiePolicyValid;
