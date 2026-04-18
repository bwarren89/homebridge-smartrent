import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  attrToBoolean,
  attrToNumber,
  findBoolean,
  findNumber,
  findString,
  findStateByName,
} from '../src/lib/utils.js';

describe('attrToBoolean', () => {
  it('handles native booleans', () => {
    assert.equal(attrToBoolean(true), true);
    assert.equal(attrToBoolean(false), false);
  });

  it('handles string "true"/"false" (the upstream lock bug)', () => {
    assert.equal(attrToBoolean('true'), true);
    assert.equal(attrToBoolean('false'), false);
    // Crucially: Boolean('false') === true, which broke lock state parsing.
    assert.notEqual(attrToBoolean('false'), Boolean('false'));
  });

  it('handles other common encodings', () => {
    assert.equal(attrToBoolean('on'), true);
    assert.equal(attrToBoolean('off'), false);
    assert.equal(attrToBoolean('1'), true);
    assert.equal(attrToBoolean('0'), false);
    assert.equal(attrToBoolean('TRUE'), true);
    assert.equal(attrToBoolean('  True  '), true);
  });

  it('handles numbers', () => {
    assert.equal(attrToBoolean(1), true);
    assert.equal(attrToBoolean(0), false);
    assert.equal(attrToBoolean(42), true);
  });

  it('treats null/unknown as false', () => {
    assert.equal(attrToBoolean(null), false);
    assert.equal(attrToBoolean('garbage'), false);
  });
});

describe('attrToNumber', () => {
  it('parses numeric strings', () => {
    assert.equal(attrToNumber('72'), 72);
    assert.equal(attrToNumber('72.5'), 72.5);
  });

  it('returns fallback for non-numeric', () => {
    assert.equal(attrToNumber('NaN', 99), 99);
    assert.equal(attrToNumber(null, 50), 50);
    assert.equal(attrToNumber('hello', 0), 0);
  });

  it('coerces booleans', () => {
    assert.equal(attrToNumber(true), 1);
    assert.equal(attrToNumber(false), 0);
  });
});

describe('find* helpers', () => {
  const attrs = [
    { name: 'locked', state: 'true' },
    { name: 'battery_level', state: '85' },
    { name: 'mode', state: 'cool' },
    { name: 'on', state: false },
  ];

  it('findBoolean parses string booleans correctly', () => {
    assert.equal(findBoolean(attrs, 'locked'), true);
    assert.equal(findBoolean(attrs, 'on'), false);
    assert.equal(findBoolean(attrs, 'missing'), false);
  });

  it('findNumber parses string numbers', () => {
    assert.equal(findNumber(attrs, 'battery_level'), 85);
    assert.equal(findNumber(attrs, 'missing', 100), 100);
  });

  it('findString returns string or null', () => {
    assert.equal(findString(attrs, 'mode'), 'cool');
    assert.equal(findString(attrs, 'missing'), null);
  });

  it('findStateByName returns raw value or null', () => {
    assert.equal(findStateByName(attrs, 'locked'), 'true');
    assert.equal(findStateByName(attrs, 'missing'), null);
  });
});
