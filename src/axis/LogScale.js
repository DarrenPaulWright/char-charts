import { List } from 'hord';
import { integerDigits, isInteger, round } from 'type-enforcer-math';
import Scale from './Scale.js';

const log = (value) => value === 0 ? 0 : Math.log(value);

const mean = (a, b) => {
	return Math.exp((log(a) + log(b)) / 2);
};

const snap = (value, offset = 0) => {
	return Math.pow(10, integerDigits(value) + offset);
};

export default class LogScale extends Scale {
	range() {
		let snapped = 0;

		if (this.shouldGetStart()) {
			snapped = snap(this.domain()[0], -2);

			this.start(Math.floor(this.domain()[0] / snapped) * snapped);
		}

		if (this.shouldGetEnd()) {
			snapped = snap(this.domain()[1], -2);

			this.end(Math.ceil(this.domain()[1] / snapped) * snapped);
		}

		this._scaleValue = (this.size() / (log(this.end()) - log(this.start()))) || 1;
	}

	ticks() {
		const start = this.start();
		const end = this.end();
		const ticks = [];
		let pos = start;
		let tick = snap(start);

		const isBigEnough = (a, b) => {
			return this.getCharOffset(b) - this.getCharOffset(a) > this.minTickOffset;
		};

		const divideRange = (start, end) => {
			const mid = round(mean(start, end), 2, 2);

			if (isBigEnough(start, mid)) {
				ticks.push(mid);

				divideRange(start, mid);
				divideRange(mid, end);
			}
		};

		while (!isBigEnough(start, tick)) {
			tick = snap(tick);
		}

		if (tick > end) {
			tick = end;
		}

		while (pos < end) {
			if (isBigEnough(pos, tick)) {
				if (isBigEnough(pos, end)) {
					ticks.push(pos);
					divideRange(pos, Math.min(tick, end));
				}

				pos = tick;
			}
			tick = snap(tick);
		}

		ticks.push(end);
		ticks.sort(List.comparers.default);

		return ticks;
	}

	isMajorTick(value) {
		return value === 0 || isInteger(Math.log10(value));
	}

	getCharOffset(value, fractionDigits = 0) {
		return round(((log(value) - log(this.start())) * this._scaleValue) + 0.4999999999, fractionDigits) || round(0.5, fractionDigits);
	}
}
