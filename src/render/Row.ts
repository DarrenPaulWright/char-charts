import chalk from 'chalk';
import { deepEqual } from 'object-agent';
import type { IBandDomain, ISettingsInternal, ITick } from '../types';
import wrap from '../utility/wrap.js';
import { INDENT_WIDTH, type ROUNDED_STYLE, SPACE } from './chars.js';

export default abstract class Row {
	private _length = 0;
	private prevLabel: Array<string> = [];
	private _string = '';
	protected isGroup = false;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	protected rowData: IBandDomain;

	protected settings: ISettingsInternal;
	protected CHARS: typeof ROUNDED_STYLE;

	protected BOX_COLOR = chalk.grey;

	constructor(settings: ISettingsInternal) {
		this.settings = settings;
		this.CHARS = settings.CHARS;
	}

	private cap(
		leftChar: string,
		tickChar: string,
		tickCharMajor: string,
		rightChar: string,
		label: Array<string> = ['']
	): Array<string> {
		const last = this.settings.xAxis.ticks.length - 1;

		const output: Array<string> = [
			this.groupYAxisLabel(label[0])
				.concat(
					this.colorize(
						(this.settings.xAxis.ticks
							.reduce((result: string, value: ITick, index: number) => {
								return index === 0 ?
									leftChar :
									result
										.padEnd(value.offset - 1, this.CHARS.CHART_HORIZONTAL)
										.concat(index === last ?
											rightChar :
											(value.isMajor ?
												tickCharMajor :
												tickChar));
							}, '') as string),
						this.BOX_COLOR
					)
				)
		];

		label.forEach((subString, index) => {
			if (index !== 0) {
				output.push(
					this.reset()
						.padEnd(this.settings.xAxis.size, SPACE)
						.prepend(this.groupYAxisLabel(subString))
						.toString()
				);
			}
		});

		return output;
	}

	protected colorize(string: string, color?: typeof chalk): string {
		return this.settings.useColor ?
			(color ? color(string) : string) :
			string;
	}

	protected groupYAxisLabel(label: string): string {
		return SPACE.repeat((this.rowData?.groupIndent || 0) * INDENT_WIDTH)
			.concat(label)
			.padEnd(this.settings.yAxis.scale.maxLabelWidth, SPACE);
	}

	protected dataYAxisLabel(label: string): string {
		return label.concat(SPACE)
			.padStart(this.settings.yAxis.scale.maxLabelWidth, SPACE);
	}

	abstract preProcess(rowData: IBandDomain): void;

	abstract render(rowData: IBandDomain): Array<string>;

	get length(): number {
		return this._length;
	}

	prepRender(rowData: IBandDomain): void {
		this.rowData = rowData;
		this.isGroup = rowData.isGroup;
	}

	reset(): this {
		this._string = '';
		this._length = 0;

		return this;
	}

	getCharOffset(value: number, fractionDigits?: number): number {
		return this.settings.xAxis.getCharOffset(value, fractionDigits);
	}

	prepend(string: string, color?: typeof chalk): this {
		this._string = this.colorize(string, color) + this._string;
		this._length += string.length;

		return this;
	}

	append(string: string, color?: typeof chalk): this {
		this._string += this.colorize(string, color);
		this._length += string.length;

		return this;
	}

	getVerticalChar(offset: number): string {
		return this.settings.xAxis.isMajorTick(offset) ?
			this.CHARS.CHART_VERTICAL_MAJOR :
			this.CHARS.CHART_VERTICAL_MINOR;
	}

	padEnd(endIndex: number, char: string, color?: typeof chalk): this {
		const rounded = Math.ceil(endIndex);

		if (char === SPACE) {
			for (let index = this.length + 1; index <= rounded; index++) {
				this.append(
					this.settings.xAxis.isTickOffset(index) ?
						this.getVerticalChar(index) :
						char,
					this.BOX_COLOR
				);
			}
		}
		else {
			this._string += this.colorize(char.repeat(Math.max(0, rounded - this._length)), color);
		}

		this._length = Math.ceil(endIndex);

		return this;
	}

	buildPreviousLabelRows(color?: typeof chalk): Array<string> {
		if (this.isGroup) {
			return this.rowData.label
				.slice(0, -1)
				.map((label) => {
					return this.reset()
						.padEnd(this.settings.xAxis.size, SPACE)
						.prepend(this.groupYAxisLabel(label), color)
						.toString();
				});
		}

		return this.rowData.label
			.slice(0, -1)
			.map((label) => {
				return this.reset()
					.padEnd(this.settings.xAxis.size, SPACE)
					.prepend(this.dataYAxisLabel(label), color)
					.toString();
			});
	}

	prependLabel(skip: boolean, color?: typeof chalk): this {
		const label = this.rowData.label[this.rowData.label.length - 1];

		if (skip || deepEqual(this.rowData.label, this.prevLabel)) {
			this.prepend(this.dataYAxisLabel(''));
		}
		else if (this.isGroup) {
			this.prepend(this.groupYAxisLabel(label), color);
		}
		else {
			this.prepend(this.dataYAxisLabel(label), color);
		}

		if (!skip) {
			this.prevLabel = this.rowData.label;
		}

		return this;
	}

	title(): Array<string> {
		return wrap(this.settings.title, this.settings.width - 2)
			.map((label) => {
				return label
					.padStart(this.settings.width + label.length >>> 1, SPACE)
					.padEnd(this.settings.width, SPACE);
			});
	}

	bottomLabels(): string {
		const last = this.settings.xAxis.ticks.length - 1;

		return (this.settings.xAxis.ticks
			.reduce((result: string, value: ITick, index: number) => {
				return result
					.padEnd(value.offset - (index === last ?
						value.label.length :
						Math.floor(value.label.length / 2) + 1))
					.concat(value.label);
			}, '') as string)
			.padStart(this.settings.width, SPACE);
	}

	xAxisLabel(): Array<string> {
		return wrap(this.settings.xAxis.label, this.settings.xAxis.size)
			.map((label) => {
				return label.padStart(
						this.settings.width -
						Math.ceil((this.settings.xAxis.size - label.length) / 2),
						SPACE
					)
					.padEnd(this.settings.width, SPACE);
			});
	}

	top(): Array<string> {
		return this.cap(
			this.CHARS.CHART_TOP_LEFT,
			this.CHARS.CHART_TOP_TICK,
			this.CHARS.CHART_TOP_TICK,
			this.CHARS.CHART_TOP_RIGHT,
			this.settings.yAxis.scale.isGrouped() ?
				(this.settings.yAxis.domain() as Array<IBandDomain>)[0].label :
				['']
		);
	}

	bottom(): Array<string> {
		return this.cap(
			this.CHARS.CHART_BOTTOM_LEFT,
			this.CHARS.CHART_BOTTOM_TICK,
			this.CHARS.CHART_BOTTOM_TICK_MAJOR,
			this.CHARS.CHART_BOTTOM_RIGHT
		);
	}

	toString(): string {
		return `${ this._string }`;
	}
}
