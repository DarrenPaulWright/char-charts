import { compare, List } from 'hord';
import { superimpose } from 'object-agent';
import { SPACE } from './render/chars.js';
import chart from './render/chart.js';
import printValue from './render/printValue.js';
import Row from './render/Row.js';

const MEDIAN_PREFIX = 'M: ';
const PREV_ROW = 'prev';
const SAME_ROW = 'same';
const SAME_ROW_DOTS = 'sameDots';
const NEXT_ROW = 'next';
const EXTRA_ROW = 'extra';

class BoxRow extends Row {
	constructor(settings) {
		super(settings);

		this._showDots = settings.showDots;

		const maxDataLength = settings.data.reduce((max, value) => {
			return Math.max(max, value.data.length);
		}, 0);

		this.dotScale = Math.max(1, maxDataLength / (Math.sqrt(this._xAxis.size()) * (settings.CHARS.DOTS.length / 3)));
	}

	addWhiteSpace(value, skipDots = false) {
		for (let i = this.length + 1; i <= value; i++) {
			const num = skipDots || !this.rowData ? 0 : this.getDotIndex(this.rowData.dotsOffsets.findAll(i).length);

			if (num > 0) {
				this.append(this.DOTS.charAt(Math.min(num, this.DOTS.length) - 1));
			}
			else {
				this.append(this._xAxis.isTickOffset(i) ? this.getVerticalChar(i) : SPACE);
			}
		}

		return this;
	}

	hasDot(data, low, high, key) {
		return data && data[key] && data[key].length > 0 &&
			data[key].some((dot) => dot >= low && dot <= high);
	}

	hasLabel(rowData, low, high, isDots, ignoreTypes) {
		return rowData.placedLabels.findIndex((item) => {
			return item.low < high - 1 &&
				item.high > low - 1 &&
				item.relation !== SAME_ROW &&
				(ignoreTypes === undefined || !ignoreTypes.includes(item.relation));
		}) !== -1;
	}

	canPlaceLabel(dataRow, placementRow, label, low, relation, isDots = false, ignoreTypes) {
		if (!dataRow.isInlineLabelPlaced && placementRow.offsets !== undefined) {
			let high = low + label.length - 1;

			if (low < 0) {
				high = -low;
				low = high - label.length + 1;
			}

			if ((low > 0 && high < this._xAxis.size() + 1) &&
				(isDots || high < placementRow.offsets.min || low > placementRow.offsets.max + 1) &&
				!this.hasLabel(placementRow, low, high, isDots, ignoreTypes) &&
				!this.hasDot(placementRow, low, high, isDots ? 'dotsOffsets' : 'outliers')) {

				dataRow.isInlineLabelPlaced = true;

				placementRow.placedLabels.push({
					label: label,
					low: low,
					high: high,
					relation: relation
				});
			}
		}
	}

	padEnd(value, char, types, skipDots) {
		if (char === SPACE) {
			const low = this.length - 1;

			if (this.rowData && this.rowData.placedLabels) {
				const labels = this.rowData.placedLabels
					.filter((label) => {
						return label.low > low && label.high < value + 1 &&
							(types.length === 0 || types.includes(label.relation)) &&
							(!this.rowData.hasExtraRow || skipDots || label.relation === PREV_ROW);
					})
					.sort(compare('low'));

				labels
					.forEach((label) => {
						this.addWhiteSpace(label.low - 1, skipDots)
							.append(label.label);
					});

				this.rowData.placedLabels = this.rowData.placedLabels.filter((item) => !labels.includes(item));
			}

			this.addWhiteSpace(value, skipDots);
		}
		else {
			super.padEnd(value, char);
		}

		return this;
	}

