import chalk from 'chalk';
import { compare, List } from 'hord';
import { superimpose } from 'object-agent';
import { SPACE } from './render/chars.js';
import Chart from './render/Chart.js';
import printValue from './render/printValue.js';
import type { DeepRequired, IBandDomain, IPlacedLabel, ISettings } from './types';

const MEDIAN_PREFIX = 'Mdn: ';

class BoxChart extends Chart {
	private static hasDot(rowData: IBandDomain, low: number, high: number): boolean {
		return Boolean(rowData?.dotsOffsets) &&
			rowData.dotsOffsets!.length !== 0 &&
			rowData.dotsOffsets!.some((dot: number) => (dot >= low) && (dot <= high));
	}

	private static hasLabel(
		rowData: IBandDomain,
		low: number,
		high: number,
		ignoreTypes: Array<string>
	): boolean {
		return rowData.placedLabels!.findIndex((label) => {
			return label.low <= high + 1 &&
				label.high >= low - 1 &&
				!ignoreTypes.includes(label.relation);
		}) !== -1;
	}

	private dotScale = 1;

	constructor(settings: DeepRequired<ISettings>) {
		super(settings);

		const maxDataLength = this.settings.data.reduce((max, datum) => {
			return Math.max(max, datum.data?.length || 0);
		}, 0);

		this.dotScale = Math.max(
			1,
			maxDataLength / (
				Math.sqrt(this.xAxis.size) * (this.CHARS.DOTS.length / 3)
			)
		);
	}

