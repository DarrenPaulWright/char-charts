import { assert } from 'type-enforcer';
import Axis from '../../src/axis/Axis.js';
import BandScale from '../../src/axis/BandScale.js';
import LinearScale from '../../src/axis/LinearScale.js';
import LogScale from '../../src/axis/LogScale.js';

describe('Axis', () => {
	describe('init', () => {
		it(`should accept an empty array`, () => {
			const axis = new Axis({}, []);

			assert.is(axis.domain().length, 2);
		});
	});

	describe('scale', () => {
		it(`should use linear scale by default`, () => {
			const axis = new Axis({}, []);

			assert.is(axis.scale() instanceof LinearScale, true);
		});

		it(`should use log scale if specified`, () => {
			const axis = new Axis({
				scale: 'log'
			}, []);

			assert.is(axis.scale() instanceof LogScale, true);
		});

		it(`should use band scale if specified`, () => {
			const axis = new Axis({
				scale: 'band'
			}, []);

			assert.is(axis.scale() instanceof BandScale, true);
		});
	});
});
