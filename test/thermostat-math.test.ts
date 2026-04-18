import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

// Inline copies of the helpers from thermostat.ts so we can test the math
// without needing to mock all of homebridge. Keep these in sync.
const fToC = (f: number) => ((f - 32) * 5) / 9;
const cToF = (c: number) => (c * 9) / 5 + 32;

describe('Temperature conversion', () => {
  it('fToC produces known reference points', () => {
    assert.equal(fToC(32), 0);
    assert.equal(fToC(212), 100);
    assert.equal(Math.round(fToC(72) * 10) / 10, 22.2);
  });

  it('cToF produces known reference points', () => {
    assert.equal(cToF(0), 32);
    assert.equal(cToF(100), 212);
    assert.equal(Math.round(cToF(20)), 68);
  });

  it('fToC and cToF are inverses', () => {
    for (const f of [0, 32, 50, 68, 72, 100, 212]) {
      const round = cToF(fToC(f));
      assert.ok(
        Math.abs(round - f) < 1e-9,
        `roundtrip drift for ${f}°F: got ${round}`
      );
    }
  });

  it('produces sensible HomeKit Celsius for typical thermostat values', () => {
    // SmartRent thermostats commonly report 65-80°F
    assert.ok(fToC(70) > 20 && fToC(70) < 22);
    assert.ok(fToC(75) > 23 && fToC(75) < 24);
  });
});
