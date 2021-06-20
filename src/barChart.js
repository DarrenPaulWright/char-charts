import { superimpose } from 'object-agent';
import { SPACE } from './render/chars.js';
import chart from './render/chart.js';
import printValue from './render/printValue.js';
import Row from './render/Row.js';

class BarRow extends Row {
	render(rowData) {
		rowData.value = rowData.value || 0;
		const inlineLabel = 'groupIndent' in rowData ? '' : printValue(rowData.value, this._fractionDigits);
		const barWidth = Math.round(this.getCharOffset(rowData.value, 3) * 2) / 2;

		this._string = rowData.value === this._xAxis.scale().start() ?
			this.getVerticalChar(1) :
			(barWidth >= 1 ?
				this.BAR_HALF_RIGHT :
				this.BAR_SINGLE);

		const finishBar = () => {
			const floor = Math.floor(barWidth);

			this.padEnd(barWidth - 1, this.BAR_FILL);

			if (barWidth > 1 && barWidth - floor === 0.5) {
				this.append(this.BAR_HALF_LEFT);
			}
		};

		if (!this._showInlineLabels || barWidth + inlineLabel.length + 2 < this._xAxis.size()) {
			finishBar();

			if (this._showInlineLabels) {
				this
					.padEnd(this.length + 2, SPACE)
					.append(inlineLabel);
			}
		}
		else {
			if (this._useColor) {
				this.padEnd(barWidth - inlineLabel.length - 2, this.BAR_FILL)
					.append(inlineLabel);
			}
			else {
				this.padEnd(2, this.BAR_FILL)
					.append((this._settings.ascii ? ' ' : this.BAR_HALF_LEFT) + inlineLabel + (this._settings.ascii ? ' ' : this.BAR_HALF_RIGHT));
			}

			finishBar();
		}

		this.padEnd(this._xAxis.size(), SPACE)
			.prependLabel(rowData);

		return this.toString();
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
 * @param {number.int} [settings.width=40] - Total width in characters, including y axis labels.
 * @param {number.int} [settings.fractionDigits=0] - Number of fraction digits to display on inline labels.
 * @param {number.int} [settings.showInlineLabels=true] - Show a value label for each bar.
 * @param {boolean} [settings.ascii=false] - Use only ascii characters.
 * @param {string} [settings.calc] - Options are 'min', 'max', 'mean', and 'median'. Only use if data objects have a 'data' property instead of 'value'.
 * @param {object} [settings._xAxis] - All x axis settings are optional. The scale auto adjust to fit the data except where a value is provided here.
 * @param {object} [settings._xAxis.scale=linear] - Options are 'linear' or 'log'.
 * @param {object} [settings._xAxis.label] - If provided, an extra row is returned with this label centered under the x axis labels.
 * @param {number} [settings._xAxis.start] - The value on the left side of the chart.
 * @param {number} [settings._xAxis.end] - The value on the right side of the chart.
 * @param {number} [settings._xAxis.tickValue] - The value between each tick.
 * @param {Array.<object>} [settings.data] - The data for the chart.
 * @param {number[]} [settings.data[].data] - Use this or 'value'. If this is used, also provide the 'calc' setting.
 * @param {number} [settings.data[].value] - The numeric value.
 * @param {string} [settings.data[].label] - A display label.
 * @param {string[]} [settings.data[].group] - A group that this datum belongs in.
 *
 * @returns {Array} An array of strings, one string per row.
 */
export default (settings) => {
	settings = superimpose({
		width: 40,
		fractionDigits: 0,
		showInlineLabels: true,
		data: [{
			label: 'undefined',
			value: 0
		}],
		xAxis: {}
	}, settings);

	return chart(settings, BarRow);
};