	checkOffsets(data) {
		if (data && !data.offsets) {
			if ('median' in data) {
				const offsets = data.offsets = {
					min: this.getCharOffset(data.min),
					Q1: this.getCharOffset(data.Q1),
					median: this.getCharOffset(data.median),
					Q3: this.getCharOffset(data.Q3),
					max: this.getCharOffset(data.max)
				};

				if (offsets.Q3 - offsets.Q1 > 0) {
					offsets.median = Math.round(this.getCharOffset(data.median, 2) - 0.5);
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
			}
			else {
				data.offsets = {
					min: this._xAxis.size(),
					max: 1
				};
			}

			data.placedLabels = [];
			data.outliers = new List(data.outliers || []);
			data.dotsOffsets = new List(data.data ? data.data.map((value) => this.getCharOffset(value)) : []);
			data.hasExtraRow = false;
		}
	}

	buildLabel(value) {
		return MEDIAN_PREFIX + printValue(value, this._fractionDigits);
	}

	placeLabels() {
		const rowData = this.rowData;
		const next = rowData.siblings[1];
		const showDots = this._showDots === true;

		this.checkOffsets(next);

		if (this._showInlineLabels === true) {
			if (!rowData.isInlineLabelPlaced && rowData.median) {
				const medianLabel = this.buildLabel(rowData.median);
				const thisMedianOffset = rowData.offsets.median + 1;

				if (showDots) {
					this.canPlaceLabel(rowData, rowData, this.ARROW_LEFT_DOWN + medianLabel, thisMedianOffset, SAME_ROW_DOTS, true);

					this.canPlaceLabel(rowData, rowData, medianLabel + this.ARROW_RIGHT_DOWN, thisMedianOffset - (medianLabel.length + this.ARROW_RIGHT_DOWN.length), SAME_ROW_DOTS, true);
				}

				if (next) {
					this.canPlaceLabel(rowData, next, this.ARROW_LEFT_UP + medianLabel, thisMedianOffset, PREV_ROW, showDots);

					this.canPlaceLabel(rowData, next, medianLabel + this.ARROW_RIGHT_UP, -thisMedianOffset + 1, PREV_ROW, showDots);
				}

				for (let i = 2; i < 5 && !rowData.isInlineLabelPlaced; i++) {
					this.canPlaceLabel(rowData, rowData, this.ARROW_LEFT + medianLabel, rowData.offsets.max + i, SAME_ROW, false, this._showDots ? [PREV_ROW] : []);
				}

				for (let i = 2; i < 5 && !rowData.isInlineLabelPlaced; i++) {
					this.canPlaceLabel(rowData, rowData, medianLabel + this.ARROW_RIGHT, -rowData.offsets.min + i, SAME_ROW, false, this._showDots ? [PREV_ROW] : []);
				}

				if (!rowData.isInlineLabelPlaced) {
					const length = medianLabel.length + this.ARROW_LEFT_UP.length;

					if (thisMedianOffset + length < this._xAxis.size() + 2) {
						rowData.hasExtraRow = true;

						rowData.placedLabels.push({
							label: this.ARROW_LEFT_UP + medianLabel,
							low: thisMedianOffset,
							high: thisMedianOffset + length - 1,
							relation: EXTRA_ROW
						});
					}
					else {
						rowData.hasExtraRow = true;

						rowData.placedLabels.push({
							label: medianLabel + this.ARROW_RIGHT_UP,
							low: thisMedianOffset - length,
							high: thisMedianOffset,
							relation: EXTRA_ROW
						});
					}
				}
			}

			if (!showDots && next !== undefined && !next.isInlineLabelPlaced) {
				const nextLabel = this.buildLabel(next.median);
				const nextMedianOffset = next.offsets.median + 1;

				this.canPlaceLabel(next, rowData, this.ARROW_LEFT_DOWN + nextLabel, nextMedianOffset, NEXT_ROW);

				this.canPlaceLabel(next, rowData, nextLabel + this.ARROW_RIGHT_DOWN, -nextMedianOffset + 1, NEXT_ROW);
			}
		}
	}

	getDotIndex(value) {
		return Math.ceil(value / this.dotScale);
	}

	buildExtraRow(skipDots) {
		this._string = '';

		return this.padEnd(
			this._xAxis.size(),
			SPACE,
			skipDots ? [EXTRA_ROW, NEXT_ROW] : [PREV_ROW, SAME_ROW_DOTS],
			skipDots
			)
			.prependLabel(this.rowData)
			.toString();
	}

	render(rowData) {
		this.rowData = rowData;
		this.checkOffsets(rowData);
		this.placeLabels();

		const output = [];
		const offsets = rowData.offsets;

		if (this._showDots === true && rowData.data !== undefined) {
			output.push(this.buildExtraRow(false));
		}

		this._string = '';

		if (rowData.data !== undefined) {
			this.padEnd(offsets.min - 1, SPACE, []);

			if (rowData.data.length === 1) {
				this.append(this.WHISKER_SINGLE);
			}
			else if (offsets.max === offsets.min) {
				if (rowData.median - rowData.Q1 > rowData.Q3 - rowData.median) {
					this.append(this.Q1_FILL);
				}
				else {
					this.append(this.Q3_FILL);
				}
			}
			else {
				if (offsets.min !== offsets.Q1) {
					this.append(this.WHISKER_START)
						.padEnd(offsets.Q1 - 1, this.WHISKER_LINE);
				}

				this.padEnd(offsets.median, this.Q1_FILL)
					.padEnd(offsets.Q3, this.Q3_FILL);

				if (offsets.Q3 !== offsets.max) {
					this.padEnd(offsets.max - 1, this.WHISKER_LINE)
						.append(this.WHISKER_END);
				}
			}
		}

		this.padEnd(this._xAxis.size(), SPACE, [])
			.prependLabel(rowData);

		output.push(this.toString());

		if (this.rowData.placedLabels.length !== 0) {
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
 * @param {Object} [settings]
 * @param {int} [settings.width=40] - Total width in characters, including y axis labels
 * @param {int} [settings.fractionDigits=0] - Number of fraction digits to display on inline labels
 * @param {int} [settings.showInlineLabels=false] - Show a median label for each box. While labels try to fit in unused spaces, extra rows my be added if necessary.
 * @param {boolean} [settings.ascii=false] - Use only ascii characters
 * @param {boolean} [settings.showDots=false] - Add a row with dots that represent data points
 * @param {Object} [settings._xAxis] - All x axis settings are optional. The scale auto adjust to fit the data except where a value is provided here.
 * @param {Object} [settings._xAxis.scale=linear] - options are 'linear' or 'log'
 * @param {Object} [settings._xAxis.label] - If provided, an extra row is returned with this label centered under the x axis labels
 * @param {Number} [settings._xAxis.start] - The value on the left side of the chart
 * @param {Number} [settings._xAxis.end] - The value on the right side of the chart
 * @param {Number} [settings._xAxis.tickValue] - The value between each tick
 * @param {Array.<Object>} [settings.data]
 * @param {Number[]} [settings.data[].data] - Use this or 'value'. If this is used, also provide the 'calc' setting.
 * @param {String} [settings.data[].label]
 * @param {String[]} [settings.data[].group]
 *
 * @returns {Array} An array of strings, one string per row.
 */
export default (settings) => {
	settings = superimpose({
		width: 40,
		fractionDigits: 0,
		showInlineLabels: false,
		data: [{
			label: 'undefined',
			data: [0]
		}],
		xAxis: {}
	}, settings, {
		calc: 'quartiles'
	});

	return chart(settings, BoxRow);
};
