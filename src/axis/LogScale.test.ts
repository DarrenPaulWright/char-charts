import chalk from 'chalk';
import displayValue from 'display-value';
import { assert, describe, it } from 'hippogriff';
import LogScale from './LogScale.js';

const data = [{
	in: { min: 0, max: 100, size: 10 },
	out: {
		start: 0,
		end: 110,
		ticks: [0, 110],
		majorTicks: [0, 110]
	},
	outFullRange: {
		start: 0,
		end: 100,
		ticks: [0, 100],
		majorTicks: [0, 100]
	}
}, {
	in: { min: 0, max: 100, size: 20 },
	out: {
		start: 0,
		end: 110,
		ticks: [0, 16, 110],
		majorTicks: [0, 110]
	},
	outFullRange: {
		start: 0,
		end: 100,
		ticks: [0, 16, 100],
		majorTicks: [0, 100]
	}
}, {
	in: { min: 0, max: 100, size: 30 },
	out: {
		start: 0,
		end: 110,
		ticks: [0, 10, 32, 110],
		majorTicks: [0, 10, 110]
	},
	outFullRange: {
		start: 0,
		end: 100,
		ticks: [0, 10, 32, 100],
		majorTicks: [0, 10, 100]
	}
}, {
	in: { min: 0, max: 100, size: 50 },
	out: {
		start: 0,
		end: 110,
		ticks: [0, 5.2, 10, 18, 32, 57, 110],
		majorTicks: [0, 10, 110]
	},
	outFullRange: {
		start: 0,
		end: 100,
		ticks: [0, 5.2, 10, 18, 32, 57, 100],
		majorTicks: [0, 10, 100]
	}
}, {
	in: { min: 0, max: 100, size: 100 },
	out: {
		start: 0,
		end: 110,
		ticks: [0, 3.8, 5.2, 7.2, 10, 13, 18, 24, 32, 43, 57, 75, 110],
		majorTicks: [0, 10, 110]
	},
	outFullRange: {
		start: 0,
		end: 100,
		ticks: [0, 3.8, 5.2, 7.2, 10, 13, 18, 24, 32, 43, 57, 75, 100],
		majorTicks: [0, 10, 100]
	}
}, {
	in: { min: 87, max: 113, size: 50 },
	out: {
		start: 87,
		end: 114,
		ticks: [87, 93, 100, 110, 114],
		majorTicks: [87, 100, 114]
	},
	outFullRange: {
		start: 87,
		end: 113,
		ticks: [87, 93, 100, 110, 113],
		majorTicks: [87, 100, 113]
	}
}, {
	in: { min: 99, max: 101, size: 50 },
	out: {
		start: 99,
		end: 102,
		ticks: [99, 100, 102],
		majorTicks: [99, 100, 102]
	},
	outFullRange: {
		start: 99,
		end: 101,
		ticks: [99, 100, 101],
		majorTicks: [99, 100, 101]
	}
}];

const extraValues = {
	label: [''],
	group: [],
	isGroup: false,
	color: chalk.red,
	bgColor: chalk.green,
	siblings: [],
	hasExtraRow: false
};

describe('range', () => {
	data.forEach((datum) => {
		it(`should set range for ${ displayValue(datum.in) } and showFullRange is true`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}], true);

			scale.size = datum.in.size;

			assert.is(scale.start, datum.outFullRange.start);
			assert.is(scale.end, datum.outFullRange.end);
		});

		it(`should set range for ${ displayValue(datum.in) } and showFullRange is false`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}], false);

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
		}], false);

		scale.start = -25;
		scale.shouldGetStart = false;
		scale.size = 100;

		assert.is(scale.start, -25);
		assert.is(scale.end, 88);
	});

	it('should NOT reset the end if shouldGetEnd is false', () => {
		const scale = new LogScale([{
			value: 13,
			...extraValues
		}, {
			value: 87,
			...extraValues
		}], false);

		scale.end = 125;
		scale.shouldGetEnd = false;
		scale.size = 100;

		assert.is(scale.start, 13);
		assert.is(scale.end, 125);
	});
});

describe('ticks', () => {
	data.forEach((datum) => {
		it(`should set ticks for ${ displayValue(datum.in) } and showFullRange is true`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}], true);

			scale.size = datum.in.size;

			assert.equal(scale.ticks(), datum.outFullRange.ticks);
		});

		it(`should set ticks for ${ displayValue(datum.in) } and showFullRange is false`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}], false);

			scale.size = datum.in.size;

			assert.equal(scale.ticks(), datum.out.ticks);
		});
	});
});

describe('getCharOffset', () => {
	data.forEach((datum) => {
		it(`should set getCharOffset for ${ displayValue(datum.in) } and showFullRange is true`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}], true);

			scale.size = datum.in.size;

			assert.equal(scale.getCharOffset(datum.outFullRange.start), 1);
			assert.equal(scale.getCharOffset(datum.outFullRange.start, 1), 0.5);
			assert.equal(scale.getCharOffset(datum.outFullRange.end), datum.in.size);
			assert.equal(scale.getCharOffset(datum.outFullRange.end, 1), datum.in.size - 0.5);
		});

		it(`should set getCharOffset for ${ displayValue(datum.in) } and showFullRange is false`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}], false);

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
		it(`should set isMajorTick for ${ displayValue(datum.in) } and showFullRange is true`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}], true);

			scale.size = datum.in.size;

			scale.ticks();

			datum.outFullRange.ticks.forEach((tick) => {
				assert.is(scale.isMajorTick(tick), datum.outFullRange.majorTicks.includes(tick));
			});
		});

		it(`should set isMajorTick for ${ displayValue(datum.in) } and showFullRange is false`, () => {
			const scale = new LogScale([{
				value: datum.in.min,
				...extraValues
			}, {
				value: datum.in.max,
				...extraValues
			}], false);

			scale.size = datum.in.size;

			scale.ticks();

			datum.out.ticks.forEach((tick) => {
				assert.is(scale.isMajorTick(tick), datum.out.majorTicks.includes(tick));
			});
		});
	});
});
