import { List } from 'hord';
import { isInteger } from 'type-enforcer';
import { integerDigits, round } from 'type-enforcer-math';
import type { INumericDomain } from '../types';
import Scale from './Scale.js';

const log = (value: number): number => value === 0 ? 0 : Math.log(value);

const mean = (a: number, b: number): number => {
	return Math.exp((log(a) + log(b)) / 2);
};

const snap = (value: number, offset = 0): number => {
	return Math.pow(10, integerDigits(value) + offset);
};

export default class LogScale extends Scale {
	private _scaleValue = 0;

	private isBigEnough(a: number, b: number): boolean {
		return this.getCharOffset(b) - this.getCharOffset(a) > this.minTickOffset;
	}

	private divideRange(rangeStart: number, rangeEnd: number, ticks: Array<number>): void {
		const mid = round(mean(rangeStart, rangeEnd), 2, 2);

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
			snapped = snap(domain[0], -2);

			this.start = Math.floor(domain[0] / snapped) * snapped;
		}

		if (this.shouldGetEnd) {
			snapped = snap(domain[1], -2);

			this.end = Math.ceil(domain[1] / snapped) * snapped;
		}

		this._scaleValue = ((this.size - 1) / (log(this.end) - log(this.start))) || 1;
	}

	ticks(): Array<number> {
		const start = this.start;
		const end = this.end;
		const ticks = [];
		let pos = start;
		let tick = snap(start);

		while (!this.isBigEnough(start, tick)) {
			tick = snap(tick);
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

			tick = snap(tick);
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

	getCharOffset(value: number, fractionDigits = 0): number {
		return round(
			((log(value) - log(this.start)) * this._scaleValue) + 0.5,
			fractionDigits
		) ||
			round(0.5, fractionDigits);
	}
}
