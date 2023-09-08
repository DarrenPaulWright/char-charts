import { List } from 'hord';
import { isInteger } from 'type-enforcer';
import { integerDigits, round } from 'type-enforcer-math';
import Scale from './Scale.js';
const log = (value) => value === 0 ? 0 : Math.log(value);
const mean = (a, b) => {
    return Math.exp((log(a) + log(b)) / 2);
};
const snap = (value, offset = 0) => {
    return Math.pow(10, integerDigits(value) + offset);
};
export default class LogScale extends Scale {
    _scaleValue = 0;
    isBigEnough(a, b) {
        return this.getCharOffset(b) - this.getCharOffset(a) > this.minTickOffset;
    }
    divideRange(rangeStart, rangeEnd, ticks) {
        const mid = round(mean(rangeStart, rangeEnd), 2, 2);
        if (this.isBigEnough(rangeStart, mid)) {
            ticks.push(mid);
            this.divideRange(rangeStart, mid, ticks);
            this.divideRange(mid, rangeEnd, ticks);
        }
    }
    setRange() {
        let snapped = 0;
        const domain = this.domain;
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
    ticks() {
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
    isMajorTick(value) {
        return value === 0 ||
            isInteger(Math.log10(value)) ||
            value === this.start ||
            value === this.end;
    }
    getCharOffset(value, fractionDigits = 0) {
        return round(((log(value) - log(this.start)) * this._scaleValue) + 0.5, fractionDigits) ||
            round(0.5, fractionDigits);
    }
}
