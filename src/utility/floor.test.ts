import { assert, describe, it } from 'hippogriff';
import floor from './floor.js';

const values = [{
	input: 1111,
	fractionDigits: null,
	precision: 2,
	expected: 1100
}, {
	input: 988328.0826795292,
	fractionDigits: null,
	precision: 2,
	expected: 980000
}];

describe('floor', () => {
	values.forEach((value) => {
		it(`should return ${ value.expected }`, () => {
			assert.is(floor(value.input, value.fractionDigits, value.precision), value.expected);
		});
	});
});
