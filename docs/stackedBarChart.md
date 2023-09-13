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


<br><a name="barChart"></a>

## barChart(settings) ⇒ <code>Array</code>
> Builds a stacked bar chart.
> 
> ```text
>                         Test chart
> Fruit     ╭────────┬─────────┬─────────┬─────────┬─────────╮
>   Oranges ▐███▒▒▒▒▒▒▒▒░░░░░░░░░░░░████████       │         │
>    Apples ▐█████▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░██████████   │
>     Pears ▐███████▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░██████████         │
> Nuts      │        ╵         │         ╵         │         │
>    Almond ▐███▒▒▒▒▒▒▒▒░░░░░░░░░░░░████████       │         │
>    Peanut ▐█████▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░██████████   │
>           ╰────────┴─────────┼─────────┴─────────┼─────────╯
>           0        5        10        15        20        25
> ```

**Returns**: <code>Array</code> - An array of strings, one string per row.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| settings | <code>object</code> |  | Settings object. |
| [settings.title] | <code>string</code> |  | Title of the chart. |
| [settings.width] | <code>number</code> | <code>60</code> | Total width in characters, including y-axis labels. |
| [settings.ascii] | <code>boolean</code> | <code>false</code> | Use only ascii characters. |
| [settings.calc] | <code>string</code> |  | Options are 'min', 'max', 'mean', and 'median'. Only use if data objects have a 'data' property instead of 'value'. |
| [settings.xAxis] | <code>object</code> |  | All x-axis settings are optional. The scale auto adjust to fit the data except where a value is provided here. |
| [settings.xAxis.scale] | <code>object</code> | <code>linear</code> | Options are 'linear' or 'log'. |
| [settings.xAxis.label] | <code>object</code> |  | If provided, an extra row is returned with this label centered under the x-axis labels. |
| [settings.xAxis.start] | <code>number</code> |  | The value on the left side of the chart. |
| [settings.xAxis.end] | <code>number</code> |  | The value on the right side of the chart. |
| [settings.xAxis.tickValue] | <code>number</code> |  | The value between each tick. |
| settings.data | <code>Array.&lt;object&gt;</code> |  | The data for the chart. |
| [settings.data[].data] | <code>Array.&lt;number&gt;</code> |  | Use this or 'value'. If this is used, also provide the 'calc' setting. |
| [settings.data[].value] | <code>number</code> |  | The numeric value. |
| [settings.data[].label] | <code>string</code> |  | A display label. |
| [settings.data[].group] | <code>Array.&lt;string&gt;</code> |  | A group that this datum belongs in. |


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
