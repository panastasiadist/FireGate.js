// Copyright (c) 2018 Panagiotis Anastasiadis
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import setPropertyAccessors from '../../src/functions/setPropertyAccessors';

test("should return 'test1' when accessing propertyA", () => {
  var object = {
    propertyA: '',
  };

  var accessors = {
    get: function() {
      return 'test1';
    },
    set: function(val) {}
  };

  setPropertyAccessors(object, 'propertyA', accessors);

  expect(object.propertyA).toEqual('test1');
});

test("should return 'test2' when accessing propertyA", () => {
  var object = {
    propertyA: '',
  };

  var storage = '';

  var accessors = {
    get: function() { 
      return storage;
    },
    set: function(val) {
      storage = val;
    }
  };

  setPropertyAccessors(object, 'propertyA', accessors);

  object.propertyA = 'test2';

  expect(object.propertyA).toEqual('test2');
});