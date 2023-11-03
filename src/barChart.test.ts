import { assert, it } from 'hippogriff';
import { superimpose } from 'object-agent';
import { barChart } from '../index.js';
import type { ISettings } from './types';

const defaultSettings: ISettings = {
	render: {
		width: 40,
		colors: 'none'
	},
	data: []
};

it('should render something if no data is provided', () => {
	const data = barChart(defaultSettings);

	assert.equal(data, [
		'╭──────┬───────┬───────┬───────┬───────╮',
		'╰──────┴───────┴───────┴───────┴───────╯',
		'0    200m    400m    600m    800m      1'
	]);
});

it('should render something if one data point is provided', () => {
	const data = barChart({
		...defaultSettings,
		data: [
			{ value: 97, label: 'first' }
		]
	});

	assert.equal(data, [
		'      ╭───────┬───────┬───────┬────────╮',
		'first ▐█████████████████████████▌97▐██▌│',
		'      ╰───────┴───────┴───────┴────────╯',
		'      0      25      50      75      100'
	]);
});

it('should render half characters where appropriate', () => {
	const data = barChart(superimpose(defaultSettings, {
		render: {
			width: 25
		},
		data: [{
			value: 1,
			label: 'one',
			group: []
		}, {
			value: 2,
			label: 'two',
			group: []
		}, {
			value: 5,
			label: '3',
			group: []
		}, {
			value: 52,
			label: '4',
			group: []
		}, {
			value: 100,
			label: '5',
			group: []
		}]
	}) as ISettings);

	assert.equal(data, [
		'    ╭─────────┬─────────╮',
		'one ┃  1      ╵         │',
		'two ▐  2      ╵         │',
		'  3 ▐▌  5     ╵         │',
		'  4 ▐██████████  52     │',
		'  5 ▐████████████▌100▐██▌',
		'    ╰─────────┴─────────╯',
		'    0        50       100'
	]);
});

it('should calculate the min value', () => {
	const data = barChart(superimpose(defaultSettings, {
		calc: 'min',
		data: [
			{ data: [10, 20, 30, 40, 50, 60, 70, 80, 90], label: 'first' }
		]
	}) as ISettings);

	assert.equal(data, [
		'      ╭───────┬───────┬───────┬────────╮',
		'first ▐██████████████████████████▌10▐██▌',
		'      ╰───────┴───────┴───────┴────────╯',
		'      0      2.5      5      7.5      10'
	]);
});

it('should calculate the max value', () => {
	const data = barChart({
		...defaultSettings,
		calc: 'max',
		data: [
			{ data: [10, 20, 30, 40, 50, 60, 70, 80, 90], label: 'first' }
		]
	});

	assert.equal(data, [
		'      ╭───────┬───────┬───────┬────────╮',
		'first ▐██████████████████████▌90▐███   │',
		'      ╰───────┴───────┴───────┴────────╯',
		'      0      25      50      75      100'
	]);
});

it('should calculate the median value', () => {
	const data = barChart({
		...defaultSettings,
		calc: 'median',
		data: [
			{ data: [10, 30, 40, 50, 60, 70, 80, 90], label: 'first' }
		]
	});

	assert.equal(data, [
		'      ╭──────────┬──────────┬──────────╮',
		'first ▐███████████████████████▌55▐███  │',
		'      ╰──────────┼──────────┼──────────╯',
		'      0         20         40         60'
	]);
});

it('should calculate the mean value', () => {
	const data = barChart({
		...defaultSettings,
		calc: 'mean',
		data: [
			{ data: [10, 30, 40, 50, 60, 70, 80, 90], label: 'first' }
		]
	});

	assert.equal(data, [
		'      ╭──────────┬──────────┬──────────╮',
		'first ▐██████████████████████▌54▐███   │',
		'      ╰──────────┼──────────┼──────────╯',
		'      0         20         40         60'
	]);
});

it('should render ascii', () => {
	const data = barChart(superimpose(defaultSettings, {
		render: {
			style: 'ascii'
		},
		data: [
			{ value: 92, label: 'first' },
			{ value: 1, label: 'two' },
			{ value: 0, label: '' }
		]
	}) as ISettings);

	assert.equal(data, [
		'      +-------,-------,-------,--------+',
		'first %%%%%%%%%%%%%%%%%%%%%%%% 92 %%%  |',
		'  two %  1    \'       \'       \'        |',
		'      |  0    \'       \'       \'        |',
		'      +-------\'-------\'-------\'--------+',
		'      0      25      50      75      100'
	]);
});

it('should render a full chart with multiple data points', () => {
	const data = barChart(superimpose(defaultSettings, {
		title: 'Test chart',
		render: {
			fractionDigits: 2,
			sortLabels: 'desc'
		},
		data: [
			{ value: 97, label: 'first' },
			{ value: 100, label: 'second' },
			{ value: 3, label: 'third' },
			{ value: 0.123, label: 'four' },
			{ value: 0, label: 'five' }
		],
		xAxis: {
			label: 'Hz'
		}
	}) as ISettings);

	assert.equal(data, [
		'               Test chart               ',
		'       ╭───────┬───────┬───────┬───────╮',
		' third ▐▌  3.00╵       ╵       ╵       │',
		'second ▐█████████████████████▌100.00▐██▌',
		'  four ┃  0.12 ╵       ╵       ╵       │',
		'  five │  0.00 ╵       ╵       ╵       │',
		' first ▐█████████████████████▌97.00▐██▌│',
		'       ╰───────┴───────┴───────┴───────╯',
		'       0      25      50      75     100',
		'                      Hz                '
	]);
});

