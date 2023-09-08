import { fill } from 'object-agent';
import { isInteger } from 'type-enforcer';
import { integerDigits, round } from 'type-enforcer-math';
import type { INumericDomain } from '../types';
import Scale from './Scale.js';

export default class LinearScale extends Scale {
	private readonly ADJUSTMENTS = [1, 2, 4, 5];
	private majorTickValue = 0;
	private scaleValue = 0;

	private setScale(): void {
		this.scaleValue = (this.size - 1) / (this.end - this.start);
	}

	private optimizeRange(
		pos: number,
		origTickValue: number,
		origStart: number,
		origEnd: number
	): void {
		const position = pos + 1;
		const domain = this.domain as INumericDomain;
		const previous = {
			tickValue: this.tickValue,
			start: this.start,
			end: this.end
		};

		this.tickValue = origTickValue /
			(this.ADJUSTMENTS[position % this.ADJUSTMENTS.length] *
				Math.pow(10, Math.floor(position / this.ADJUSTMENTS.length)));

		if (this.shouldGetStart) {
			this.start = origStart +
				(Math.floor((domain[0] - origStart) / this.tickValue) * this.tickValue);
		}

		if (this.shouldGetEnd) {
			this.end = origEnd -
				(Math.floor((origEnd - domain[1]) / this.tickValue) * this.tickValue);
		}

		this.setScale();

		if ((this.tickValue * this.scaleValue) < this.minTickOffset || position > 100) {
			this.tickValue = previous.tickValue;
			this.start = previous.start;
			this.end = previous.end;
			this.setScale();
		}
		else {
			this.optimizeRange(position, origTickValue, origStart, origEnd);
		}
	}

	setRange(): void {
		const domain = this.domain as INumericDomain;

		if (this.shouldGetTickValue) {
			this.tickValue = Math.pow(10, integerDigits(domain[1] - domain[0]));
		}

		if (this.shouldGetStart) {
			this.start = Math.floor(domain[0] / this.tickValue) * this.tickValue;
		}

		if (this.shouldGetEnd) {
			this.end = Math.ceil(domain[1] / this.tickValue) * this.tickValue;
		}

		this.setScale();

		if (this.shouldGetTickValue) {
			this.optimizeRange(0, this.tickValue, this.start, this.end);
		}
	}

	ticks(): Array<number> {
		const ticks = fill(
			Math.round((this.end - this.start) / this.tickValue) + 1,
			(index: number) => {
				return (index * this.tickValue) + this.start;
			}
		);

		this.majorTickValue = Math.pow(10, integerDigits(this.end) - 1);

		return ticks as Array<number>;
	}

	isMajorTick(value: number): boolean {
		return isInteger(value / this.majorTickValue) ||
			value === this.start ||
			value === this.end;
	}

	getCharOffset(value: number, fractionDigits = 0): number {
		return round(((value - this.start) * this.scaleValue) + 0.51, fractionDigits) ||
			round(0.5, fractionDigits);
	}
}
