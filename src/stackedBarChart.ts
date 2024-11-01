import { superimpose } from 'object-agent';
import { SPACE } from './render/chars.js';
import Chart from './render/Chart.js';
import type { DeepRequired, ISettings } from './types';

class StackedBarChart extends Chart {
	preProcessRow(): void {
		this.rowData.value ||= [0];
	}

	renderRow(): Array<string> {
		const rowData = this.rowData;

		const output: Array<string> = this.buildPreviousLabelRows();

		this.reset();

		if (!rowData.isGroup) {
			let sumValue = 0;
			const totalStacks = (rowData.value as Array<number>)
				.reduce((result, value) => value ? result + 1 : result, 0);

			(rowData.value as Array<number>)
				.forEach((value, index) => {
					if (value) {
						const remainingStacks = totalStacks - (index + 1);
						sumValue += value;
						const barWidth = Math.min(
							this.xAxis.size - remainingStacks,
							Math.max(
								this.getCharOffset(sumValue),
								this.length + 1
							)
						);

						const color = this.settings.colors[index % this.settings.colors.length];

						this.padEnd(
							barWidth,
							(this.settings.useColor && this.settings.colors.length > 1) ?
								this.CHARS.BAR_FILL[0] :
								this.CHARS.BAR_FILL[index % this.CHARS.BAR_FILL.length],
							color
						);
					}
				});
		}

		this.padEnd(this.xAxis.size, SPACE)
			.prependLabel(false);

		output.push(this.toString());

		if (this.rowData.hasExtraRow) {
			this.reset();

			output.push(this.padEnd(
					this.xAxis.size,
					SPACE,
					this.BOX_COLOR
				)
				.prependLabel(true)
				.toString());
		}

		return output;
	}
}

/**
 * Builds a stacked bar chart.
 *
 * ```text
 *                         Test chart
 * Fruit     ╭────────┬─────────┬─────────┬─────────┬─────────╮
 *   Oranges ████▒▒▒▒▒▒▒▒░░░░░░░░░░░░████████       │         │
 *    Apples ██████▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░██████████   │
 *     Pears ████████▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░██████████         │
 * Nuts      │        ╵         │         ╵         │         │
 *    Almond ████▒▒▒▒▒▒▒▒░░░░░░░░░░░░████████       │         │
 *    Peanut ██████▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░██████████   │
 *           ╰────────┴─────────┼─────────┴─────────┼─────────╯
 *           0        5        10        15        20        25
 * ```
 *
 * @function stackedBarChart
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
 * @param {string} [settings.render.colors='bright'] - Color palette to use. Options are 'none', 'bright', 'dim', 'cool', 'passFail', 'blue', 'green', 'magenta', 'yellow', 'cyan', or 'red'.
 * @param {boolean} [settings.render.extraRowSpacing=false] - Add an extra row between each data row.
 * @param {'asc' | 'desc'} [settings.render.sortLabels] - Sort the data by label.
 *
 * @returns {Array<string>} An array of strings, one string per row.
 */
export default (settings: ISettings): Array<string> => {
	return new StackedBarChart(superimpose({
		title: '',
		render: {
			width: 60,
			maxYAxisWidth: 20,
			fractionDigits: 0,
			significantDigits: 0,
			showInlineLabels: false,
			showDots: false,
			style: 'rounded',
			colors: 'bright',
			extraRowSpacing: false
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
	}) as DeepRequired<ISettings>).render();
};
