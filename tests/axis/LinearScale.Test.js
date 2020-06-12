import displayValue from 'display-value';
import { assert } from 'type-enforcer';
import LinearScale from '../../src/axis/LinearScale.js';

const data = [{
	in: { min: 0, max: 100, size: 10 },
	out: { tickValue: 100, start: 0, end: 100, ticks: [0, 100], majorTicks: [0, 100] }
}, {
	in: { min: 0, max: 100, size: 20 },
	out: { tickValue: 50, start: 0, end: 100, ticks: [0, 50, 100], majorTicks: [0, 100] }
}, {
	in: { min: 0, max: 100, size: 30 },
	out: { tickValue: 25, start: 0, end: 100, ticks: [0, 25, 50, 75, 100], majorTicks: [0, 100] }
}, {
	in: { min: 0, max: 100, size: 50 },
	out: { tickValue: 20, start: 0, end: 100, ticks: [0, 20, 40, 60, 80, 100], majorTicks: [0, 100] }
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
	out: { tickValue: 5, start: 85, end: 115, ticks: [85, 90, 95, 100, 105, 110, 115], majorTicks: [100] }
}, {
	in: { min: 99, max: 101, size: 50 },
	out: { tickValue: 0.5, start: 99, end: 101, ticks: [99, 99.5, 100, 100.5, 101], majorTicks: [100] }
}];

describe('LinearScale', () => {
	describe('range', () => {
		it('should accept an empty array', () => {
			const scale = new LinearScale([])
				.size(100);

			assert.is(scale.tickValue(), 0.1);
			assert.is(scale.start(), 0);
			assert.is(scale.end(), 1);
		});

		data.forEach((data) => {
			it(`should set range for input of ${displayValue(data.in)}`, () => {
				const scale = new LinearScale([{ value: data.in.min }, { value: data.in.max }])
					.size(data.in.size);

				assert.is(scale.tickValue(), data.out.tickValue);
				assert.is(scale.start(), data.out.start);
				assert.is(scale.end(), data.out.end);
			});
		});

		it('should NOT reset the tickValue if shouldGetTickValue is false', () => {
			const scale = new LinearScale([{ value: 13 }, { value: 87 }])
				.tickValue(25)
				.shouldGetTickValue(false)
				.size(100);

			assert.is(scale.tickValue(), 25);
			assert.is(scale.start(), 0);
			assert.is(scale.end(), 100);
		});

		it('should NOT reset the start if shouldGetStart is false', () => {
			const scale = new LinearScale([{ value: 13 }, { value: 87 }])
				.start(-25)
				.shouldGetStart(false)
				.size(100);

			assert.is(scale.tickValue(), 10);
			assert.is(scale.start(), -25);
			assert.is(scale.end(), 90);
		});

		it('should NOT reset the end if shouldGetEnd is false', () => {
			const scale = new LinearScale([{ value: 13 }, { value: 87 }])
				.end(125)
				.shouldGetEnd(false)
				.size(100);

			assert.is(scale.tickValue(), 10);
			assert.is(scale.start(), 10);
			assert.is(scale.end(), 125);
		});
	});

	describe('ticks', () => {
		data.forEach((data) => {
			it(`should set ticks for input of ${displayValue(data.in)}`, () => {
				const scale = new LinearScale([{ value: data.in.min }, { value: data.in.max }])
					.size(data.in.size);

				assert.equal(scale.ticks(), data.out.ticks);
			});
		});
	});

	describe('getCharOffset', () => {
		data.forEach((data) => {
			it(`should set getCharOffset for input of ${displayValue(data.in)}`, () => {
				const scale = new LinearScale([{ value: data.in.min }, { value: data.in.max }])
					.size(data.in.size);

				assert.equal(scale.getCharOffset(data.out.start), 1);
				assert.equal(scale.getCharOffset(data.out.start, 1), 0.5);
				assert.equal(scale.getCharOffset(data.out.end), data.in.size);
				assert.equal(scale.getCharOffset(data.out.end, 1), data.in.size + 0.5);
			});
		});
	});

	describe('isMajorTick', () => {
		data.forEach((data) => {
			it(`should set isMajorTick for input of ${displayValue(data.in)}`, () => {
				const scale = new LinearScale([{ value: data.in.min }, { value: data.in.max }])
					.size(data.in.size);

				scale.ticks();

				data.out.majorTicks.forEach((tick) => {
					assert.is(scale.isMajorTick(tick), true);
				});
			});
		});
	});
});
