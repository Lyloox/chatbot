'use strict';
var assert = require('assert');
var chai = require('chai');
// var should = require('should');
// var expect = require('expect');
// var unexpected = require('unexpected');

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});

