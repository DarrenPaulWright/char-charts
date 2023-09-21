import { compare, List } from 'hord';
import { abbrNumber } from 'type-enforcer-math';
import type {
	IAxisSettings,
	IBandDomain,
	IChartDataInternal,
	INumericDomain,
	ITick
} from '../types';
import BandScale from './BandScale.js';
import LinearScale from './LinearScale.js';
import LogScale from './LogScale.js';

type Scales = LogScale | BandScale | LinearScale;
type ScaleTypes = typeof LogScale |
	typeof BandScale |
	typeof LinearScale;

const TICK_OFFSETS_COMPARER = compare('offset');

const getScale = (
	scale: IAxisSettings['scale']
): ScaleTypes => {
	switch (scale) {
		case 'log': {
			return LogScale;
		}

		case 'band': {
			return BandScale;
		}

		default: {
			return LinearScale;
		}
	}
};

export default class Axis {
	private tickOffsets: Array<number> = [];
	private majorTickOffsets: Array<number> = [];

	label = '';
	scale: Scales;
	ticks = new List().comparer(TICK_OFFSETS_COMPARER) as List;
	suffix = '';

	constructor(settings: IAxisSettings, data: Array<IChartDataInternal>) {
		this.label = settings.label ?? '';
		this.suffix = settings.suffix || '';

		this.scale = new (getScale(settings.scale))(data);
		this.scale.minTickOffset += settings.suffix?.length || 0;
		this.scale.shouldGetTickValue = settings.tickValue === undefined;
		this.scale.shouldGetStart = settings.start === undefined;
		this.scale.shouldGetEnd = settings.end === undefined;
		this.scale.tickValue = settings.tickValue ?? 1;
		this.scale.start = settings.start ?? 0;
		this.scale.end = settings.end ?? 1;
	}

	get size(): number {
		return this.scale.size;
	}

	set size(size: number) {
		this.scale.size = size;

		const ticks = this.scale.ticks().map((value) => {
			return {
				offset: this.scale.getCharOffset(value),
				label: abbrNumber(value, { precision: 3, suffix: this.suffix }),
				isMajor: this.scale.isMajorTick(value)
			};
		});

		this.ticks.values(ticks);

		this.tickOffsets = ticks.map((item: ITick) => item.offset);
		this.majorTickOffsets = ticks
			.filter((item: ITick) => item.isMajor)
			.map((item) => item.offset);
	}

	domain(): INumericDomain | Array<IBandDomain> {
		return this.scale.domain;
	}

	getCharOffset(offset: number, fractionDigits?: number): number {
		return this.scale.getCharOffset(offset, fractionDigits);
	}

	isTickOffset(offset: number): boolean {
		return this.tickOffsets.includes(offset);
	}

	isMajorTick(offset: number): boolean {
		return this.majorTickOffsets.includes(offset);
	}
}
