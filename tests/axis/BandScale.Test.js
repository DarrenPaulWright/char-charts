import { assert } from 'type-enforcer';
import BandScale from '../../src/axis/BandScale.js';

describe('BandScale', () => {
	describe('init', () => {
		it(`should accept an empty array`, () => {
			const scale = new BandScale([]);

			assert.is(scale.domain().length, 0);
			assert.is(scale.maxLabelWidth(), 0);
			assert.is(scale.isGrouped(), false);
		});

		it(`should set the domain and maxLabelWidth`, () => {
			const data = [{
				value: 0,
				label: 'first',
				group: []
			}, {
				value: 12,
				label: 'second',
				group: []
			}, {
				value: 7,
				label: 'third',
				group: []
			}];
			const scale = new BandScale(data);

			const domain = scale.domain();

			assert.is(domain.length, 3);

			domain.forEach((item, index) => {
				assert.is(domain[index].siblings[0], index === 0 ? undefined : domain[index - 1]);
				assert.is(domain[index].siblings[1], index === domain.length - 1 ? undefined : domain[index + 1]);
			});

			assert.is(domain[0], data[0]);
			assert.is(domain[1], data[1]);
			assert.is(domain[2], data[2]);

			assert.is(scale.maxLabelWidth(), 7);

			assert.is(scale.isGrouped(), false);
		});

		it(`should add rows for groups`, () => {
			const data = [{
				value: 0,
				label: 'first',
				group: ['one']
			}, {
				value: 12,
				label: 'second',
				group: ['one']
			}, {
				value: 7,
				label: 'third',
				group: ['two long']
			}];
			const scale = new BandScale(data);

			const domain = scale.domain();

			assert.is(domain.length, 5);

			domain.forEach((item, index) => {
				assert.is(domain[index].siblings[0], index === 0 ? undefined : domain[index - 1]);
				assert.is(domain[index].siblings[1], index === domain.length - 1 ? undefined : domain[index + 1]);
			});

			assert.equal(domain[0], {
				label: 'one',
				groupIndent: 0,
				siblings: [undefined, domain[1]]
			});
			assert.is(domain[1], data[0]);
			assert.is(domain[2], data[1]);
			assert.equal(domain[3], {
				label: 'two long',
				groupIndent: 0,
				siblings: [domain[2], domain[4]]
			});
			assert.is(domain[4], data[2]);

			assert.is(scale.maxLabelWidth(), 11);

			assert.is(scale.isGrouped(), true);
		});

		it(`should add rows for nested groups`, () => {
			const data = [{
				value: 0,
				label: 'first',
				group: ['one', 'sub one']
			}, {
				value: 12,
				label: 'second',
				group: ['one', 'sub two']
			}, {
				value: 7,
				label: 'third',
				group: ['two long', 'sub one']
			}];
			const scale = new BandScale(data);

			const domain = scale.domain();

			assert.is(domain.length, 8);

			domain.forEach((item, index) => {
				assert.is(domain[index].siblings[0], index === 0 ? undefined : domain[index - 1]);
				assert.is(domain[index].siblings[1], index === domain.length - 1 ? undefined : domain[index + 1]);
			});

			assert.equal(domain[0], {
				label: 'one',
				groupIndent: 0,
				siblings: [undefined, domain[1]]
			});
			assert.equal(domain[1], {
				label: 'sub one',
				groupIndent: 1,
				siblings: [domain[0], domain[2]]
			});
			assert.is(domain[2], data[0]);
			assert.equal(domain[3], {
				label: 'sub two',
				groupIndent: 1,
				siblings: [domain[2], domain[4]]
			});
			assert.is(domain[4], data[1]);
			assert.equal(domain[5], {
				label: 'two long',
				groupIndent: 0,
				siblings: [domain[4], domain[6]]
			});
			assert.equal(domain[6], {
				label: 'sub one',
				groupIndent: 1,
				siblings: [domain[5], domain[7]]
			});
			assert.is(domain[7], data[2]);

			assert.is(scale.maxLabelWidth(), 14);

			assert.is(scale.isGrouped(), true);
		});
	});

});
