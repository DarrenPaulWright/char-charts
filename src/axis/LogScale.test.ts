import chalk from 'chalk';
import displayValue from 'display-value';
import { assert, describe, it } from 'hippogriff';
import LogScale from './LogScale.js';

const data = [{
	in: { min: 0, max: 100, size: 10 },
	out: { start: 0, end: 100, ticks: [0, 100], majorTicks: [0, 10] }
}, {
	in: { min: 0, max: 100, size: 20 },
	out: { start: 0, end: 100, ticks: [0, 10, 100], majorTicks: [0, 10, 100] }
}, {
	in: { min: 0, max: 100, size: 30 },
	out: {
		start: 0,
		end: 100,
		ticks: [0, 10, 100],
		majorTicks: [0, 10, 100]
	}
}, {
	in: { min: 0, max: 100, size: 50 },
	out: {
		start: 0,
		end: 100,
		ticks: [0, 3.2, 10, 32, 100],
		majorTicks: [0, 10, 100]
	}
}, {
	in: { min: 0, max: 100, size: 100 },
	out: {
		start: 0,
		end: 100,
		ticks: [0, 1.8, 3.2, 5.7, 10, 18, 32, 57, 100],
		majorTicks: [0, 10, 100]
	}
}, {
	in: { min: 87, max: 113, size: 50 },
	out: {
		start: 87,
		end: 120,
		ticks: [87, 93, 100, 110, 120],
		majorTicks: [100]
	}
}, {
	in: { min: 99, max: 101, size: 50 },
	out: { start: 99, end: 110, ticks: [99, 110], majorTicks: [] }
}];

const extraValues = {
	label: '',
	group: [],
	isGroup: false,
	color: chalk.red,
	bgColor: chalk.green
};

describe('range', () => {
	data.forEach((datum) => {
		it(`should set range for input of ${ displayValue(datum.in) }`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}]);

			scale.size = datum.in.size;

			assert.is(scale.start, datum.out.start);
			assert.is(scale.end, datum.out.end);
		});
	});

	it('should NOT reset the start if shouldGetStart is false', () => {
		const scale = new LogScale([{
			value: 13,
			...extraValues
		}, {
			value: 87,
			...extraValues
		}]);

		scale.start = -25;
		scale.shouldGetStart = false;
		scale.size = 100;

		assert.is(scale.start, -25);
		assert.is(scale.end, 87);
	});

	it('should NOT reset the end if shouldGetEnd is false', () => {
		const scale = new LogScale([{
			value: 13,
			...extraValues
		}, {
			value: 87,
			...extraValues
		}]);

		scale.end = 125;
		scale.shouldGetEnd = false;
		scale.size = 100;

		assert.is(scale.start, 13);
		assert.is(scale.end, 125);
	});
});

describe('ticks', () => {
	data.forEach((datum) => {
		it(`should set ticks for input of ${ displayValue(datum.in) }`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}]);

			scale.size = datum.in.size;

			assert.equal(scale.ticks(), datum.out.ticks);
		});
	});
});

describe('getCharOffset', () => {
	data.forEach((datum) => {
		it(`should set getCharOffset for input of ${ displayValue(datum.in) }`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}]);

			scale.size = datum.in.size;

			assert.equal(scale.getCharOffset(datum.out.start), 1);
			assert.equal(scale.getCharOffset(datum.out.start, 1), 0.5);
			assert.equal(scale.getCharOffset(datum.out.end), datum.in.size);
			assert.equal(scale.getCharOffset(datum.out.end, 1), datum.in.size - 0.5);
		});
	});
});

describe('isMajorTick', () => {
	data.forEach((datum) => {
		it(`should set isMajorTick for input of ${ displayValue(datum.in) }`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}]);

			scale.size = datum.in.size;

			scale.ticks();

			datum.out.majorTicks.forEach((tick) => {
				assert.is(scale.isMajorTick(tick), true);
			});
		});
	});
});
