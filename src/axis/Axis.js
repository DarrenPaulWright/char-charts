import { compare, List } from 'hord';
import { abbrNumber } from 'type-enforcer-math';
import BandScale from './BandScale.js';
import LinearScale from './LinearScale.js';
import LogScale from './LogScale.js';
const TICK_OFFSETS_COMPARER = compare('offset');
const getScale = (scale) => {
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
    tickOffsets = [];
    majorTickOffsets = [];
    label = '';
    scale;
    ticks = new List().comparer(TICK_OFFSETS_COMPARER);
    constructor(settings, data) {
        this.label = settings.label ?? '';
        this.scale = new (getScale(settings.scale))(data);
        this.scale.shouldGetTickValue = settings.tickValue === undefined;
        this.scale.shouldGetStart = settings.start === undefined;
        this.scale.shouldGetEnd = settings.end === undefined;
        this.scale.tickValue = settings.tickValue ?? 1;
        this.scale.start = settings.start ?? 0;
        this.scale.end = settings.end ?? 1;
    }
    get size() {
        return this.scale.size;
    }
    set size(size) {
        this.scale.size = size;
        const ticks = this.scale.ticks().map((value) => {
            return {
                offset: this.scale.getCharOffset(value),
                label: abbrNumber(value),
                isMajor: this.scale.isMajorTick(value)
            };
        });
        this.ticks.values(ticks);
        this.tickOffsets = ticks.map((item) => item.offset);
        this.majorTickOffsets = ticks
            .filter((item) => item.isMajor)
            .map((item) => item.offset);
    }
    domain() {
        return this.scale.domain;
    }
    getCharOffset(offset, fractionDigits) {
        return this.scale.getCharOffset(offset, fractionDigits);
    }
    isTickOffset(offset) {
        return this.tickOffsets.includes(offset);
    }
    isMajorTick(offset) {
        return this.majorTickOffsets.includes(offset);
    }
}
