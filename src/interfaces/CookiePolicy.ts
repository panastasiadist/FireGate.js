// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { CookiePolicyRuleAction } from '../types';
import CookiePolicyRule from './CookiePolicyRule';

/**
 * Describes an object which sets out the way cookies should be handled based on their details.
 */
interface CookiePolicy {
  /**
   * The default action to apply to a cookie when it does not match any rule in the policy, or when
   * there are no rules specified.
   */
  defaultsTo: CookiePolicyRuleAction;

  /**
   * Array of rules declaring an action to apply on cookies when their conditions are met.
   */
  rules?: Array<CookiePolicyRule>;
}

export default CookiePolicy;
