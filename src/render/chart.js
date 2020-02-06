import chalk from 'chalk';
import { ASCII, COLOR, MONOCHROME } from './chars.js';
import processData from './processData.js';

export default (settings, Row) => {
	let chart = [];

	if (settings.useColor === undefined) {
		settings.useColor = chalk.supportsColor;
	}

	settings.CHARS = settings.ascii ? ASCII : settings.useColor ? COLOR : MONOCHROME;

	processData(settings);
	const row = new Row(settings);

	if (settings.title) {
		chart.push(row.title());
	}

	chart.push(row.top());

	settings.yAxis.domain().forEach((value, index) => {
		if (!settings.yAxis.scale().isGrouped() || index !== 0) {
			chart = chart.concat(row.render(value));
		}
	});

	chart.push(row.bottom());
	chart.push(row.bottomLabels());

	if (settings.xAxis.label()) {
		chart.push(row.xAxisLabel());
	}

	return chart;
};