it('should render groups and custom width', () => {
	const data = barChart(superimpose(defaultSettings, {
		title: 'Test chart',
		render: {
			width: 60,
			fractionDigits: 2
		},
		data: [
			{ value: 97, label: 'first', group: ['one'] },
			{ value: 100, label: 'second', group: ['one'] },
			{ value: 3, label: 'third', group: ['two'] },
			{ value: 0.123, label: 'four', group: ['two'] },
			{ value: 0, label: 'five', group: ['two'] }
		],
		xAxis: {
			scale: 'log',
			label: 'Hz'
		}
	}) as ISettings);

	assert.equal(data, [
		'                         Test chart                         ',
		'one      ╭───────────┬────────────┬───────────┬────────────╮',
		'   first ▐███████████████████████████████████████▌97.00▐███│',
		'  second ▐███████████████████████████████████████▌100.00▐██▌',
		'two      │           ╵            │           ╵            │',
		'   third ▐███████████▌  3.00      │           ╵            │',
		'    four ┃  0.12     ╵            │           ╵            │',
		'    five │  0.00     ╵            │           ╵            │',
		'         ╰───────────┴────────────┼───────────┴────────────╯',
		'         0          3.2          10          32          100',
		'                                 Hz                         '
	]);
});

it('should render groups and extra rows', () => {
	const data = barChart(superimpose(defaultSettings, {
		title: 'Test chart',
		render: {
			width: 60,
			fractionDigits: 2,
			extraRowSpacing: true
		},
		data: [
			{ value: 97, label: 'first', group: ['one'] },
			{ value: 100, label: 'second', group: ['one'] },
			{ value: 3, label: 'third', group: ['two'] },
			{ value: 0.123, label: 'four', group: ['two'] },
			{ value: 0, label: 'five', group: ['two'] }
		],
		xAxis: {
			scale: 'log',
			label: 'Hz'
		}
	}) as ISettings);

	assert.equal(data, [
		'                         Test chart                         ',
		'one      ╭───────────┬────────────┬───────────┬────────────╮',
		'   first ▐███████████████████████████████████████▌97.00▐███│',
		'         │           ╵            │           ╵            │',
		'  second ▐███████████████████████████████████████▌100.00▐██▌',
		'         │           ╵            │           ╵            │',
		'two      │           ╵            │           ╵            │',
		'   third ▐███████████▌  3.00      │           ╵            │',
		'         │           ╵            │           ╵            │',
		'    four ┃  0.12     ╵            │           ╵            │',
		'         │           ╵            │           ╵            │',
		'    five │  0.00     ╵            │           ╵            │',
		'         ╰───────────┴────────────┼───────────┴────────────╯',
		'         0          3.2          10          32          100',
		'                                 Hz                         '
	]);
});

it('should wrap long labels', () => {
	const data = barChart(superimpose(defaultSettings, {
		title: 'Test chart',
		render: {
			width: 60,
			fractionDigits: 2,
			extraRowSpacing: true,
			maxYAxisWidth: 16
		},
		data: [
			{ value: 97, label: 'first long label', group: ['one long enough to wrap'] },
			{ value: 100, label: 'second long label', group: ['one long enough to wrap'] },
			{ value: 3, label: 'third long label', group: ['two long enough to wrap'] },
			{ value: 0.123, label: 'fourth long label', group: ['two long enough to wrap'] },
			{ value: 0, label: 'fifth long label', group: ['two'] }
		],
		xAxis: {
			scale: 'log',
			label: 'Hz'
		}
	}) as ISettings);

	assert.equal(data, [
		'                         Test chart                         ',
		'one long     ╭──────────┬───────────┬──────────┬───────────╮',
		'enough to    │          ╵           │          ╵           │',
		'wrap         │          ╵           │          ╵           │',
		'       first │          ╵           │          ╵           │',
		'  long label ▐███████████████████████████████████▌97.00▐███│',
		'             │          ╵           │          ╵           │',
		'      second │          ╵           │          ╵           │',
		'  long label ▐███████████████████████████████████▌100.00▐██▌',
		'             │          ╵           │          ╵           │',
		'two          │          ╵           │          ╵           │',
		'       fifth │          ╵           │          ╵           │',
		'  long label │  0.00    ╵           │          ╵           │',
		'             │          ╵           │          ╵           │',
		'two long     │          ╵           │          ╵           │',
		'enough to    │          ╵           │          ╵           │',
		'wrap         │          ╵           │          ╵           │',
		'       third │          ╵           │          ╵           │',
		'  long label ▐██████████▌  3.00     │          ╵           │',
		'             │          ╵           │          ╵           │',
		'      fourth │          ╵           │          ╵           │',
		'  long label ┃  0.12    ╵           │          ╵           │',
		'             ╰──────────┴───────────┼──────────┴───────────╯',
		'             0         3.2         10         32         100',
		'                                   Hz                       '
	]);
});
