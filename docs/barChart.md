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

## barChart(settings) ⇒ <code>Array.&lt;string&gt;</code>
> Builds a bar chart.
> 
> ```text
>                         Test chart
> Fruit      ┌───────┬───────┬───────┬───────┬───────┬───────┐
>    Oranges ▐       ╵       ╵       ╵       ╵       │       │
>     Apples ▐███▌   ╵       ╵       ╵       ╵       │       │
>      Pears ▐███████╵       ╵       ╵       ╵       │       │
>   Apricots ▐████████████████████▌  ╵       ╵       │       │
>    Peaches ▐███████████████████████████████████████████████▌
> Nuts       │       ╵       ╵       ╵       ╵       │       │
>     Almond ▐▌      ╵       ╵       ╵       ╵       │       │
>     Peanut ▐       ╵       ╵       ╵       ╵       │       │
>      Pecan │       ╵       ╵       ╵       ╵       │       │
>            └───────┴───────┴───────┴───────┴───────┼───────┘
>            0      20      40      60      80      100    120
>                              Satisfaction
> ```

**Returns**: <code>Array.&lt;string&gt;</code> - An array of strings, one string per row.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| settings | <code>object</code> |  | Settings object. |
| [settings.title] | <code>string</code> |  | Title of the chart. |
| settings.data | <code>Array.&lt;object&gt;</code> |  | The data to display. |
| [settings.data[].value] | <code>Array.&lt;number&gt;</code> |  | Use this or 'data'. If this is used, also provide the 'calc' setting. |
| [settings.data[].data] | <code>Array.&lt;number&gt;</code> |  | Use this or 'value'. If this is used, also provide the 'calc' setting. |
| [settings.data[].label] | <code>string</code> |  | A display label. |
| [settings.data[].group] | <code>Array.&lt;string&gt;</code> |  | A group or groups that this datum belongs in. |
| [settings.xAxis] | <code>object</code> |  | All x-axis settings are optional. The scale auto adjust to fit the data except where a value is provided here. |
| [settings.xAxis.scale] | <code>&#x27;linear&#x27;</code>, <code>&#x27;log&#x27;</code> | <code>linear</code> | Options are 'linear' or 'log'. |
| [settings.xAxis.label] | <code>string</code> |  | If provided, an extra row is returned with this label centered under the x-axis labels. |
| [settings.xAxis.start] | <code>number</code> |  | The value on the left side of the chart. |
| [settings.xAxis.end] | <code>number</code> |  | The value on the right side of the chart. |
| [settings.xAxis.tickValue] | <code>number</code> |  | The value between each tick. |
| [settings.render] | <code>object</code> |  | Settings that effect the rendered look and feel. |
| [settings.render.width] | <code>number</code> | <code>60</code> | Total width in characters, including y-axis labels. |
| [settings.render.fractionDigits] | <code>number</code> | <code>0</code> | Number of fraction digits to display on inline labels. |
| [settings.render.showInlineLabels] | <code>boolean</code> | <code>false</code> | Show a median label for each box. While labels try to fit in unused spaces, extra rows may be added if necessary. |
| [settings.render.style] | <code>string</code> | <code>&quot;&#x27;rounded&#x27;&quot;</code> | The style of characters used to generate the chart. Options are 'rounded', 'squared', 'doubled', or 'ascii'. |
| [settings.render.colors] | <code>string</code> | <code>&quot;&#x27;bright&#x27;&quot;</code> | Color palette to use. Options are 'none', 'bright', 'dim', 'cool', 'passFail', 'blue', 'green', 'magenta', 'yellow', 'cyan', or 'red'. |
| [settings.render.extraRowSpacing] | <code>boolean</code> | <code>false</code> | Add an extra row between each data row. |
| [settings.render.sortLabels] | <code>&#x27;asc&#x27;</code>, <code>&#x27;desc&#x27;</code> |  | Sort the data by label. |


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
