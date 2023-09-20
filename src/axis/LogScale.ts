import { List } from 'hord';
import { isInteger } from 'type-enforcer';
import { integerDigits, round } from 'type-enforcer-math';
import type { INumericDomain } from '../types';
import Scale from './Scale.js';

export default class LogScale extends Scale {
	private _scaleValue = 0;

	private log(value: number): number {
		return value <= 0 ? 0 : Math.log(value);
	}

	private mean(a: number, b: number): number {
		return Math.exp((this.log(a) + this.log(b)) / 2);
	}

	private snap(value: number, offset = 0): number {
		return Math.pow(10, integerDigits(value) + offset);
	}

	private isBigEnough(a: number, b: number): boolean {
		return this.getCharOffset(b) - this.getCharOffset(a) > this.minTickOffset;
	}

	private divideRange(rangeStart: number, rangeEnd: number, ticks: Array<number>): void {
		const mid = round(this.mean(rangeStart, rangeEnd), 2, 2);

		if (this.isBigEnough(rangeStart, mid)) {
			ticks.push(mid);

			this.divideRange(rangeStart, mid, ticks);
			this.divideRange(mid, rangeEnd, ticks);
		}
	}

	setRange(): void {
		let snapped = 0;
		const domain = this.domain as INumericDomain;

		if (this.shouldGetStart) {
			snapped = this.snap(domain[0], -2);

			this.start = Math.floor(domain[0] / snapped) * snapped;
		}

		if (this.shouldGetEnd) {
			snapped = this.snap(domain[1], -2);

			this.end = Math.ceil(domain[1] / snapped) * snapped;

			if (this.end < this.start) {
				const end = this.end;
				this.end = this.start;
				this.start = end;
			}
		}

		this._scaleValue = ((this.size - 1) / (this.log(this.end) - this.log(this.start))) || 1;
	}

	ticks(): Array<number> {
		const start = this.start;
		const end = this.end;
		const ticks = [];
		let pos = start;
		let tick = this.snap(start);

		while (!this.isBigEnough(start, tick)) {
			tick = this.snap(tick);
		}

		if (tick > end) {
			tick = end;
		}

		while (pos < end) {
			if (this.isBigEnough(pos, tick)) {
				if (this.isBigEnough(pos, end)) {
					ticks.push(pos);
					this.divideRange(pos, Math.min(tick, end), ticks);
				}

				pos = tick;
			}

			tick = this.snap(tick);
		}

		ticks.push(end);
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
