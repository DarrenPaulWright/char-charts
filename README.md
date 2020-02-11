# Char Charts

[![Greenkeeper badge](https://badges.greenkeeper.io/DarrenPaulWright/char-charts.svg)](https://greenkeeper.io/)

> ES6 character based charting library
>
> [![npm][npm]][npm-url]
[![build][build]][build-url]
[![coverage][coverage]][coverage-url]
[![deps][deps]][deps-url]
[![size][size]][size-url]
[![vulnerabilities][vulnerabilities]][vulnerabilities-url]
[![license][license]][license-url]

<br><a name="Installation"></a>

## Installation
```
npm install char-charts
```
* _If using Babel, requires Babel 7.2+_

<br><a name="About"></a>

## About
Seems to work well with the font Consolas. I haven&#x27;t tried many others yet.


<br>

## Functions

<dl>
<dt><a href="docs/barChart.md">barChart([settings])</a> ⇒ <code>Array</code></dt>
<dd><p>Builds a bar chart.</p>
<pre><code class="language-text">               Test chart
  ╭──────┬───────┬──────┬───────┬──────╮
A ▐████████████████████████████ ╵77.63 │
B ▐█▌97.00▐███████████████████████████▌│
C ▐███▌  13.00   ╵      ╵       ╵      │
D ┃  0.15╵       ╵      ╵       ╵      │
E ▐▌  2.00       ╵      ╵       ╵      │
  ╰──────┴───────┴──────┴───────┴──────╯
  0     20      40     60      80    100
                    Hz</code></pre>
</dd>
<dt><a href="docs/boxChart.md">boxChart([settings])</a> ⇒ <code>Array</code></dt>
<dd><p>Builds a box and whisker chart.</p>
<pre><code class="language-text">               Test chart
  ╭──────┬───────┬──────┬───────┬──────╮
A │      ·       ╵  ┣━━━━━━━▒▒▒▒▒▒▒▒▓━┫│
B │    ╭─ M: 13.00      ╵M: 90.00 ─╯  ▒▓
C ┣━▒▒▒▓▓▓━┫     ╵      ╵   M: 97.00 ─╯│
D ▒ ── M: 0.15   ╵      ╵       ╵      │
E ┃ ── M: 2.00   ╵      ╵       ╵      │
  ╰──────┴───────┴──────┴───────┴──────╯
  0     20      40     60      80    100
                    Hz</code></pre>
</dd>
</dl>

[npm]: https://img.shields.io/npm/v/char-charts.svg
[npm-url]: https://npmjs.com/package/char-charts
[build]: https://travis-ci.org/DarrenPaulWright/char-charts.svg?branch&#x3D;master
[build-url]: https://travis-ci.org/DarrenPaulWright/char-charts
[coverage]: https://coveralls.io/repos/github/DarrenPaulWright/char-charts/badge.svg?branch&#x3D;master
[coverage-url]: https://coveralls.io/github/DarrenPaulWright/char-charts?branch&#x3D;master
[deps]: https://david-dm.org/darrenpaulwright/char-charts.svg
[deps-url]: https://david-dm.org/darrenpaulwright/char-charts
[size]: https://packagephobia.now.sh/badge?p&#x3D;char-charts
[size-url]: https://packagephobia.now.sh/result?p&#x3D;char-charts
[vulnerabilities]: https://snyk.io/test/github/DarrenPaulWright/char-charts/badge.svg?targetFile&#x3D;package.json
[vulnerabilities-url]: https://snyk.io/test/github/DarrenPaulWright/char-charts?targetFile&#x3D;package.json
[license]: https://img.shields.io/github/license/DarrenPaulWright/char-charts.svg
[license-url]: https://npmjs.com/package/char-charts/LICENSE.md
