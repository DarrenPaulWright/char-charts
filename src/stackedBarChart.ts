import { superimpose } from 'object-agent';
import { SPACE } from './render/chars.js';
import chart from './render/chart.js';
import Row from './render/Row.js';
import type { DeepRequired, IBandDomain, ISettings } from './types';

class BarRow extends Row {
	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	preProcess(rowData: IBandDomain): void {
		rowData.value ||= [0];
	}

	render(rowData: IBandDomain): Array<string> {
		this.prepRender(rowData);
		this.reset();

		if (!rowData.isGroup) {
			let sumValue = 0;

			(rowData.value as Array<number>)
				.forEach((value, index) => {
					if (value) {
						const isInitial = sumValue === 0;
						sumValue += value;
						const barWidth = this.getCharOffset(sumValue);
						const color = this.settings.colors[index % this.settings.colors.length];
						const isFinal = barWidth === this.settings.xAxis.size &&
							(this.settings.useColor && this.settings.colors.length > 1);

						if (isInitial) {
							this.append(
								(sumValue === this.settings.xAxis.scale.start) ?
									this.getVerticalChar(1) :
									(barWidth >= 1 ?
										this.CHARS.BAR_HALF_RIGHT :
										this.CHARS.BAR_SINGLE),
								color
							);
						}

						this.padEnd(
							isFinal ? barWidth - 1 : barWidth,
							(this.settings.useColor && this.settings.colors.length > 1) ?
								this.CHARS.BAR_FILL[0] :
								this.CHARS.BAR_FILL[index % this.CHARS.BAR_FILL.length],
							color
						);

						if (isFinal) {
							this.append(this.CHARS.BAR_HALF_LEFT, color);
						}
					}
				});
		}

		this.padEnd(this.settings.xAxis.size, SPACE)
			.prependLabel(false);

		return [this.toString()];
	}
}

/**
 * Builds a stacked bar chart.
 *
 * ```text
 *                         Test chart
 * Fruit     ╭────────┬─────────┬─────────┬─────────┬─────────╮
 *   Oranges ▐███▒▒▒▒▒▒▒▒░░░░░░░░░░░░████████       │         │
 *    Apples ▐█████▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░██████████   │
 *     Pears ▐███████▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░██████████         │
 * Nuts      │        ╵         │         ╵         │         │
 *    Almond ▐███▒▒▒▒▒▒▒▒░░░░░░░░░░░░████████       │         │
 *    Peanut ▐█████▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░██████████   │
 *           ╰────────┴─────────┼─────────┴─────────┼─────────╯
 *           0        5        10        15        20        25
 * ```
 *
 * @function barChart
 *
 * @param {object} [settings] - Settings object.
 * @param {string} [settings.title] - Title of the chart.
 * @param {number} [settings.width=40] - Total width in characters, including y-axis labels.
 * @param {number} [settings.fractionDigits=0] - Number of fraction digits to display on inline labels.
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
export default (settings: ISettings): Array<string> => {
	return chart(superimpose({
		title: '',
		render: {
			width: 40,
			fractionDigits: 0,
			showInlineLabels: false,
			showDots: false,
			style: 'rounded',
			colors: 'bright'
		},
		calc: null,
		data: [],
		xAxis: {
			start: 0
		}
	}, settings, {
		render: {
			showInlineLabels: false
		},
		calc: null
	}) as DeepRequired<ISettings>, BarRow);
};
