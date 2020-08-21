import { assert } from 'type-enforcer';
import Axis from '../../src/axis/Axis.js';
import Row from '../../src/render/Row.js';

const data = [
	{ value: 95, label: 'one', group: ['group', 'in'] },
	{ value: 105, label: 'two', group: ['group', 'in'] },
	{ value: 105, label: 'three', group: ['group', 'in'] }
];
const baseSettings = {
	xAxis: new Axis({}, data).size(20),
	yAxis: new Axis({ scale: 'band' }, data),
	CHARS: {
		CHART_VERTICAL_MINOR: '.',
		CHART_VERTICAL_MAJOR: '|',
		GROUP_HEADER_FILL: '-'
	},
	width: 26
};

describe('Row', () => {
	describe('prepend', () => {
		it(`should add a string to the beginning`, () => {
			const row = new Row(baseSettings);

			row._string = 'ing';

			row.prepend('test');

			assert.is(row.toString(), 'testing');
		});
	});

	describe('append', () => {
		it(`should add a string to the end`, () => {
			const row = new Row(baseSettings);

			row._string = 'test';

			row.append('ing');

			assert.is(row.toString(), 'testing');
		});
	});

	describe('padEnd', () => {
		it(`should add a character until the value length is reached`, () => {
			const row = new Row(baseSettings);

			row._string = 'test';

			row.padEnd(10, 'i');

			assert.is(row.toString(), 'testiiiiii');
		});

		it(`should add spaces with tick marks`, () => {
			const row = new Row(baseSettings);

			row.padEnd(6, ' ');
			assert.is(row.toString(), '.     ');

			row.padEnd(13, ' ');
			assert.is(row.toString(), '.        |   ');

			row.padEnd(20, ' ');
			assert.is(row.toString(), '.        |         .');
		});
	});

	describe('prependLabel', () => {
		it(`should add a label to the beginning`, () => {
			const row = new Row(baseSettings);

			row.padEnd(20, ' ');
			assert.is(row.toString(), '.        |         .');

			row.prependLabel(data[0]);
			assert.is(row.toString(), '     one .        |         .');
		});

		it(`should add spaces if the same label is set twice`, () => {
			const row = new Row(baseSettings);

			row.padEnd(20, ' ');
			assert.is(row.toString(), '.        |         .');

			row.prependLabel(data[0]);
			assert.is(row.toString(), '     one .        |         .');

			row._string = '';

			row.padEnd(20, ' ');
			assert.is(row.toString(), '.        |         .');

			row.prependLabel(data[0]);
			assert.is(row.toString(), '         .        |         .');
		});

		it(`should add a group label to the beginning`, () => {
			const row = new Row(baseSettings);

			row.padEnd(20, ' ');
			assert.is(row.toString(), '.        |         .');

			row.prependLabel(baseSettings.yAxis.domain()[0]);
			assert.is(row.toString(), 'group    .        |         .');
		});

		it(`should add a nested group label to the beginning`, () => {
			const row = new Row(baseSettings);

			row.padEnd(20, ' ');
			assert.is(row.toString(), '.        |         .');

			row.prependLabel(baseSettings.yAxis.domain()[1]);
			assert.is(row.toString(), '--- in   .        |         .');
		});
	});
});
