import type chalk from 'chalk';
import { compare, List } from 'hord';
import { superimpose } from 'object-agent';
import { SPACE } from './render/chars.js';
import chart from './render/chart.js';
import printValue from './render/printValue.js';
import Row from './render/Row.js';
import type {
	DeepRequired,
	IBandDomain,
	IPlacedLabel,
	ISettings,
	ISettingsInternal
} from './types';

const MEDIAN_PREFIX = 'Mdn: ';

class BoxRow extends Row {
	private dotScale = 1;

	constructor(settings: ISettingsInternal) {
		super(settings);

		const maxDataLength = settings.data.reduce((max, datum) => {
			return Math.max(max, datum.data?.length || 0);
		}, 0);

		this.dotScale = Math.max(
			1,
			maxDataLength / (
				Math.sqrt(settings.xAxis.size) * (settings.CHARS.DOTS.length / 3)
			)
		);
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	private hasDot(
		rowData: IBandDomain,
		low: number,
		high: number
	): boolean {
		return Boolean(rowData?.dotsOffsets) &&
			rowData.dotsOffsets!.length !== 0 &&
			rowData.dotsOffsets!.some((dot: number) => (dot >= low) && (dot <= high));
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	private hasLabel(
		rowData: IBandDomain,
		low: number,
		high: number,
		ignoreTypes: Array<string>
	): boolean {
		return rowData.placedLabels!.findIndex((item) => {
			return item.low <= high + 1 &&
				item.high >= low - 1 &&
				(ignoreTypes === undefined || !ignoreTypes.includes(item.relation));
		}) !== -1;
	}

	// eslint-disable-next-line max-params
	private placeLabelIfFitsOnRow(
		rowData: IBandDomain,
		targetRowData: IBandDomain,
		label: string,
		low: number,
		relation: IPlacedLabel['relation'],
		isDots = false,
		ignoreTypes: Array<string> = []
	): void {
		if (low > 0 && !rowData.isInlineLabelPlaced && targetRowData.offsets !== undefined) {
			const high = low + label.length - 1;

			if (
				(low > 0 && high <= this.settings.xAxis.size) &&
				(
					isDots ||
					high < targetRowData.offsets.min ||
					low > targetRowData.offsets.max + 1
				) &&
				!this.hasLabel(targetRowData, low, high, ignoreTypes) &&
				(targetRowData.hasExtraRow || !this.hasDot(targetRowData, low, high))
			) {
				rowData.isInlineLabelPlaced = true;

				targetRowData.placedLabels!.push({
					label,
					low,
					high,
					relation,
					color: rowData.color
				});
			}
		}
	}

	// eslint-disable-next-line max-params
	private placeLabelMulti(
		rowData: IBandDomain,
		targetRowData: IBandDomain,
		label: string,
		arrows: [string, string],
		offset: number,
		relations: IPlacedLabel['relation']
	): void {
		const rightLabel = arrows[0] + label;
		const leftLabel = label + arrows[1];

		this.placeLabelIfFitsOnRow(
			rowData,
			targetRowData,
			rightLabel,
			offset,
			relations,
			this.settings.showDots
		);

		this.placeLabelIfFitsOnRow(
			rowData,
			targetRowData,
			leftLabel,
			offset - leftLabel.length + 1,
			relations,
			this.settings.showDots
		);
	}

	private buildBoxOffsets(rowData: IBandDomain): void {
		if (rowData && !rowData.offsets) {
			// If ('median' in rowData) {
			rowData.offsets = {
				min: this.getCharOffset(rowData.min!),
				Q1: this.getCharOffset(rowData.Q1!),
				median: this.getCharOffset(rowData.median!),
				Q3: this.getCharOffset(rowData.Q3!),
				max: this.getCharOffset(rowData.max!)
			};
			const offsets = rowData.offsets;

			if (offsets.Q3 - offsets.Q1 > 0) {
				offsets.median = Math.round(this.getCharOffset(rowData.median!, 2) - 0.5);
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
			rowData.dotsOffsets = new List(
				rowData.data ?
					rowData.data.map((value: number) => this.getCharOffset(value)) :
					[]
			);
			rowData.hasExtraRow = false;
		}
	}

	private buildLabel(value: number): string {
		return value ?
			MEDIAN_PREFIX + printValue(value, this.settings) :
			'';
	}

	private placeLabels(): void {
		const rowData = this.rowData;
		const nextRow = rowData.siblings[1];

		if (this.settings.showInlineLabels) {
			if (!rowData.isInlineLabelPlaced && rowData.median && !rowData.isGroup) {
				const medianLabel = this.buildLabel(rowData.median);
				const thisMedianOffset = rowData.offsets!.median + 1;

				if (this.settings.showDots) {
					this.placeLabelMulti(
						rowData,
						rowData,
						medianLabel,
						[this.CHARS.ARROW_LEFT_DOWN, this.CHARS.ARROW_RIGHT_DOWN],
						thisMedianOffset,
						'sameRowDots'
					);
				}

				if (nextRow) {
					this.placeLabelMulti(
						rowData,
						nextRow,
						medianLabel,
						[this.CHARS.ARROW_LEFT_UP, this.CHARS.ARROW_RIGHT_UP],
						thisMedianOffset,
						'prevRow'
					);
				}

				for (let index = 2; index < 5 && !rowData.isInlineLabelPlaced; index++) {
					this.placeLabelIfFitsOnRow(
						rowData,
						rowData,
						this.CHARS.ARROW_LEFT + medianLabel,
						rowData.offsets!.max + index,
						'sameRow',
						false,
						this.settings.showDots ? ['prevRow'] : []
					);
				}

				for (let index = 1; index < 4 && !rowData.isInlineLabelPlaced; index++) {
					const label = medianLabel + this.CHARS.ARROW_RIGHT;

					this.placeLabelIfFitsOnRow(
						rowData,
						rowData,
						label,
						rowData.offsets!.min - label.length - index,
						'sameRow',
						false,
						this.settings.showDots ? ['prevRow'] : []
					);
				}

				if (!rowData.isInlineLabelPlaced) {
					const length = medianLabel.length + this.CHARS.ARROW_LEFT_UP.length;

					if (thisMedianOffset + length < this.settings.xAxis.size + 2) {
						rowData.hasExtraRow = true;

						rowData.placedLabels!.push({
							label: this.CHARS.ARROW_LEFT_UP + medianLabel,
							low: thisMedianOffset,
							high: thisMedianOffset + length - 1,
							relation: 'extraRow',
							color: rowData.color
						});
					}
					else {
						rowData.hasExtraRow = true;

						rowData.placedLabels!.push({
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
			if (
				nextRow !== undefined &&
				!nextRow.isInlineLabelPlaced &&
				(!this.isGroup || rowData.siblings[0]) &&
				!nextRow.isGroup
			) {
				this.placeLabelMulti(
					nextRow,
					rowData,
					this.buildLabel(nextRow.median || 0),
					[this.CHARS.ARROW_LEFT_DOWN, this.CHARS.ARROW_RIGHT_DOWN],
					nextRow.offsets!.median + 1,
					'nextRow'
				);
			}
		}
	}

	private padEndWithDots(
		endIndex: number,
		skipDots: boolean,
		color: typeof chalk
	): this {
		for (let index = this.length + 1; index <= endIndex; index++) {
			const dotSize = skipDots ?
				0 :
				Math.ceil(this.rowData.dotsOffsets!.findAll(index).length / this.dotScale);

			if (dotSize > 0) {
				this.append(
					this.CHARS.DOTS.charAt(
						Math.min(dotSize, this.CHARS.DOTS.length) - 1
					),
					color
				);
			}
			else {
				this.append(
					this.settings.xAxis.isTickOffset(index) ?
						this.getVerticalChar(index) :
						SPACE,
					this.BOX_COLOR
				);
			}
		}

		return this;
	}

	private padEndWithLabels(
		endIndex: number,
		char: string,
		relations: Array<IPlacedLabel['relation']> = [],
		skipDots = false
	): this {
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

	private buildExtraRow(skipDots: boolean): string {
		this.reset();

		return this.padEndWithLabels(
				this.settings.xAxis.size,
				SPACE,
				skipDots ?
					['extraRow', 'nextRow'] :
					['prevRow', 'sameRowDots'],
				skipDots
			)
			.prependLabel(true, this.isGroup ? undefined : this.rowData.color)
			.toString();
	}

	preProcess(rowData: IBandDomain): void {
		this.prepRender(rowData);
		this.buildBoxOffsets(rowData);
		this.buildBoxOffsets(rowData.siblings[1]);
		this.placeLabels();
	}

	render(rowData: IBandDomain): Array<string> {
		this.prepRender(rowData);

		const output = [];

		if (this.settings.showDots && !this.isGroup) {
			output.push(this.buildExtraRow(false));
		}

		this.reset();

		if (rowData.data !== undefined) {
			this.padEndWithLabels(rowData.offsets!.min - 1, SPACE, [], this.settings.showDots);

			if (rowData.data.length === 1) {
				this.append(this.CHARS.WHISKER_SINGLE, rowData.color);
			}
			else if (rowData.offsets!.max === rowData.offsets!.min) {
				if (rowData.median! - rowData.Q1! > rowData.Q3! - rowData.median!) {
					this.append(this.CHARS.Q1_FILL, rowData.color);
				}
				else {
					this.append(this.CHARS.Q3_FILL, rowData.color);
				}
			}
			else {
				if (rowData.offsets!.min !== rowData.offsets!.Q1) {
					this.append(this.CHARS.WHISKER_START, rowData.color)
						.padEndWithLabels(
							rowData.offsets!.Q1 - 1,
							this.CHARS.WHISKER_LINE
						);
				}

				this.padEndWithLabels(
						rowData.offsets!.median,
						this.CHARS.Q1_FILL
					)
					.padEndWithLabels(
						rowData.offsets!.Q3,
						this.CHARS.Q3_FILL
					);

				if (rowData.offsets!.Q3 !== rowData.offsets!.max) {
					this.padEndWithLabels(
							rowData.offsets!.max - 1,
							this.CHARS.WHISKER_LINE
						)
						.append(this.CHARS.WHISKER_END, rowData.color);
				}
			}
		}

		this.padEndWithLabels(this.settings.xAxis.size, SPACE, [], this.settings.showDots)
			.prependLabel(false, this.isGroup ? undefined : rowData.color);

		output.push(this.toString());

		if (rowData.placedLabels!.length !== 0) {
			output.push(this.buildExtraRow(true));
		}

		return output;
	}
}

/**
 * Builds a box and whisker chart.
 *
 * ```text
 * String   ╭─────────┬─────────┬─────────┬─────────┬─────────╮
 *          │         ·         ╵    •    ╵         ╵    ●• · │
 *   concat │         ·         ╵    ┣━━━━━━━━━░░░░░░░░░░▓▓━┫ │
 *          │         ╵         ╵         ╵  Mdn: 90.00 ─╯ ····
 *   length │         ╵         ╵         ╵         ╵      ┣░▓┫
 * Array    │      ╭─ Mdn: 13.00╵         ╵      Mdn: 98.00 ─╯│
 *          │·    ·   ╵ ·       ╵         ╵         ╵         │
 *     push │┣━░░░░▓▓▓━━┫       ╵         ╵         ╵         │
 *          •         ╵         ╵         ╵         ╵         │
 *   concat ░ ── Mdn: 0.15      ╵         ╵         ╵         │
 *          │·        ╵         ╵         ╵         ╵         │
 *    shift │┃ ── Mdn: 2.00     ╵         ╵         ╵         │
 *          ╰─────────┴─────────┴─────────┴─────────┴─────────╯
 *          0        20        40        60        80       100
 *                                 Ops/s
 * ```
 *
 * @function boxChart
 *
 * @param {object} settings - Settings object.
 * @param {string} [settings.title] - Title of the chart.
 *
 * @param {Array<object>} settings.data
 * @param {number[]} [settings.data[].data] - The data points for this row.
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
		data: [{
			label: 'undefined',
			data: [0]
		}],
		calc: null,
		xAxis: {}
	}, settings, {
		calc: 'quartiles'
	}) as DeepRequired<ISettings>, BoxRow);
};
