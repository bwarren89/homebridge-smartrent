import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { StateCache } from '../src/lib/cache.js';

const sampleAttrs = [
  { name: 'locked', state: 'true' },
  { name: 'battery_level', state: '85' },
];

describe('StateCache', () => {
  it('returns null for unknown keys', () => {
    const cache = new StateCache();
    assert.equal(cache.get('hub1', 'dev1'), null);
  });

  it('stores and retrieves attributes', () => {
    const cache = new StateCache();
    cache.set('hub1', 'dev1', sampleAttrs);
    assert.deepEqual(cache.get('hub1', 'dev1'), sampleAttrs);
  });

  it('expires entries after TTL', async () => {
    const cache = new StateCache(50); // 50ms TTL
    cache.set('hub1', 'dev1', sampleAttrs);
    assert.deepEqual(cache.get('hub1', 'dev1'), sampleAttrs);
    await new Promise(r => setTimeout(r, 80));
    assert.equal(cache.get('hub1', 'dev1'), null);
  });

  it('isolates entries by hub:device key', () => {
    const cache = new StateCache();
    cache.set('hub1', 'dev1', sampleAttrs);
    assert.equal(cache.get('hub1', 'dev2'), null);
    assert.equal(cache.get('hub2', 'dev1'), null);
  });

  it('invalidate removes a single entry', () => {
    const cache = new StateCache();
    cache.set('hub1', 'dev1', sampleAttrs);
    cache.set('hub1', 'dev2', sampleAttrs);
    cache.invalidate('hub1', 'dev1');
    assert.equal(cache.get('hub1', 'dev1'), null);
    assert.deepEqual(cache.get('hub1', 'dev2'), sampleAttrs);
  });

  it('clear removes all entries', () => {
    const cache = new StateCache();
    cache.set('hub1', 'dev1', sampleAttrs);
    cache.set('hub2', 'dev2', sampleAttrs);
    cache.clear();
    assert.equal(cache.get('hub1', 'dev1'), null);
    assert.equal(cache.get('hub2', 'dev2'), null);
  });
});
