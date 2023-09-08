import { compare, List } from 'hord';
import { superimpose } from 'object-agent';
import { SPACE } from './render/chars.js';
import chart from './render/chart.js';
import printValue from './render/printValue.js';
import Row from './render/Row.js';
const MEDIAN_PREFIX = 'μ½: ';
class BoxRow extends Row {
    dotScale = 1;
    constructor(settings) {
        super(settings);
        const maxDataLength = settings.data.reduce((max, datum) => {
            return Math.max(max, datum.data?.length || 0);
        }, 0);
        this.dotScale = Math.max(1, maxDataLength / (Math.sqrt(settings.xAxis.size) * (settings.CHARS.DOTS.length / 3)));
    }
    // PreProcess
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    hasDot(rowData, low, high) {
        return Boolean(rowData?.dotsOffsets) &&
            rowData.dotsOffsets.length !== 0 &&
            rowData.dotsOffsets.some((dot) => (dot >= low) && (dot <= high));
    }
    // PreProcess
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    hasLabel(rowData, low, high, ignoreTypes) {
        return rowData.placedLabels.findIndex((item) => {
            return item.low <= high &&
                item.high >= low &&
                (ignoreTypes === undefined || !ignoreTypes.includes(item.relation));
        }) !== -1;
    }
    // PreProcess
    // eslint-disable-next-line max-params
    placeLabelIfFitsOnRow(rowData, targetRowData, label, low, relation, isDots = false, ignoreTypes = []) {
        if (low > 0 && !rowData.isInlineLabelPlaced && targetRowData.offsets !== undefined) {
            const high = low + label.length - 1;
            if ((low > 0 && high <= this.settings.xAxis.size) &&
                (isDots ||
                    high < targetRowData.offsets.min ||
                    low > targetRowData.offsets.max + 1) &&
                !this.hasLabel(targetRowData, low, high, ignoreTypes) &&
                !this.hasDot(targetRowData, low, high)) {
                rowData.isInlineLabelPlaced = true;
                targetRowData.placedLabels.push({
                    label,
                    low,
                    high,
                    relation,
                    color: rowData.color
                });
            }
        }
    }
    // PreProcess
    // eslint-disable-next-line max-params
    placeLabelMulti(rowData, targetRowData, label, arrows, offset, relations) {
        const rightLabel = arrows[0] + label;
        const leftLabel = label + arrows[1];
        this.placeLabelIfFitsOnRow(rowData, targetRowData, rightLabel, offset, relations, this.settings.showDots);
        this.placeLabelIfFitsOnRow(rowData, targetRowData, leftLabel, offset - leftLabel.length + 1, relations, this.settings.showDots);
    }
    // PreProcess
    buildBoxOffsets(rowData) {
        if (rowData && !rowData.offsets) {
            // If ('median' in rowData) {
            rowData.offsets = {
                min: this.getCharOffset(rowData.min),
                Q1: this.getCharOffset(rowData.Q1),
                median: this.getCharOffset(rowData.median),
                Q3: this.getCharOffset(rowData.Q3),
                max: this.getCharOffset(rowData.max)
            };
            const offsets = rowData.offsets;
            if (offsets.Q3 - offsets.Q1 > 0) {
                offsets.median = Math.round(this.getCharOffset(rowData.median, 2) - 0.5);
            }
            if (offsets.median === offsets.max) {
                offsets.median--;
            }
            if (offsets.Q3 - offsets.Q1 > 1) {
                if (offsets.Q3 - offsets.median === 0) {
                    offsets.median--;
                }
                else if (offsets.median - offsets.Q1 < 0) {
                    offsets.median++;
                }
            }
            // }
            // Else {
            // 	RowData.offsets = {
            // 		Min: this.settings.xAxis.size,
            // 		Max: 1
            // 	};
            // }
            rowData.placedLabels = [];
            rowData.outliers = new List(rowData.outliers || []);
            rowData.dotsOffsets = new List(rowData.data ?
                rowData.data.map((value) => this.getCharOffset(value)) :
                []);
            rowData.hasExtraRow = false;
        }
    }
    // PreProcess
    buildLabel(value) {
        return value ?
            MEDIAN_PREFIX + printValue(value, this.settings.fractionDigits) :
            '';
    }
    // PreProcess
    placeLabels() {
        const rowData = this.rowData;
        const nextRow = rowData.siblings[1];
        if (this.settings.showInlineLabels) {
            if (!rowData.isInlineLabelPlaced && rowData.median && !rowData.isGroup) {
                const medianLabel = this.buildLabel(rowData.median);
                const thisMedianOffset = rowData.offsets.median + 1;
                if (this.settings.showDots) {
                    this.placeLabelMulti(rowData, rowData, medianLabel, [this.CHARS.ARROW_LEFT_DOWN, this.CHARS.ARROW_RIGHT_DOWN], thisMedianOffset, 'sameRowDots');
                }
                if (nextRow) {
                    this.placeLabelMulti(rowData, nextRow, medianLabel, [this.CHARS.ARROW_LEFT_UP, this.CHARS.ARROW_RIGHT_UP], thisMedianOffset, 'prevRow');
                }
                for (let index = 2; index < 5 && !rowData.isInlineLabelPlaced; index++) {
                    this.placeLabelIfFitsOnRow(rowData, rowData, this.CHARS.ARROW_LEFT + medianLabel, rowData.offsets.max + index, 'sameRow', false, this.settings.showDots ? ['prevRow'] : []);
                }
                for (let index = 1; index < 4 && !rowData.isInlineLabelPlaced; index++) {
                    const label = medianLabel + this.CHARS.ARROW_RIGHT;
                    this.placeLabelIfFitsOnRow(rowData, rowData, label, rowData.offsets.min - label.length - index, 'sameRow', false, this.settings.showDots ? ['prevRow'] : []);
                }
                if (!rowData.isInlineLabelPlaced) {
                    const length = medianLabel.length + this.CHARS.ARROW_LEFT_UP.length;
                    if (thisMedianOffset + length < this.settings.xAxis.size + 2) {
                        rowData.hasExtraRow = true;
                        rowData.placedLabels.push({
                            label: this.CHARS.ARROW_LEFT_UP + medianLabel,
                            low: thisMedianOffset,
                            high: thisMedianOffset + length - 1,
                            relation: 'extraRow',
                            color: rowData.color
                        });
                    }
                    else {
                        rowData.hasExtraRow = true;
                        rowData.placedLabels.push({
                            label: medianLabel + this.CHARS.ARROW_RIGHT_UP,
                            low: thisMedianOffset - length,
                            high: thisMedianOffset,
                            relation: 'extraRow',
                            color: rowData.color
                        });
                    }
                }
            }
            // If (!this.settings.showDots && nextRow !== undefined && !nextRow.isInlineLabelPlaced) {
            if (nextRow !== undefined &&
                !nextRow.isInlineLabelPlaced &&
                (!this.isGroup || rowData.siblings[0]) &&
                !nextRow.isGroup) {
                this.placeLabelMulti(nextRow, rowData, this.buildLabel(nextRow.median || 0), [this.CHARS.ARROW_LEFT_DOWN, this.CHARS.ARROW_RIGHT_DOWN], nextRow.offsets.median + 1, 'nextRow');
            }
        }
    }
    padEndWithDots(endIndex, skipDots, color) {
        for (let index = this.length + 1; index <= endIndex; index++) {
            const dotSize = skipDots ?
                0 :
                Math.ceil(this.rowData.dotsOffsets.findAll(index).length / this.dotScale);
            if (dotSize > 0) {
                this.append(this.CHARS.DOTS.charAt(Math.min(dotSize, this.CHARS.DOTS.length) - 1), color);
            }
            else {
                this.append(this.settings.xAxis.isTickOffset(index) ?
                    this.getVerticalChar(index) :
                    SPACE, this.BOX_COLOR);
            }
        }
        return this;
    }
    padEndWithLabels(endIndex, char, relations = [], skipDots = false) {
        if (char === SPACE) {
            if (this.rowData?.placedLabels) {
                const labels = this.rowData.placedLabels
                    .filter((label) => {
                    return label.low >= this.length &&
                        label.high <= endIndex &&
                        (relations.length === 0 || relations.includes(label.relation)) &&
                        (!this.rowData.hasExtraRow || skipDots || label.relation === 'prevRow');
                })
                    .sort(compare('low'));
                labels.forEach((label) => {
                    this.padEndWithDots(label.low - 1, skipDots, this.rowData.color)
                        .append(label.label, label.color);
                });
                this.rowData.placedLabels = this.rowData.placedLabels
                    .filter((item) => !labels.includes(item));
            }
            this.padEndWithDots(endIndex, skipDots, this.rowData.color);
        }
        else {
            this.padEnd(endIndex, char, this.rowData.color);
        }
        return this;
    }
    buildExtraRow(skipDots) {
        this.reset();
        return this.padEndWithLabels(this.settings.xAxis.size, SPACE, skipDots ?
            ['extraRow', 'nextRow'] :
            ['prevRow', 'sameRowDots'], skipDots)
            .prependLabel(true, this.isGroup ? undefined : this.rowData.color)
            .toString();
    }
    preProcess(rowData) {
        this.prepRender(rowData);
        this.buildBoxOffsets(rowData);
        this.buildBoxOffsets(rowData.siblings[1]);
        this.placeLabels();
    }
    render(rowData) {
        this.prepRender(rowData);
        const output = [];
        if (this.settings.showDots && !this.isGroup) {
            output.push(this.buildExtraRow(false));
        }
        this.reset();
        if (rowData.data !== undefined) {
            this.padEndWithLabels(rowData.offsets.min - 1, SPACE);
            if (rowData.data.length === 1) {
                this.append(this.CHARS.WHISKER_SINGLE, rowData.color);
            }
            else if (rowData.offsets.max === rowData.offsets.min) {
                if (rowData.median - rowData.Q1 > rowData.Q3 - rowData.median) {
                    this.append(this.CHARS.Q1_FILL, rowData.color);
                }
                else {
                    this.append(this.CHARS.Q3_FILL, rowData.color);
                }
            }
            else {
                if (rowData.offsets.min !== rowData.offsets.Q1) {
                    this.append(this.CHARS.WHISKER_START, rowData.color)
                        .padEndWithLabels(rowData.offsets.Q1 - 1, this.CHARS.WHISKER_LINE);
                }
                this.padEndWithLabels(rowData.offsets.median, this.CHARS.Q1_FILL)
                    .padEndWithLabels(rowData.offsets.Q3, this.CHARS.Q3_FILL);
                if (rowData.offsets.Q3 !== rowData.offsets.max) {
                    this.padEndWithLabels(rowData.offsets.max - 1, this.CHARS.WHISKER_LINE)
                        .append(this.CHARS.WHISKER_END, rowData.color);
                }
            }
        }
        this.padEndWithLabels(this.settings.xAxis.size, SPACE)
            .prependLabel(false, this.isGroup ? undefined : rowData.color);
        output.push(this.toString());
        if (rowData.placedLabels.length !== 0) {
            output.push(this.buildExtraRow(true));
        }
        return output;
    }
}
/**
 * Builds a box and whisker chart.
 *
 * ```text
 *                Test chart
 *   ╭──────┬───────┬──────┬───────┬──────╮
 * A │      ·       ╵  ┣━━━━━━━▒▒▒▒▒▒▒▒▓━┫│
 * B │    ╭─ M: 13.00      ╵M: 90.00 ─╯  ▒▓
 * C ┣━▒▒▒▓▓▓━┫     ╵      ╵   M: 97.00 ─╯│
 * D ▒ ── M: 0.15   ╵      ╵       ╵      │
 * E ┃ ── M: 2.00   ╵      ╵       ╵      │
 *   ╰──────┴───────┴──────┴───────┴──────╯
 *   0     20      40     60      80    100
                    Hz
 * ```
 *
 * @function boxChart
 *
 * @param {object} [settings] - Settings object.
 * @param {string} [settings.title] - Title of the chart.
 * @param {number.int} [settings.width=40] - Total width in characters, including y-axis labels.
 * @param {number.int} [settings.fractionDigits=0] - Number of fraction digits to display on inline labels.
 * @param {number.int} [settings.showInlineLabels=false] - Show a median label for each box. While labels try to fit in unused spaces, extra rows may be added if necessary.
 * @param {boolean} [settings.ascii=false] - Use only ascii characters.
 * @param {boolean} [settings.useColor=false] - Use colors for each row.
 * @param {boolean} [settings.showDots=false] - Add a row with dots that represent data points.
 * @param {object} [settings.xAxis] - All x-axis settings are optional. The scale auto adjust to fit the data except where a value is provided here.
 * @param {object} [settings.xAxis.scale=linear] - Options are 'linear' or 'log'.
 * @param {object} [settings.xAxis.label] - If provided, an extra row is returned with this label centered under the x-axis labels.
 * @param {number} [settings.xAxis.start] - The value on the left side of the chart.
 * @param {number} [settings.xAxis.end] - The value on the right side of the chart.
 * @param {number} [settings.xAxis.tickValue] - The value between each tick.
 * @param {Array.<object>} [settings.data] - The data to display.
 * @param {number[]} [settings.data[].data] - Use this or 'value'. If this is used, also provide the 'calc' setting.
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
        data: [{
                label: 'undefined',
                data: [0]
            }],
        calc: null,
        xAxis: {}
    }, settings, {
        calc: 'quartiles'
    }), BoxRow);
};
