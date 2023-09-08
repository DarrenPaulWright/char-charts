import chalk from 'chalk';
import { INDENT_WIDTH, SPACE } from './chars.js';
export default class Row {
    _length = 0;
    prevLabel = '';
    _string = '';
    isGroup = false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    rowData;
    settings;
    CHARS;
    BOX_COLOR = chalk.grey.dim;
    constructor(settings) {
        this.settings = settings;
        this.CHARS = settings.CHARS;
    }
    cap(leftChar, tickChar, tickCharMajor, rightChar, label = '') {
        const last = this.settings.xAxis.ticks.length - 1;
        return label.concat(this.colorize(this.settings.xAxis.ticks
            .reduce((result, value, index) => {
            return index === 0 ?
                leftChar :
                result
                    .padEnd(value.offset - 1, this.CHARS.CHART_HORIZONTAL)
                    .concat(index === last ?
                    rightChar :
                    (value.isMajor ?
                        tickCharMajor :
                        tickChar));
        }, '')
            .padStart(this.settings.width - label.length, SPACE), this.BOX_COLOR));
    }
    colorize(string, color) {
        return this.settings.useColor ?
            (color ? color(string) : string) :
            string;
    }
    get length() {
        return this._length;
    }
    prepRender(rowData) {
        this.rowData = rowData;
        this.isGroup = rowData.isGroup;
    }
    reset() {
        this._string = '';
        this._length = 0;
        return this;
    }
    getCharOffset(value, fractionDigits) {
        return this.settings.xAxis.getCharOffset(value, fractionDigits);
    }
    prepend(string, color) {
        this._string = this.colorize(string, color) + this._string;
        this._length += string.length;
        return this;
    }
    append(string, color) {
        this._string += this.colorize(string, color);
        this._length += string.length;
        return this;
    }
    getVerticalChar(offset) {
        return this.settings.xAxis.isMajorTick(offset) ?
            this.CHARS.CHART_VERTICAL_MAJOR :
            this.CHARS.CHART_VERTICAL_MINOR;
    }
    padEnd(endIndex, char, color) {
        const rounded = Math.ceil(endIndex);
        if (char === SPACE) {
            for (let index = this.length + 1; index <= rounded; index++) {
                this.append(this.settings.xAxis.isTickOffset(index) ?
                    this.getVerticalChar(index) :
                    char, this.BOX_COLOR);
            }
        }
        else {
            this._string += this.colorize(char.repeat(Math.max(0, rounded - this._length)), color);
        }
        this._length = Math.ceil(endIndex);
        return this;
    }
    prependLabel(skip, color) {
        if (skip || this.rowData.label === this.prevLabel) {
            this.prepend(SPACE.repeat(this.settings.yAxis.scale.maxLabelWidth));
        }
        else if (this.isGroup) {
            this.prepend((this.rowData.groupIndent ?
                this.CHARS.GROUP_HEADER_FILL
                    .repeat((this.rowData.groupIndent * INDENT_WIDTH) - 1)
                    .concat(SPACE) :
                '')
                .concat(this.rowData.label)
                .padEnd(this.settings.yAxis.scale.maxLabelWidth, SPACE), color);
        }
        else {
            this.prepend(this.rowData.label.concat(SPACE)
                .padStart(this.settings.yAxis.scale.maxLabelWidth, SPACE), color);
        }
        if (!skip) {
            this.prevLabel = this.rowData.label;
        }
        return this;
    }
    title() {
        return this.settings.title
            .padStart(this.settings.width + this.settings.title.length >>> 1, SPACE)
            .padEnd(this.settings.width, SPACE);
    }
    bottomLabels() {
        const last = this.settings.xAxis.ticks.length - 1;
        return this.settings.xAxis.ticks
            .reduce((result, value, index) => {
            return result
                .padEnd(value.offset - (index === last ?
                value.label.length :
                Math.floor(value.label.length / 2) + 1))
                .concat(value.label);
        }, '')
            .padStart(this.settings.width, SPACE);
    }
    xAxisLabel() {
        return this.settings.xAxis.label
            .padStart(this.settings.width -
            Math.ceil((this.settings.xAxis.size - this.settings.xAxis.label.length) / 2), SPACE)
            .padEnd(this.settings.width, SPACE);
    }
    top() {
        return this.cap(this.CHARS.CHART_TOP_LEFT, this.CHARS.CHART_TOP_TICK, this.CHARS.CHART_TOP_TICK, this.CHARS.CHART_TOP_RIGHT, this.settings.yAxis.scale.isGrouped() ?
            this.settings.yAxis.domain()[0].label :
            '');
    }
    bottom() {
        return this.cap(this.CHARS.CHART_BOTTOM_LEFT, this.CHARS.CHART_BOTTOM_TICK, this.CHARS.CHART_BOTTOM_TICK_MAJOR, this.CHARS.CHART_BOTTOM_RIGHT);
    }
    toString() {
        return `${this._string}`;
    }
}
