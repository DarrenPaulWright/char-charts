import { fill } from 'object-agent';
import { integerDigits, isInteger, round } from 'type-enforcer-math';
import Scale from './Scale.js';

const ADJUSTMENTS = [1, 2, 4, 5];

export default class LinearScale extends Scale {
	range() {
		let prev = {};
		const minValue = this.domain()[0];
		const maxValue = this.domain()[1];
		let tickValue = this.tickValue();
		let start = this.start();
		let end = this.end();
		let size = this.size();
		let adjLength = ADJUSTMENTS.length;

		const setScale = () => {
			this._scaleValue = size / (end - start);
		};

		const optimizeRange = (pos, origTickValue, origStart, origEnd) => {
			prev = {
				tickValue: tickValue,
				start: start,
				end: end
			};

			tickValue = origTickValue /
				(ADJUSTMENTS[++pos % adjLength] *
					Math.pow(10, Math.floor(pos / adjLength)));

			if (this.shouldGetStart()) {
				start = origStart + Math.floor((minValue - origStart) / tickValue) * tickValue;
			}

			if (this.shouldGetEnd()) {
				end = origEnd - Math.floor((origEnd - maxValue) / tickValue) * tickValue;
			}

			setScale();

			if ((tickValue * this._scaleValue) < this.minTickOffset || pos > 100) {
				tickValue = prev.tickValue;
				start = prev.start;
				end = prev.end;
				setScale();
			}
			else {
				optimizeRange(pos, origTickValue, origStart, origEnd);
			}
		};

		if (this.shouldGetTickValue()) {
			tickValue = Math.pow(10, integerDigits(maxValue - minValue));
		}

		if (this.shouldGetStart()) {
			start = Math.floor(minValue / tickValue) * tickValue;
		}

		if (this.shouldGetEnd()) {
			end = Math.ceil(maxValue / tickValue) * tickValue;
		}

		setScale();

		if (this.shouldGetTickValue()) {
			optimizeRange(0, tickValue, start, end);
		}

		this.tickValue(tickValue)
			.start(start)
			.end(end);
	}

	ticks() {
		const start = this.start();
		const end = this.end();
		const tickValue = this.tickValue();
		const ticks = fill(Math.round((end - start) / tickValue) + 1, (index) => {
			return index * tickValue + start;
		});

		this._majorTickValue = Math.pow(10, integerDigits(end) - 1);

		return ticks;
	}

	isMajorTick(value) {
		return isInteger(value / this._majorTickValue);
	}

	getCharOffset(value, fractionDigits = 0) {
		return round(((value - this.start()) * this._scaleValue) + 0.4999999999, fractionDigits) || round(0.5, fractionDigits);
	}
}
