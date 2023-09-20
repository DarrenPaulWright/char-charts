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
 * @param {object} settings - Settings object.
 * @param {string} [settings.title] - Title of the chart.
 *
 * @param {Array<object>} settings.data - The data to display.
 * @param {number[]} [settings.data[].data] - Use this or 'value'. If this is used, also provide the 'calc' setting.
 * @param {string} [settings.data[].label] - A display label.
 * @param {string[]} [settings.data[].group] - A group or groups that this datum belongs in.
 *
 * @param {object} [settings.xAxis] - All x-axis settings are optional. The scale auto adjust to fit the data except where a value is provided here.
 * @param {'linear' | 'log'} [settings.xAxis.scale=linear] - Options are 'linear' or 'log'.
 * @param {string} [settings.xAxis.label] - If provided, an extra row is returned with this label centered under the x-axis labels.
 * @param {number} [settings.xAxis.start] - The value on the left side of the chart.
 * @param {number} [settings.xAxis.end] - The value on the right side of the chart.
 * @param {number} [settings.xAxis.tickValue] - The value between each tick.
 *
 * @param {object} [settings.render] - Settings that effect the rendered look and feel.
 * @param {number} [settings.render.width=60] - Total width in characters, including y-axis labels.
 * @param {number} [settings.render.fractionDigits=0] - Number of fraction digits to display on inline labels.
 * @param {boolean} [settings.render.showInlineLabels=false] - Show a median label for each box. While labels try to fit in unused spaces, extra rows may be added if necessary.
 * @param {string} [settings.render.style='rounded'] - The style of characters used to generate the chart. Options are 'rounded', 'squared', 'doubled', or 'ascii'.
 * @param {string} [settings.render.colors='bright'] - Color pallete to use. Options are 'none', 'bright', 'dim', 'cool', 'passFail', 'blue', 'green', 'magenta', 'yellow', 'cyan', or 'red'.
 * @param {boolean} [settings.render.showDots=false] - Add a row with dots that represent data points.
 *
 * @returns {Array<string>} An array of strings, one string per row.
 */
export default (settings: ISettings): Array<string> => {
	return chart(superimpose({
		title: '',
		render: {
			width: 60,
			fractionDigits: 0,
			significantDigits: 0,
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
