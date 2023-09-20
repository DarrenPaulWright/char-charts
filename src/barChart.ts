import { superimpose } from 'object-agent';
import { SPACE } from './render/chars.js';
import chart from './render/chart.js';
import printValue from './render/printValue.js';
import Row from './render/Row.js';
import type { DeepRequired, IBandDomain, ISettings } from './types';

class BarRow extends Row {
	private readonly MIN_BAR_REMAINING = 3;
	private label = '';
	private barWidth = 0;

	private finishBar(): void {
		if (this.barWidth > 1) {
			this.padEnd(
				Math.floor(this.barWidth),
				this.CHARS.BAR_FILL[0],
				this.rowData.color
			);

			if (this.barWidth % 1 === 0.5) {
				this.append(this.CHARS.BAR_HALF_LEFT, this.rowData.color);
			}
		}
	}

	private renderBarWithoutInsetLabel(): void {
		this.finishBar();

		if (this.settings.showInlineLabels) {
			this
				.padEnd(this.length + 2, SPACE)
				.append(this.label, this.rowData.color);
		}
	}

	private renderBarWithInsetLabel(): void {
		if (this.settings.useColor && this.settings.style !== 'ascii') {
			this.padEnd(
					this.barWidth - this.label.length - this.MIN_BAR_REMAINING,
					this.CHARS.BAR_FILL[0],
					this.rowData.color
				)
				.append(this.label, this.rowData.bgColor);
		}
		else {
			this.padEnd(
					this.barWidth - this.label.length - this.MIN_BAR_REMAINING - 2,
					this.CHARS.BAR_FILL[0],
					this.rowData.color
				)
				.append(
					(this.settings.style === 'ascii') ?
						` ${ this.label } ` :
						this.CHARS.BAR_HALF_LEFT + this.label + this.CHARS.BAR_HALF_RIGHT,
					(this.settings.style === 'ascii') ?
						this.rowData.color :
						this.rowData.bgColor
				);
		}

		this.finishBar();
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	preProcess(rowData: IBandDomain): void {
		rowData.value ||= 0;
	}

	render(rowData: IBandDomain): Array<string> {
		this.prepRender(rowData);

		this.label = this.isGroup ?
			'' :
			printValue(rowData.value as number, this.settings);

		this.barWidth = Math.round(this.getCharOffset(rowData.value as number, 1) * 2) / 2;

		this.reset()
			.append(
				rowData.value === this.settings.xAxis.scale.start ?
					this.getVerticalChar(1) :
					(this.barWidth >= 1 ?
						this.CHARS.BAR_HALF_RIGHT :
						this.CHARS.BAR_SINGLE),
				this.isGroup ? this.BOX_COLOR : rowData.color
			);

		if (
			!this.settings.showInlineLabels ||
			this.barWidth + this.label.length + this.MIN_BAR_REMAINING < this.settings.xAxis.size
		) {
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
 *                         Test chart
 * Fruit      ┌───────┬───────┬───────┬───────┬───────┬───────┐
 *    Oranges ▐       ╵       ╵       ╵       ╵       │       │
 *     Apples ▐███▌   ╵       ╵       ╵       ╵       │       │
 *      Pears ▐███████╵       ╵       ╵       ╵       │       │
 *   Apricots ▐████████████████████▌  ╵       ╵       │       │
 *    Peaches ▐███████████████████████████████████████████████▌
 * Nuts       │       ╵       ╵       ╵       ╵       │       │
 *     Almond ▐▌      ╵       ╵       ╵       ╵       │       │
 *     Peanut ▐       ╵       ╵       ╵       ╵       │       │
 *      Pecan │       ╵       ╵       ╵       ╵       │       │
 *            └───────┴───────┴───────┴───────┴───────┼───────┘
 *            0      20      40      60      80      100    120
 *                              Satisfaction
 * ```
 *
 * @function barChart
 *
 * @param {object} settings - Settings object.
 * @param {string} [settings.title] - Title of the chart.
 *
 * @param {Array<object>} settings.data - The data to display.
 * @param {number[]} [settings.data[].value] - Use this or 'data'. If this is used, also provide the 'calc' setting.
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
			showInlineLabels: true,
			showDots: false,
			style: 'rounded',
			colors: 'bright'
		},
		calc: null,
		data: [],
		xAxis: {
			start: 0,
			suffix: ''
		}
	}, settings) as DeepRequired<ISettings>, BarRow);
};
