// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { CookiePolicyRuleAction } from '../types';

/**
 * Describes an object declaring an action to apply on a cookie when conditions are met.
 */
interface CookiePolicyRule {
  /**
   * The action to apply to a cookie when passing at least one test specified in 'when'.
   */
  action: CookiePolicyRuleAction;

  /**
   * Tests to apply on a cookie to decide if the action should be applied to it.
   * Shaped as a dictionary-like object:
   * - Key is the name of a test to apply to a cookie.
   * - Value is a regular expression against which a cookie's details will be tested.
   */
  when: Record<string, string>;
}

export default CookiePolicyRule;