	// eslint-disable-next-line @typescript-eslint/max-params
	private placeLabelIfFitsOnRow(
		rowData: IBandDomain,
		targetRowData: IBandDomain,
		label: string,
		low: number,
		relation: IPlacedLabel['relation'],
		skipDots: boolean,
		ignoreTypes: Array<string> = []
	): void {
		const high = low + label.length - 1;

		if (
			this.isInXAxis(low, high) &&
			!rowData.isInlineLabelPlaced &&
			targetRowData.offsets !== undefined &&
			(
				skipDots ||
				high < targetRowData.offsets.min ||
				low > targetRowData.offsets.max + 1
			) &&
			!BoxChart.hasLabel(targetRowData, low, high, ignoreTypes) &&
			(targetRowData.hasExtraRow || !BoxChart.hasDot(targetRowData, low, high))
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

	// eslint-disable-next-line @typescript-eslint/max-params
	private placeLabelMulti(
		rowData: IBandDomain,
		targetRowData: IBandDomain,
		label: string,
		arrows: [string, string],
		offset: number,
		relation: IPlacedLabel['relation']
	): void {
		const rightLabel = arrows[0] + label;
		const leftLabel = label + arrows[1];

		this.placeLabelIfFitsOnRow(
			rowData,
			targetRowData,
			rightLabel,
			offset,
			relation,
			this.settings.showDots || relation === 'extraRow'
		);

		this.placeLabelIfFitsOnRow(
			rowData,
			targetRowData,
			leftLabel,
			offset - leftLabel.length + 1,
			relation,
			this.settings.showDots || relation === 'extraRow'
		);
	}

	private buildBoxOffsets(rowData: IBandDomain): void {
		if (rowData && !rowData.offsets) {
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

			rowData.placedLabels = [];
			rowData.outliers = new List(rowData.outliers || []);
			rowData.dotsOffsets = new List(
				rowData.data ?
					rowData.data.map((value: number) => this.getCharOffset(value)) :
					[]
			);

			// rowData.hasExtraRow = false;
		}
	}

	private buildLabel(value: number): string {
		return value ?
			MEDIAN_PREFIX + printValue(value, this.settings) :
			'';
	}

	private placeLabelExtraRow(
		rowData: IBandDomain,
		medianLabel: string,
		medianOffset: number
	): void {
		if (rowData.hasExtraRow) {
			this.placeLabelMulti(
				rowData,
				rowData,
				medianLabel,
				[this.CHARS.ARROW_LEFT_UP, this.CHARS.ARROW_RIGHT_UP],
				medianOffset,
				'extraRow'
			);
		}
	}

	private placeLabelSameRowWithDots(
		rowData: IBandDomain,
		medianLabel: string,
		medianOffset: number
	): void {
		if (this.settings.showDots) {
			this.placeLabelMulti(
				rowData,
				rowData,
				medianLabel,
				[this.CHARS.ARROW_LEFT_DOWN, this.CHARS.ARROW_RIGHT_DOWN],
				medianOffset,
				'sameRowDots'
			);
		}
	}

	private placeLabelNextRow(
		rowData: IBandDomain,
		nextRow: IBandDomain,
		medianLabel: string,
		medianOffset: number
	): void {
		if (nextRow) {
			this.placeLabelMulti(
				rowData,
				nextRow,
				medianLabel,
				[this.CHARS.ARROW_LEFT_UP, this.CHARS.ARROW_RIGHT_UP],
				medianOffset,
				'prevRow'
			);
		}
	}

	private placeLabelSameRow(
		rowData: IBandDomain,
		medianLabel: string
	): void {
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
	}

	private placeLabelForceExtraRow(
		rowData: IBandDomain,
		medianLabel: string,
		medianOffset: number
	): void {
		if (!rowData.isInlineLabelPlaced) {
			const length = medianLabel.length + this.CHARS.ARROW_LEFT_UP.length;

			if (medianOffset + length < this.xAxis.size + 2) {
				rowData.hasExtraRow = true;

				rowData.placedLabels!.push({
					label: this.CHARS.ARROW_LEFT_UP + medianLabel,
					low: medianOffset,
					high: medianOffset + length - 1,
					relation: 'extraRow',
					color: rowData.color
				});
			}
			else {
				rowData.hasExtraRow = true;

				rowData.placedLabels!.push({
					label: medianLabel + this.CHARS.ARROW_RIGHT_UP,
					low: medianOffset - length,
					high: medianOffset,
					relation: 'extraRow',
					color: rowData.color
				});
			}
		}
	}

	private placeLabelNextRowOnThisRow(
		rowData: IBandDomain,
		nextRow: IBandDomain
	): void {
		if (
			nextRow !== undefined &&
			!nextRow.isInlineLabelPlaced &&
			!nextRow.hasExtraRow &&
			(!this.isGroup || rowData.siblings[0]) &&
			!nextRow.isGroup &&
			nextRow.median
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

	private placeLabels(): void {
		const rowData = this.rowData;
		const nextRow = rowData.siblings[1];

		if (this.settings.showInlineLabels) {
			if (!rowData.isInlineLabelPlaced && rowData.median && !rowData.isGroup) {
				const medianLabel = this.buildLabel(rowData.median);
				const thisMedianOffset = Math.max(
					this.getCharOffset(this.xAxis.scale.start),
					rowData.offsets!.median + 1
				);

				this.placeLabelExtraRow(rowData, medianLabel, thisMedianOffset);
				this.placeLabelSameRowWithDots(rowData, medianLabel, thisMedianOffset);
				this.placeLabelNextRow(rowData, nextRow, medianLabel, thisMedianOffset);
				this.placeLabelSameRow(rowData, medianLabel);
				this.placeLabelForceExtraRow(rowData, medianLabel, thisMedianOffset);
			}

			this.placeLabelNextRowOnThisRow(rowData, nextRow);
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
					this.xAxis.isTickOffset(index) ?
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
		relations: Array<IPlacedLabel['relation']>,
		skipDots = false
	): this {
		if (this.rowData?.placedLabels) {
			const labels = this.rowData.placedLabels
				.filter((label) => {
					return label.low >= this.length &&
						label.high <= endIndex &&
						(relations.includes(label.relation)) &&
						(
							!this.rowData.hasExtraRow ||
							skipDots ||
							label.relation === 'prevRow' ||
							label.relation === 'sameRow'
						);
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

		return this;
	}

	private buildExtraRow(skipDots: boolean): string {
		const label = skipDots ? '' : this.rowData.label[this.rowData.label.length - 2] || '';

		this.reset();

		return this.padEndWithLabels(
				this.xAxis.size,
				skipDots ?
					['extraRow', 'nextRow'] :
					['prevRow', 'sameRowDots'],
				skipDots
			)
			.prepend(
				this.dataYAxisLabel(label),
				this.isGroup ? undefined : this.rowData.color
			)
			.toString();
	}

	private renderWhisker(): void {
		const rowData = this.rowData;

		if (rowData.data!.length === 1) {
			this.append(this.CHARS.WHISKER_SINGLE, rowData.color);
		}
		else if (rowData.offsets!.max === rowData.offsets!.min) {
			this.append(
				(rowData.median! - rowData.Q1! > rowData.Q3! - rowData.median!) ?
					this.CHARS.Q1_FILL :
					this.CHARS.Q3_FILL,
				rowData.color
			);
		}
		else {
			if (rowData.offsets!.min !== rowData.offsets!.Q1) {
				this.append(this.CHARS.WHISKER_START, rowData.color)
					.padEnd(
						rowData.offsets!.Q1 - 1,
						this.CHARS.WHISKER_LINE,
						this.rowData.color
					);
			}

			this.padEnd(
					rowData.offsets!.median,
					this.CHARS.Q1_FILL,
					this.rowData.color
				)
				.padEnd(
					rowData.offsets!.Q3,
					this.CHARS.Q3_FILL,
					this.rowData.color
				);

			if (rowData.offsets!.Q3 !== rowData.offsets!.max) {
				this.padEnd(
						rowData.offsets!.max - 1,
						this.CHARS.WHISKER_LINE,
						this.rowData.color
					)
					.append(this.CHARS.WHISKER_END, rowData.color);
			}
		}
	}

	preProcessRow(): void {
		this.buildBoxOffsets(this.rowData);
		this.buildBoxOffsets(this.rowData.siblings[1]);
		this.placeLabels();
	}

	override buildPreviousLabelRows(color?: typeof chalk): Array<string> {
		return this.rowData.label
			.slice(0, (this.settings.showDots && !this.isGroup) ? -2 : -1)
			.map((label, index) => {
				return this.reset()
					.padEndWithLabels(
						this.xAxis.size,
						index === 0 ? ['prevRow', 'sameRowDots'] : [],
						true
					)
					.prepend(
						this.isGroup ?
							this.groupYAxisLabel(label) :
							this.dataYAxisLabel(label),
						color
					)
					.toString();
			});
	}

	renderRow(): Array<string> {
		const rowData = this.rowData;
		const hasData = rowData.data !== undefined && rowData.data.length !== 0;
		const rowColor = this.isGroup ?
			undefined :
			(hasData ? rowData.color : chalk.grey);

		const output: Array<string> = this.buildPreviousLabelRows(rowColor);

		if (this.settings.showDots && !this.isGroup) {
			output.push(this.buildExtraRow(false));
		}

		this.reset();

		const relations: Array<IPlacedLabel['relation']> = ['prevRow', 'sameRow', 'sameRowDots'];

		if (!this.rowData.hasExtraRow || this.isGroup) {
			relations.push('nextRow', 'extraRow');
		}

		if (hasData) {
			this.padEndWithLabels(
				rowData.offsets!.min - 1,
				relations,
				this.settings.showDots
			);

			this.renderWhisker();
		}

		this.padEndWithLabels(this.xAxis.size, relations, this.settings.showDots)
			.prependLabel(false, rowColor);

		output.push(this.toString());

		if (rowData.placedLabels!.length !== 0 || this.rowData.hasExtraRow) {
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
 * @param {string} [settings.render.colors='bright'] - Color palette to use. Options are 'none', 'bright', 'dim', 'cool', 'passFail', 'blue', 'green', 'magenta', 'yellow', 'cyan', or 'red'.
 * @param {boolean} [settings.render.showDots=false] - Add a row with dots that represent data points.
 * @param {boolean} [settings.render.extraRowSpacing=false] - Add an extra row between each data row.
 * @param {'asc' | 'desc'} [settings.render.sortLabels] - Sort the data by label.
 *
 * @returns {Array<string>} An array of strings, one string per row.
 */
export default (settings: ISettings): Array<string> => {
	return new BoxChart(superimpose({
		title: '',
		render: {
			width: 60,
			maxYAxisWidth: 20,
			fractionDigits: 0,
			significantDigits: 0,
			showInlineLabels: true,
			showDots: false,
			style: 'rounded',
			colors: 'bright',
			extraRowSpacing: false
		},
		data: [],
		calc: null,
		xAxis: {}
	}, settings, {
		calc: 'quartiles'
	}) as DeepRequired<ISettings>).render();
};
