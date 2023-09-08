import { fill } from 'object-agent';
import { isInteger } from 'type-enforcer';
import { integerDigits, round } from 'type-enforcer-math';
import Scale from './Scale.js';
export default class LinearScale extends Scale {
    ADJUSTMENTS = [1, 2, 4, 5];
    majorTickValue = 0;
    scaleValue = 0;
    setScale() {
        this.scaleValue = (this.size - 1) / (this.end - this.start);
    }
    optimizeRange(pos, origTickValue, origStart, origEnd) {
        const position = pos + 1;
        const domain = this.domain;
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
    setRange() {
        const domain = this.domain;
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
    ticks() {
        const ticks = fill(Math.round((this.end - this.start) / this.tickValue) + 1, (index) => {
            return (index * this.tickValue) + this.start;
        });
        this.majorTickValue = Math.pow(10, integerDigits(this.end) - 1);
        return ticks;
    }
    isMajorTick(value) {
        return isInteger(value / this.majorTickValue) ||
            value === this.start ||
            value === this.end;
    }
    getCharOffset(value, fractionDigits = 0) {
        return round(((value - this.start) * this.scaleValue) + 0.51, fractionDigits) ||
            round(0.5, fractionDigits);
    }
}
