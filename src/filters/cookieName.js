// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default function (details, expression) {
  return (new RegExp(expression)).test(details.name);
}
