# MoonMeet

Moon phase for any date and time: name, percent lit, age, next full and new moon, and every full moon in the year.

Phase times use Meeus, Astronomical Algorithms ch. 49 (mean lunation plus the main periodic corrections). Tests: 19 checks. Meeus example 49.a (new moon, Feb 18 1977, k = -283) within 43 s; new moons Sep 10, Oct 10, Nov 9 2026 and full moons Sep 26, Oct 26 2026 within 10 min of timeanddate.com; phase names, spacing of full moons, lunation length.
Deviations: the series is truncated, Delta-T (about a minute) is ignored, and illumination is approximated as (1 - cos(2 pi f)) / 2 from the position in the actual lunation, so percentages are about plus or minus 2 points. Drawn as seen from the northern hemisphere.

Static client-side. `node test-engine.js` runs the tests.
