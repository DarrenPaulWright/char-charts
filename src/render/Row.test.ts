import chalk from 'chalk';
import { assert, describe, it } from 'hippogriff';
import Axis from '../axis/Axis.js';
import type { IBandDomain, IChartDataInternal, ISettingsInternal } from '../types';
import { ROUNDED_STYLE } from './chars.js';
import Row from './Row.js';

const extraValues = {
	label: '',
	group: [],
	siblings: [],
	isGroup: false,
	color: chalk.red,
	bgColor: chalk.green
};

const data: Array<IChartDataInternal> = [{
	...extraValues,
	value: 95,
	label: 'one',
	group: ['group', 'in'],
	hasExtraRow: false
}, {
	...extraValues,
	value: 105,
	label: 'two',
	group: ['group', 'in'],
	hasExtraRow: false
}, {
	...extraValues,
	value: 105,
	label: 'three',
	group: ['group', 'in'],
	hasExtraRow: false
}];

const xAxis = new Axis({}, data);
xAxis.size = 20;
const yAxis = new Axis({ scale: 'band' }, data);

const baseSettings: ISettingsInternal = {
	title: '',
	width: 26,
	fractionDigits: 0,
	significantDigits: 0,
	showInlineLabels: false,
	showDots: false,
	style: 'rounded',
	useColor: false,
	colors: [],
	extraRowSpacing: false,
	calc: null,
	xAxis,
	yAxis,
	CHARS: {
		...ROUNDED_STYLE,
		CHART_VERTICAL_MINOR: '.',
		CHART_VERTICAL_MAJOR: '|',
		GROUP_HEADER_FILL: '-'
	},
	data
};

class TestRow extends Row {
	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	preProcess(rowData: IBandDomain): void {
		rowData.value ||= 0;
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	render(rowData: IBandDomain): Array<string> {
		return [rowData.label];
	}
}

describe('prepend', () => {
	it('should add a string to the beginning', () => {
		const row = new TestRow(baseSettings);

		row.append('ing');

		row.prepend('test');

		assert.is(row.toString(), 'testing');
	});
});

describe('append', () => {
	it('should add a string to the end', () => {
		const row = new TestRow(baseSettings);

		row.append('test');

		row.append('ing');

		assert.is(row.toString(), 'testing');
	});
});

describe('padEnd', () => {
	it('should add a character until the value length is reached', () => {
		const row = new TestRow(baseSettings);

		row.append('test');

		row.padEnd(10, 'i');

		assert.is(row.toString(), 'testiiiiii');
	});

	it('should add spaces with tick marks', () => {
		const row = new TestRow(baseSettings);

		row.padEnd(6, ' ');
		assert.is(row.toString(), '|     ');

		row.padEnd(13, ' ');
		assert.is(row.toString(), '|        |   ');

		row.padEnd(20, ' ');
		assert.is(row.toString(), '|        |         |');
	});
});

describe('prependLabel', () => {
	it('should add a label to the beginning', () => {
		const row = new TestRow(baseSettings);

		row.padEnd(20, ' ');
		assert.is(row.toString(), '|        |         |');

		row.prepRender(data[0] as IBandDomain);
		row.prependLabel(false);
		assert.is(row.toString(), '     one |        |         |');
	});

	it('should add spaces if the same label is set twice', () => {
		const row = new TestRow(baseSettings);

		row.padEnd(20, ' ');
		assert.is(row.toString(), '|        |         |');

		row.prepRender(data[0] as IBandDomain);
		row.prependLabel(false);
		assert.is(row.toString(), '     one |        |         |');

		row.reset();

		row.padEnd(20, ' ');
		assert.is(row.toString(), '|        |         |');

		row.prepRender(data[0] as IBandDomain);
		row.prependLabel(false);
		assert.is(row.toString(), '         |        |         |');
	});

	it('should add a group label to the beginning', () => {
		const row = new TestRow(baseSettings);

		row.padEnd(20, ' ');
		assert.is(row.toString(), '|        |         |');

		row.prepRender((baseSettings.yAxis.domain() as Array<IBandDomain>)[0]);
		row.prependLabel(false);
		assert.is(row.toString(), 'group    |        |         |');
	});

	it('should add a nested group label to the beginning', () => {
		const row = new TestRow(baseSettings);

		row.padEnd(20, ' ');
		assert.is(row.toString(), '|        |         |');

		row.prepRender((baseSettings.yAxis.domain() as Array<IBandDomain>)[1]);
		row.prependLabel(false);
		assert.is(row.toString(), '--- in   |        |         |');
	});
});
