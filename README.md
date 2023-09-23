# Char Charts

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


<br>

## Functions

<dl>
<dt><a href="docs/barChart.md">barChart(settings)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Builds a bar chart.</p>
<pre><code class="language-text">                        Test chart
Fruit      ┌───────┬───────┬───────┬───────┬───────┬───────┐
   Oranges ▐       ╵       ╵       ╵       ╵       │       │
    Apples ▐███▌   ╵       ╵       ╵       ╵       │       │
     Pears ▐███████╵       ╵       ╵       ╵       │       │
  Apricots ▐████████████████████▌  ╵       ╵       │       │
   Peaches ▐███████████████████████████████████████████████▌
Nuts       │       ╵       ╵       ╵       ╵       │       │
    Almond ▐▌      ╵       ╵       ╵       ╵       │       │
    Peanut ▐       ╵       ╵       ╵       ╵       │       │
     Pecan │       ╵       ╵       ╵       ╵       │       │
           └───────┴───────┴───────┴───────┴───────┼───────┘
           0      20      40      60      80      100    120
                             Satisfaction
</code></pre>
</dd>
<dt><a href="docs/boxChart.md">boxChart(settings)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Builds a box and whisker chart.</p>
<pre><code class="language-text">String   ╭─────────┬─────────┬─────────┬─────────┬─────────╮
         │         ·         ╵    •    ╵         ╵    ●• · │
  concat │         ·         ╵    ┣━━━━━━━━━░░░░░░░░░░▓▓━┫ │
         │         ╵         ╵         ╵  Mdn: 90.00 ─╯ ····
  length │         ╵         ╵         ╵         ╵      ┣░▓┫
Array    │      ╭─ Mdn: 13.00╵         ╵      Mdn: 98.00 ─╯│
         │·    ·   ╵ ·       ╵         ╵         ╵         │
    push │┣━░░░░▓▓▓━━┫       ╵         ╵         ╵         │
         •         ╵         ╵         ╵         ╵         │
  concat ░ ── Mdn: 0.15      ╵         ╵         ╵         │
         │·        ╵         ╵         ╵         ╵         │
   shift │┃ ── Mdn: 2.00     ╵         ╵         ╵         │
         ╰─────────┴─────────┴─────────┴─────────┴─────────╯
         0        20        40        60        80       100
                                Ops/s
</code></pre>
</dd>
<dt><a href="docs/stackedBarChart.md">stackedBarChart(settings)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Builds a stacked bar chart.</p>
<pre><code class="language-text">                        Test chart
Fruit     ╭────────┬─────────┬─────────┬─────────┬─────────╮
  Oranges ████▒▒▒▒▒▒▒▒░░░░░░░░░░░░████████       │         │
   Apples ██████▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░██████████   │
    Pears ████████▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░██████████         │
Nuts      │        ╵         │         ╵         │         │
   Almond ████▒▒▒▒▒▒▒▒░░░░░░░░░░░░████████       │         │
   Peanut ██████▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░██████████   │
          ╰────────┴─────────┼─────────┴─────────┼─────────╯
          0        5        10        15        20        25
</code></pre>
</dd>
</dl>

[npm]: https://img.shields.io/npm/v/char-charts.svg
[npm-url]: https://npmjs.com/package/char-charts
[build]: https://travis-ci.org/DarrenPaulWright/char-charts.svg?branch&#x3D;master
[build-url]: https://travis-ci.org/DarrenPaulWright/char-charts
[coverage]: https://coveralls.io/repos/github/DarrenPaulWright/char-charts/badge.svg?branch&#x3D;master
[coverage-url]: https://coveralls.io/github/DarrenPaulWright/char-charts?branch&#x3D;master
[deps]: https://david-dm.org/DarrenPaulWright/char-charts.svg
[deps-url]: https://david-dm.org/DarrenPaulWright/char-charts
[size]: https://packagephobia.now.sh/badge?p&#x3D;char-charts
[size-url]: https://packagephobia.now.sh/result?p&#x3D;char-charts
[vulnerabilities]: https://snyk.io/test/github/DarrenPaulWright/char-charts/badge.svg?targetFile&#x3D;package.json
[vulnerabilities-url]: https://snyk.io/test/github/DarrenPaulWright/char-charts?targetFile&#x3D;package.json
[license]: https://img.shields.io/github/license/DarrenPaulWright/char-charts.svg
[license-url]: https://npmjs.com/package/char-charts/LICENSE.md
