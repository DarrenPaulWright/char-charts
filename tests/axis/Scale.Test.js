import { List } from 'hord';
import { assert } from 'type-enforcer';
import Scale from '../../src/axis/Scale.js';

describe('Scale', () => {
	describe('.domain', () => {
		it('should have a default domain of 0,1', () => {
			const scale = new Scale([]);

			assert.equal(scale.domain(), [0, 1]);
		});

		it('should calculate the domain with min 0 when instantiated with values', () => {
			const scale = new Scale([{
				value: 0
			}, {}, {
				value: 100
			}]);

			assert.equal(scale.domain(), [0, 100]);
		});

		it('should calculate the domain with max 0 when instantiated with values', () => {
			const scale = new Scale([{
				value: 0
			}, {
				value: -100
			}]);

			assert.equal(scale.domain(), [-100, 0]);
		});

		it('should calculate the domain with min 0 when instantiated with data', () => {
			const scale = new Scale([{
				data: new List([0, 1, 2, 3])
			}, {
				data: new List([100, 99, 98])
			}]);

			assert.equal(scale.domain(), [0, 100]);
		});

		it('should calculate the domain with max 0 when instantiated with data', () => {
			const scale = new Scale([{
				data: new List([0, -1, -2, -3])
			}, {
				data: new List([-98, -99, -100])
			}]);

			assert.equal(scale.domain(), [-100, 0]);
		});
	});
});
