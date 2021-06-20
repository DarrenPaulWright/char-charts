import { compare, List } from 'hord';
import { abbrNumber, method } from 'type-enforcer-math';
import BandScale from './BandScale.js';
import LinearScale from './LinearScale.js';
import LogScale from './LogScale.js';

const TICK_OFFSETS_COMPARER = compare('offset');

const getScale = (scale) => {
	if (scale === 'log') {
		return LogScale;
	}
	else if (scale === 'band') {
		return BandScale;
	}

	return LinearScale;
};

export default class Axis {
	constructor(settings, data) {
		this.label(settings.label);

		this.ticks = new List().comparer(TICK_OFFSETS_COMPARER);
		this._tickOffsets = [];
		this._majorTickOffsets = [];

		this.scale(new (getScale(settings.scale))(data)
			.shouldGetTickValue(settings.tickValue === undefined)
			.shouldGetStart(settings.start === undefined)
			.shouldGetEnd(settings.end === undefined)
			.tickValue(settings.tickValue)
			.start(settings.start)
			.end(settings.end));
	}

	domain() {
		return this.scale().domain();
	}

	getCharOffset(offset, fractionDigits) {
		return this.scale().getCharOffset(offset, fractionDigits);
	}

	isTickOffset(offset) {
		return this._tickOffsets.includes(offset);
	}

	isMajorTick(offset) {
		return this._majorTickOffsets.includes(offset);
	}
}

Object.assign(Axis.prototype, {
	label: method.string(),
	size: method.integer({
		init: 0,
		set(size) {
			this.scale().size(size);

			this.ticks
				.values(this.scale().ticks().map((value) => {
					return {
						offset: this.scale().getCharOffset(value),
						label: abbrNumber(value),
						isMajor: this.scale().isMajorTick(value)
					};
				}));

			this._tickOffsets = this.ticks.map((item) => item.offset);
			this._majorTickOffsets = this.ticks
				.map((item) => item.isMajor ? item.offset : undefined)
				.filter(Boolean);
		}
	}),
	scale: method.any()
});
