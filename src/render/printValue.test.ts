import { assert, describe, it } from 'hippogriff';
import Axis from '../axis/Axis.js';
import type { ISettingsInternal } from '../types.js';
import { ROUNDED_STYLE } from './chars.js';
import printValue from './printValue.js';

const defaultSettings: ISettingsInternal = {
	title: '',
	width: 40,
	maxYAxisWidth: 20,
	fractionDigits: 0,
	significantDigits: 0,
	showInlineLabels: false,
	showDots: false,
	useColor: false,
	colors: [],
	extraRowSpacing: false,
	style: 'rounded',
	CHARS: ROUNDED_STYLE,
	calc: 'min',
	yAxis: new Axis({}, []),
	xAxis: new Axis({}, []),
	data: []
};

describe('printValue', () => {
	it('should return a number as a string if no fractionDigits are provided', () => {
		assert.is(printValue(24.123, defaultSettings), '24');
	});

	describe('fractionDigits', () => {
		const settings = {
			...defaultSettings,
			fractionDigits: 2
		};

		it('should trim extra fractionDigits', () => {
			assert.is(printValue(24.123, settings), '24.12');
		});

		it('should add fractionDigits to an integer', () => {
			assert.is(printValue(24, settings), '24.00');
		});

		it('should add fractionDigits if needed', () => {
			assert.is(printValue(24.1, settings), '24.10');
		});

		it('should keep fractionDigits if a number rounds to zero', () => {
			assert.is(printValue(0.0023, settings), '0.00');
		});

		it('should convert a number to a localeString', () => {
			assert.is(printValue(123456.123456, settings), '123,456.12');
		});
	});

	describe('significantDigits', () => {
		const settings = {
			...defaultSettings,
			significantDigits: 3
		};

		it('should trim extra digits', () => {
			assert.is(printValue(24.123, settings), '24.1');
		});

		it('should not add digits', () => {
			assert.is(printValue(24, settings), '24');
		});

		it('should convert small numbers', () => {
			assert.is(printValue(0.0023, settings), '2.3m');
		});

		it('should convert a large number', () => {
			assert.is(printValue(123456.123456, settings), '123k');
		});
	});
});
