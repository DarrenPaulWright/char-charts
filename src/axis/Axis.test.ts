import { assert, describe, it } from 'hippogriff';
import Axis from './Axis.js';
import BandScale from './BandScale.js';
import LinearScale from './LinearScale.js';
import LogScale from './LogScale.js';

describe('init', () => {
	it('should accept an empty array', () => {
		const axis = new Axis({}, []);

		assert.is(axis.domain().length, 2);
	});
});

describe('scale', () => {
	it('should use linear scale by default', () => {
		const axis = new Axis({}, []);

		assert.is(axis.scale instanceof LinearScale, true);
	});

	it('should use log scale if specified', () => {
		const axis = new Axis({
			scale: 'log'
		}, []);

		assert.is(axis.scale instanceof LogScale, true);
	});

	it('should use band scale if specified', () => {
		const axis = new Axis({
			scale: 'band'
		}, []);

		assert.is(axis.scale instanceof BandScale, true);
	});
});
