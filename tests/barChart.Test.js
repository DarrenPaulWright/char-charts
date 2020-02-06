import { assert } from 'chai';
import { barChart } from '../index.js';

describe('barChart', () => {
	it(`should render something if no data is provided`, () => {
		const data = barChart();

		assert.deepEqual(data, [
			'          ╭──────┬──────┬───────┬──────╮',
			'undefined │  0   ╵      ╵       ╵      │',
			'          ╰──────┴──────┴───────┴──────╯',
			'          0    250m   500m    750m     1'
		]);
	});

	it(`should render something if one data point is provided`, () => {
		const data = barChart({
			data: [
				{value: 97, label: 'first'}
			]
		});

		assert.deepEqual(data, [
			'      ╭───────┬───────┬────────┬───────╮',
			'first ▐█▌97▐██████████████████████████▌│',
			'      ╰───────┴───────┴────────┴───────╯',
			'      0      25      50       75     100'
		]);
	});

	it('should render half characters where appropriate', () => {
		const data = barChart({
			width: 25,
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
		});

		assert.deepEqual(data, [
			'    ╭─────────┬─────────╮',
			'one ┃  1      ╵         │',
			'two ▐  2      ╵         │',
			'  3 ▐▌  5     ╵         │',
			'  4 ▐█████████▌  52     │',
			'  5 ▐█▌100▐█████████████▌',
			'    ╰─────────┴─────────╯',
			'    0        50       100'
		]);
	});

	it(`should calculate the min value`, () => {
		const data = barChart({
			calc: 'min',
			data: [
				{data: [10, 20, 30, 40, 50, 60, 70, 80, 90], label: 'first'}
			]
		});

		assert.deepEqual(data, [
			'      ╭───────┬───────┬────────┬───────╮',
			'first ▐█▌10▐███████████████████████████▌',
			'      ╰───────┴───────┴────────┴───────╯',
			'      0      2.5      5       7.5     10'
		]);
	});

	it(`should calculate the max value`, () => {
		const data = barChart({
			calc: 'max',
			data: [
				{data: [10, 20, 30, 40, 50, 60, 70, 80, 90], label: 'first'}
			]
		});

		assert.deepEqual(data, [
			'      ╭───────┬───────┬────────┬───────╮',
			'first ▐█▌90▐████████████████████████   │',
			'      ╰───────┴───────┴────────┴───────╯',
			'      0      25      50       75     100'
		]);
	});

	it(`should calculate the median value`, () => {
		const data = barChart({
			calc: 'median',
			data: [
				{data: [10, 30, 40, 50, 60, 70, 80, 90], label: 'first'}
			]
		});

		assert.deepEqual(data, [
			'      ╭──────────┬──────────┬──────────╮',
			'first ▐█▌55▐████████████████████████▌  │',
			'      ╰──────────┼──────────┼──────────╯',
			'      0         20         40         60'
		]);
	});

	it(`should calculate the mean value`, () => {
		const data = barChart({
			calc: 'mean',
			data: [
				{data: [10, 30, 40, 50, 60, 70, 80, 90], label: 'first'}
			]
		});

		assert.deepEqual(data, [
			'      ╭──────────┬──────────┬──────────╮',
			'first ▐█▌54▐████████████████████████   │',
			'      ╰──────────┼──────────┼──────────╯',
			'      0         20         40         60'
		]);
	});

	it(`should render ascii`, () => {
		const data = barChart({
			ascii: true,
			data: [
				{value: 92, label: 'first'},
				{value: 1, label: 'two'},
				{value: 0}
			]
		});

		assert.deepEqual(data, [
			'      +-------+-------+--------+-------+',
			'first %% 92 %%%%%%%%%%%%%%%%%%%%%%%%%  |',
			'  two %  1    \'       \'        \'       |',
			'      |  0    \'       \'        \'       |',
			'      +-------+-------+--------+-------+',
			'      0      25      50       75     100'
		]);
	});

	it(`should a full chart with multiple data points`, () => {
		const data = barChart({
			title: 'Test chart',
			fractionDigits: 2,
			data: [
				{value: 97, label: 'first'},
				{value: 100, label: 'second'},
				{value: 3, label: 'third'},
				{value: 0.123, label: 'four'},
				{value: 0, label: 'five'}
			],
			xAxis: {
				label: 'Hz'
			}
		});

		assert.deepEqual(data, [
			'               Test chart               ',
			'       ╭───────┬───────┬───────┬───────╮',
			' first ▐█▌97.00▐██████████████████████▌│',
			'second ▐█▌100.00▐██████████████████████▌',
			' third ▐▌  3.00╵       ╵       ╵       │',
			'  four ┃  0.12 ╵       ╵       ╵       │',
			'  five │  0.00 ╵       ╵       ╵       │',
			'       ╰───────┴───────┴───────┴───────╯',
			'       0      25      50      75     100',
			'                      Hz                '
		]);
	});

	it(`should render groups and custom width`, () => {
		const data = barChart({
			title: 'Test chart',
			width: 60,
			fractionDigits: 2,
			data: [
				{value: 97, label: 'first', group: ['one']},
				{value: 100, label: 'second', group: ['one']},
				{value: 3, label: 'third', group: ['two']},
				{value: 0.123, label: 'four', group: ['two']},
				{value: 0, label: 'five', group: ['two']}
			],
			xAxis: {
				scale: 'log',
				label: 'Hz'
			}
		});

		assert.deepEqual(data, [
			'                         Test chart                         ',
			'one    ╭────────────┬────────────┬────────────┬────────────╮',
			' first ▐█▌97.00▐███████████████████████████████████████████│',
			'second ▐█▌100.00▐██████████████████████████████████████████▌',
			'two    │            ╵            │            ╵            │',
			' third ▐███████████ ╵3.00        │            ╵            │',
			'  four ┃  0.12      ╵            │            ╵            │',
			'  five │  0.00      ╵            │            ╵            │',
			'       ╰────────────┴────────────┼────────────┴────────────╯',
			'       0           3.2          10           32          100',
			'                                Hz                          '
		]);
	});
});
