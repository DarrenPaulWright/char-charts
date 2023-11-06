import { List } from 'hord';
import { isInteger } from 'type-enforcer';
import { integerDigits, round } from 'type-enforcer-math';
import type { INumericDomain } from '../types';
import ceil from '../utility/ceil.js';
import floor from '../utility/floor.js';
import Scale from './Scale.js';

export default class LogScale extends Scale {
	private _scaleValue = 0;

	private log(value: number): number {
		return value < 1 ? 1 : Math.log(value);
	}

	private mean(a: number, b: number): number {
		return Math.exp((this.log(a) + this.log(b)) / 2);
	}

	private snap(value: number): number {
		return Math.pow(10, integerDigits(value));
	}

	private snapEnd(value: number, diff: number): { offset: number; precision: number } {
		const digits = integerDigits(value);
		const precision = Math.max(1, digits - integerDigits(diff) + 2);

		if (this.showFullRange) {
			return { offset: 0, precision };
		}

		const offset = Math.min(value, Math.pow(10, digits - precision - 1));

		return { offset, precision };
	}

	private isTickBigEnough(a: number, b: number): boolean {
		return this.getCharOffset(b) - this.getCharOffset(a) >= this.minTickOffset;
	}

	private divideRange(rangeStart: number, rangeEnd: number, ticks: Array<number>): void {
		const mid = round(this.mean(rangeStart, rangeEnd), 2, 2);

		if (this.isTickBigEnough(rangeStart, mid)) {
			ticks.push(mid);

			this.divideRange(rangeStart, mid, ticks);
			this.divideRange(mid, rangeEnd, ticks);
		}
	}

	setRange(): void {
		const domain = this.domain as INumericDomain;
		const diff = domain[1] - domain[0];

		if (this.shouldGetStart) {
			const { precision } = this.snapEnd(domain[0], diff);

			this.start = floor(Math.max(0, domain[0]), 0, precision);
		}

		if (this.shouldGetEnd) {
			const { offset, precision } = this.snapEnd(domain[1], diff);

			this.end = ceil(domain[1] + offset, 0, precision);

			if (this.end < this.start) {
				const end = this.end;
				this.end = this.start;
				this.start = end;
			}
		}

		this._scaleValue = ((this.size - 1) / (this.log(this.end) - this.log(this.start))) || 1;
	}

	ticks(): Array<number> {
		const ticks = [];
		let pos = this.start;
		let currentTick = this.snap(this.start);

		while (!this.isTickBigEnough(this.start, currentTick)) {
			currentTick = this.snap(currentTick);
		}

		if (currentTick > this.end) {
			currentTick = this.end;
		}

		while (pos < this.end) {
			if (this.isTickBigEnough(pos, currentTick)) {
				if (this.isTickBigEnough(pos, this.end)) {
					ticks.push(pos);
					this.divideRange(pos, Math.min(currentTick, this.end), ticks);
				}

				pos = currentTick;
			}

			currentTick = this.snap(currentTick);
		}

		ticks.push(this.end);
		ticks.sort(List.comparers.default);

		return ticks;
	}

	isMajorTick(value: number): boolean {
		return value === 0 ||
			isInteger(Math.log10(value)) ||
			value === this.start ||
			value === this.end;
	}

	getCharOffset(value: number, desiredFractionDigits = 0): number {
		return round(
			((this.log(value) - this.log(this.start)) * this._scaleValue) + 0.5,
			desiredFractionDigits
		) ||
			round(0.5, desiredFractionDigits);
	}
}
