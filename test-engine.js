var E = require('./engine.js'), n = 0, bad = 0;
function near(a, b, tol, m) { n++; if (!(Math.abs(a - b) <= tol)) { bad++; console.log('FAIL', m, a, b); } }
function is(a, b, m) { n++; if (a !== b) { bad++; console.log('FAIL', m, a, b); } }
var MIN = 60000;
// Meeus example 49.a: new moon k = -283 is 1977 Feb 18 03:37:42 TD (JDE 2443192.65118)
near(E.phaseJDE(-283), 2443192.65118, 0.0005, 'Meeus 1977 new moon (truncated periodic terms, within 43 s)');
// Meeus example 49.b: full moon k = -144.5? (k = 544.5 case not used); use timeanddate.com 2026 (New York local converted to UTC)
function utc(y, mo, d, h, mi, off) { return Date.UTC(y, mo - 1, d, h + off, mi); }
// New moons: Sep 10 2026 11:27 pm EDT, Oct 10 11:50 am EDT, Nov 9 2:02 am EST; Full moons: Sep 26 12:49 pm EDT, Oct 26 12:11 am EDT
function nearestNew(ms) { var k = Math.round((E.toJD(ms) - 2451550.09766) / 29.530588861); return E.newMoonMs(k); }
function nearestFull(ms) { var k = Math.round((E.toJD(ms) - 2451550.09766) / 29.530588861 - 0.5); return E.fullMoonMs(k); }
near(nearestNew(utc(2026, 9, 10, 23, 27, 4)), utc(2026, 9, 10, 23, 27, 4), 10 * MIN, 'new Sep 10');
near(nearestNew(utc(2026, 10, 10, 11, 50, 4)), utc(2026, 10, 10, 11, 50, 4), 10 * MIN, 'new Oct 10');
near(nearestNew(utc(2026, 11, 9, 2, 2, 5)), utc(2026, 11, 9, 2, 2, 5), 10 * MIN, 'new Nov 9');
near(nearestFull(utc(2026, 9, 26, 12, 49, 4)), utc(2026, 9, 26, 12, 49, 4), 10 * MIN, 'full Sep 26');
near(nearestFull(utc(2026, 10, 26, 0, 11, 4)), utc(2026, 10, 26, 0, 11, 4), 10 * MIN, 'full Oct 26');
// phase names and illumination at known moments
var p = E.phaseAt(utc(2026, 10, 26, 0, 11, 4)); near(p.illum, 1, 0.01, 'full illum'); is(p.name, 'Full Moon', 'full name');
p = E.phaseAt(utc(2026, 10, 10, 11, 50, 4) + 60 * MIN); is(p.name, 'New Moon', 'new name'); near(p.illum, 0, 0.01, 'new illum');
p = E.phaseAt(utc(2026, 10, 3, 9, 25, 4)); near(p.illum, 0.5, 0.08, 'last quarter illum'); is(p.name, 'Last Quarter', 'LQ name');
p = E.phaseAt(utc(2026, 9, 30, 7, 24, 3)); is(p.name, 'Waning Gibbous', 'Sep 30 name'); near(p.ageDays, 19.7, 1, 'age Sep 30');
// next full from Oct 2 is Oct 26
near(E.phaseAt(utc(2026, 10, 2, 7, 24, 3)).nextFull, utc(2026, 10, 26, 0, 11, 4), 10 * MIN, 'next full');
// lunation lengths vary between about 29.27 and 29.83 days (timeanddate shows 29d 12h to 29d 18h in 2026)
var q = E.phaseAt(utc(2026, 10, 2, 7, 24, 3)); var len = (q.nextNew - q.prevNew) / 86400000; near(len, 29.5, 0.4, 'lunation length');
// 12 or 13 full moons in a year
var fm = E.fullMoonsIn(2026).length; is(fm === 12 || fm === 13, true, 'full moons in 2026'); is(E.fullMoonsIn(2028).length >= 12, true, '2028');
// Full moons are ordered and about 29.5 days apart
var f = E.fullMoonsIn(2026), ok = true; for (var i = 1; i < f.length; i++) { var d = (f[i] - f[i - 1]) / 86400000; if (d < 29.2 || d > 29.9) ok = false; } is(ok, true, 'spacing');
console.log((n - bad) + '/' + n + ' passed'); process.exit(bad ? 1 : 0);
