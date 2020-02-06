import { assert } from 'chai';
import Axis from '../../src/axis/Axis.js';
import BandScale from '../../src/axis/BandScale.js';
import LinearScale from '../../src/axis/LinearScale.js';
import LogScale from '../../src/axis/LogScale.js';

describe('Axis', () => {
	describe('init', () => {
		it(`should accept an empty array`, () => {
			const axis = new Axis({}, []);

			assert.strictEqual(axis.domain().length, 2);
		});
	});

	describe('scale', () => {
		it(`should use linear scale by default`, () => {
			const axis = new Axis({}, []);

			assert.isTrue(axis.scale() instanceof LinearScale);
		});

		it(`should use log scale if specified`, () => {
			const axis = new Axis({
				scale: 'log'
			}, []);

			assert.isTrue(axis.scale() instanceof LogScale);
		});

		it(`should use band scale if specified`, () => {
			const axis = new Axis({
				scale: 'band'
			}, []);

			assert.isTrue(axis.scale() instanceof BandScale);
		});
	});

});
