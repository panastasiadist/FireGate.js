// Copyright (c) 2021 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import setPropertyAccessors from '../../src/functions/setPropertyAccessors';

test("should return 'test1' when accessing propertyA", () => {
  const object = {
    propertyA: '',
  };

  const accessors = {
    get: () => 'test1',
    set: () => { },
  };

  setPropertyAccessors(object, 'propertyA', accessors);

  expect(object.propertyA).toEqual('test1');
});

test("should return 'test2' when accessing propertyA", () => {
  const object = {
    propertyA: '',
  };

  let storage = '';

  const accessors = {
    get: () => storage,
    set: (val: string) => { storage = val; },
  };

  setPropertyAccessors(object, 'propertyA', accessors);

  object.propertyA = 'test2';

  expect(object.propertyA).toEqual('test2');
});
