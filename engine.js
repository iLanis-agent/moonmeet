(function (root) {
  'use strict';
  var D2R = Math.PI / 180;
  // Meeus, Astronomical Algorithms ch. 49: time of mean + corrected new (half=0) and full (half=0.5) moons, as Julian Ephemeris Day. k is an integer for new moon, +0.5 for full.
  function phaseJDE(k) {
    var T = k / 1236.85, half = Math.abs(k - Math.round(k)) > 0.25;
    var jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T - 0.000000150 * T * T * T + 0.00000000073 * T * T * T * T;
    var E = 1 - 0.002516 * T - 0.0000074 * T * T;
    var M = (2.5534 + 29.10535670 * k - 0.0000014 * T * T) * D2R, Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T * T) * D2R, F = (160.7108 + 390.67050284 * k - 0.0016118 * T * T) * D2R;
    var c = half
      ? -0.40614 * Math.sin(Mp) + 0.17302 * E * Math.sin(M) + 0.01614 * Math.sin(2 * Mp) + 0.01043 * Math.sin(2 * F) + 0.00734 * E * Math.sin(Mp - M) - 0.00515 * E * Math.sin(Mp + M) + 0.00209 * E * E * Math.sin(2 * M)
      : -0.40720 * Math.sin(Mp) + 0.17241 * E * Math.sin(M) + 0.01608 * Math.sin(2 * Mp) + 0.01039 * Math.sin(2 * F) + 0.00739 * E * Math.sin(Mp - M) - 0.00514 * E * Math.sin(Mp + M) + 0.00208 * E * E * Math.sin(2 * M);
    return jde + c;
  }
  var UNIX_JD = 2440587.5;
  function toJD(ms) { return ms / 86400000 + UNIX_JD; }
  function toMs(jd) { return (jd - UNIX_JD) * 86400000; }
  // Treat JDE as UT: the Delta-T gap (about 69 s today) is ignored.
  function newMoonMs(k) { return toMs(phaseJDE(k)); }
  function fullMoonMs(k) { return toMs(phaseJDE(k + 0.5)); }
  function kFor(ms) { return Math.floor((toJD(ms) - 2451550.09766) / 29.530588861); }
  // The new moon at or before ms (index k) and the next one
  function cycleAt(ms) { var k = kFor(ms) + 1; while (newMoonMs(k) > ms) k--; while (newMoonMs(k + 1) <= ms) k++; return { k: k, start: newMoonMs(k), end: newMoonMs(k + 1), full: fullMoonMs(k) }; }
  function nameOf(f) {
    if (f < 0.03 || f >= 0.97) return 'New Moon'; if (f < 0.22) return 'Waxing Crescent'; if (f < 0.28) return 'First Quarter'; if (f < 0.47) return 'Waxing Gibbous';
    if (f < 0.53) return 'Full Moon'; if (f < 0.72) return 'Waning Gibbous'; if (f < 0.78) return 'Last Quarter'; return 'Waning Crescent';
  }
  // phase fraction 0..1 through the actual (not mean) lunation; illumination approximated as (1 - cos(2 pi f)) / 2
  function phaseAt(ms) {
    var c = cycleAt(ms), f = (ms - c.start) / (c.end - c.start);
    var nextFull = c.full > ms ? c.full : fullMoonMs(c.k + 1), nextNew = c.end;
    return { fraction: f, ageDays: (ms - c.start) / 86400000, illum: (1 - Math.cos(2 * Math.PI * f)) / 2, name: nameOf(f), nextFull: nextFull, nextNew: nextNew, prevNew: c.start };
  }
  // All full moons within a UTC calendar year
  function fullMoonsIn(y) {
    var a = Date.UTC(y, 0, 1), b = Date.UTC(y + 1, 0, 1), k = kFor(a) - 1, out = [], t;
    for (; (t = fullMoonMs(k)) < b; k++) if (t >= a) out.push(t);
    return out;
  }
  var api = { phaseJDE: phaseJDE, newMoonMs: newMoonMs, fullMoonMs: fullMoonMs, phaseAt: phaseAt, nameOf: nameOf, fullMoonsIn: fullMoonsIn, toJD: toJD };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Moon = api;
})(typeof window !== 'undefined' ? window : this);
