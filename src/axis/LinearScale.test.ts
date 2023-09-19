import chalk from 'chalk';
import displayValue from 'display-value';
import { assert, describe, it } from 'hippogriff';
import LinearScale from './LinearScale.js';

const data = [{
	in: { min: 0, max: 100, size: 10 },
	out: {
		tickValue: 100,
		start: 0,
		end: 100,
		ticks: [0, 100],
		majorTicks: [0, 100]
	}
}, {
	in: { min: 0, max: 100, size: 20 },
	out: {
		tickValue: 50,
		start: 0,
		end: 100,
		ticks: [0, 50, 100],
		majorTicks: [0, 100]
	}
}, {
	in: { min: 0, max: 100, size: 30 },
	out: {
		tickValue: 25,
		start: 0,
		end: 100,
		ticks: [0, 25, 50, 75, 100],
		majorTicks: [0, 100]
	}
}, {
	in: { min: 0, max: 100, size: 50 },
	out: {
		tickValue: 20,
		start: 0,
		end: 100,
		ticks: [0, 20, 40, 60, 80, 100],
		majorTicks: [0, 100]
	}
}, {
	in: { min: 0, max: 100, size: 100 },
	out: {
		tickValue: 10,
		start: 0,
		end: 100,
		ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
		majorTicks: [0, 100]
	}
}, {
	in: { min: 87, max: 113, size: 50 },
	out: {
		tickValue: 5,
		start: 85,
		end: 115,
		ticks: [85, 90, 95, 100, 105, 110, 115],
		majorTicks: [100]
	}
}, {
	in: { min: 99, max: 101, size: 50 },
	out: {
		tickValue: 0.5,
		start: 99,
		end: 101,
		ticks: [99, 99.5, 100, 100.5, 101],
		majorTicks: [100]
	}
}, {
	in: { min: 0.1, max: 0.8, size: 50 },
	out: {
		tickValue: 0.2,
		start: 0,
		end: 1,
		ticks: [0, 0.2, 0.4, 0.6, 0.8, 1],
		majorTicks: [0, 1]
	}
}, {
	in: { min: 0.01, max: 0.09, size: 50 },
	out: {
		tickValue: 0.02,
		start: 0,
		end: 0.1,
		ticks: [0, 0.02, 0.04, 0.06, 0.08, 0.1],
		majorTicks: [0, 0.1]
	}
}, {
	in: { min: 0.001, max: 0.009, size: 50 },
	out: {
		tickValue: 0.002,
		start: 0,
		end: 0.01,
		ticks: [0, 0.002, 0.004, 0.006, 0.008, 0.01],
		majorTicks: [0, 0.01]
	}
}];

const extraValues = {
	label: '',
	group: [],
	isGroup: false,
	color: chalk.red,
	bgColor: chalk.green
};

describe('range', () => {
	it('should accept an empty array', () => {
		const scale = new LinearScale([]);
		scale.size = 100;

		assert.is(scale.tickValue, 0.1);
		assert.is(scale.start, 0);
		assert.is(scale.end, 1);
	});

	data.forEach((datum) => {
		it(`should set range for input of ${ displayValue(datum.in) }`, () => {
			const scale = new LinearScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}]);

			scale.size = datum.in.size;

			assert.is(scale.tickValue, datum.out.tickValue);
			assert.is(scale.start, datum.out.start);
			assert.is(scale.end, datum.out.end);
		});
	});

	it('should NOT reset the tickValue if shouldGetTickValue is false', () => {
		const scale = new LinearScale([{
			value: 13,
			...extraValues
		}, {
			value: 87,
			...extraValues
		}]);

		scale.tickValue = 25;
		scale.shouldGetTickValue = false;
		scale.size = 100;

		assert.is(scale.tickValue, 25);
		assert.is(scale.start, 0);
		assert.is(scale.end, 100);
	});

	it('should NOT reset the start if shouldGetStart is false', () => {
		const scale = new LinearScale([{
			value: 13,
			...extraValues
		}, {
			value: 87,
			...extraValues
		}]);

		scale.start = -25;
		scale.shouldGetStart = false;
		scale.size = 100;

		assert.is(scale.tickValue, 10);
		assert.is(scale.start, -25);
		assert.is(scale.end, 90);
	});

	it('should NOT reset the end if shouldGetEnd is false', () => {
		const scale = new LinearScale([{
			value: 13,
			...extraValues
		}, {
			value: 87,
			...extraValues
		}]);

		scale.end = 125;
		scale.shouldGetEnd = false;
		scale.size = 100;

		assert.is(scale.tickValue, 10);
		assert.is(scale.start, 10);
		assert.is(scale.end, 125);
	});
});

describe('ticks', () => {
	data.forEach((datum) => {
		it(`should set ticks for input of ${ displayValue(datum.in) }`, () => {
			const scale = new LinearScale([{
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
			const scale = new LinearScale([{
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
			const scale = new LinearScale([{
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
