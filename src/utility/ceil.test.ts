import { assert, describe, it } from 'hippogriff';
import ceil from './ceil.js';

const values = [{
	input: 1111,
	fractionDigits: null,
	precision: 2,
	expected: 1200
}, {
	input: 988328.0826795292,
	fractionDigits: null,
	precision: 2,
	expected: 990000
}];

describe('ceil', () => {
	values.forEach((value) => {
		it(`should return ${ value.expected }`, () => {
			assert.is(ceil(value.input, value.fractionDigits, value.precision), value.expected);
		});
	});
});
