import { superimpose } from 'object-agent';
import { SPACE } from './render/chars.js';
import chart from './render/chart.js';
import printValue from './render/printValue.js';
import Row from './render/Row.js';
class BarRow extends Row {
    MIN_BAR_REMAINING = 3;
    label = '';
    barWidth = 0;
    finishBar() {
        if (this.barWidth > 1) {
            this.padEnd(Math.floor(this.barWidth), this.CHARS.BAR_FILL, this.rowData.color);
            if (this.barWidth % 1 === 0.5) {
                this.append(this.CHARS.BAR_HALF_LEFT, this.rowData.color);
            }
        }
    }
    renderBarWithoutInsetLabel() {
        this.finishBar();
        if (this.settings.showInlineLabels) {
            this
                .padEnd(this.length + 2, SPACE)
                .append(this.label, this.rowData.color);
        }
    }
    renderBarWithInsetLabel() {
        if (this.settings.useColor && this.settings.style !== 'ascii') {
            this.padEnd(this.barWidth - this.label.length - this.MIN_BAR_REMAINING, this.CHARS.BAR_FILL, this.rowData.color)
                .append(this.label, this.rowData.bgColor);
        }
        else {
            this.padEnd(this.barWidth - this.label.length - this.MIN_BAR_REMAINING - 2, this.CHARS.BAR_FILL, this.rowData.color)
                .append((this.settings.style === 'ascii') ?
                ` ${this.label} ` :
                this.CHARS.BAR_HALF_LEFT + this.label + this.CHARS.BAR_HALF_RIGHT, (this.settings.style === 'ascii') ?
                this.rowData.color :
                this.rowData.bgColor);
        }
        this.finishBar();
    }
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    preProcess(rowData) {
        rowData.value ||= 0;
    }
    render(rowData) {
        this.prepRender(rowData);
        this.label = this.isGroup ?
            '' :
            printValue(rowData.value, this.settings.fractionDigits);
        this.barWidth = Math.round(this.getCharOffset(rowData.value, 1) * 2) / 2;
        this.reset()
            .append(rowData.value === this.settings.xAxis.scale.start ?
            this.getVerticalChar(1) :
            (this.barWidth >= 1 ?
                this.CHARS.BAR_HALF_RIGHT :
                this.CHARS.BAR_SINGLE), this.isGroup ? this.BOX_COLOR : rowData.color);
        if (!this.settings.showInlineLabels ||
            this.barWidth + this.label.length + this.MIN_BAR_REMAINING < this.settings.xAxis.size) {
            this.renderBarWithoutInsetLabel();
        }
        else {
            this.renderBarWithInsetLabel();
        }
        this.padEnd(this.settings.xAxis.size, SPACE)
            .prependLabel(false, this.isGroup ? undefined : rowData.color);
        return [this.toString()];
    }
}
/**
 * Builds a bar chart.
 *
 * ```text
 *                Test chart
 *   ╭──────┬───────┬──────┬───────┬──────╮
 * A ▐████████████████████████████ ╵77.63 │
 * B ▐█▌97.00▐███████████████████████████▌│
 * C ▐███▌  13.00   ╵      ╵       ╵      │
 * D ┃  0.15╵       ╵      ╵       ╵      │
 * E ▐▌  2.00       ╵      ╵       ╵      │
 *   ╰──────┴───────┴──────┴───────┴──────╯
 *   0     20      40     60      80    100
 *                     Hz
 * ```
 *
 * @function barChart
 *
 * @param {object} [settings] - Settings object.
 * @param {string} [settings.title] - Title of the chart.
 * @param {number.int} [settings.width=40] - Total width in characters, including y-axis labels.
 * @param {number.int} [settings.fractionDigits=0] - Number of fraction digits to display on inline labels.
 * @param {number.int} [settings.showInlineLabels=true] - Show a value label for each bar.
 * @param {boolean} [settings.ascii=false] - Use only ascii characters.
 * @param {string} [settings.calc] - Options are 'min', 'max', 'mean', and 'median'. Only use if data objects have a 'data' property instead of 'value'.
 * @param {object} [settings.xAxis] - All x-axis settings are optional. The scale auto adjust to fit the data except where a value is provided here.
 * @param {object} [settings.xAxis.scale=linear] - Options are 'linear' or 'log'.
 * @param {object} [settings.xAxis.label] - If provided, an extra row is returned with this label centered under the x-axis labels.
 * @param {number} [settings.xAxis.start] - The value on the left side of the chart.
 * @param {number} [settings.xAxis.end] - The value on the right side of the chart.
 * @param {number} [settings.xAxis.tickValue] - The value between each tick.
 * @param {Array.<object>} [settings.data] - The data for the chart.
 * @param {number[]} [settings.data[].data] - Use this or 'value'. If this is used, also provide the 'calc' setting.
 * @param {number} [settings.data[].value] - The numeric value.
 * @param {string} [settings.data[].label] - A display label.
 * @param {string[]} [settings.data[].group] - A group that this datum belongs in.
 *
 * @returns {Array} An array of strings, one string per row.
 */
export default (settings) => {
    return chart(superimpose({
        title: '',
        render: {
            width: 40,
            fractionDigits: 0,
            showInlineLabels: true,
            showDots: false,
            style: 'rounded',
            colors: 'bright'
        },
        calc: null,
        data: [],
        xAxis: {}
    }, settings), BarRow);
};
