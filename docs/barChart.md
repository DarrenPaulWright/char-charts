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

## barChart([settings]) ⇒ <code>Array</code>
> Builds a bar chart.> > ```text>                Test chart>   ╭──────┬───────┬──────┬───────┬──────╮> A ▐████████████████████████████ ╵77.63 │> B ▐█▌97.00▐███████████████████████████▌│> C ▐███▌  13.00   ╵      ╵       ╵      │> D ┃  0.15╵       ╵      ╵       ╵      │> E ▐▌  2.00       ╵      ╵       ╵      │>   ╰──────┴───────┴──────┴───────┴──────╯>   0     20      40     60      80    100>                     Hz> ```

**Returns**: <code>Array</code> - An array of strings, one string per row.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>Object</code> |  |  |
| [settings.width] | <code>int</code> | <code>40</code> | Total width in characters, including y axis labels |
| [settings.fractionDigits] | <code>int</code> | <code>0</code> | Number of fraction digits to display on inline labels |
| [settings.showInlineLabels] | <code>int</code> | <code>true</code> | Show a value label for each bar |
| [settings.ascii] | <code>boolean</code> | <code>false</code> | Use only ascii characters |
| [settings.calc] | <code>string</code> |  | Options are 'min', 'max', 'mean', and 'median'. Only use if data objects have a 'data' property instead of 'value'. |
| [settings._xAxis] | <code>Object</code> |  | All x axis settings are optional. The scale auto adjust to fit the data except where a value is provided here. |
| [settings._xAxis.scale] | <code>Object</code> | <code>linear</code> | options are 'linear' or 'log' |
| [settings._xAxis.label] | <code>Object</code> |  | If provided, an extra row is returned with this label centered under the x axis labels |
| [settings._xAxis.start] | <code>Number</code> |  | The value on the left side of the chart |
| [settings._xAxis.end] | <code>Number</code> |  | The value on the right side of the chart |
| [settings._xAxis.tickValue] | <code>Number</code> |  | The value between each tick |
| [settings.data] | <code>Array.&lt;Object&gt;</code> |  |  |
| [settings.data[].data] | <code>Array.&lt;Number&gt;</code> |  | Use this or 'value'. If this is used, also provide the 'calc' setting. |
| [settings.data[].value] | <code>Number</code> |  |  |
| [settings.data[].label] | <code>String</code> |  |  |
| [settings.data[].group] | <code>Array.&lt;String&gt;</code> |  |  |


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
