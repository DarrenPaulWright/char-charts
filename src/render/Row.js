import { INDENT_WIDTH, SPACE } from './chars.js';

const cap = Symbol();

export default class Row {
	constructor(settings) {
		this._string = '';

		this._settings = settings;
		this._width = settings.width;
		this._xAxis = settings.xAxis;
		this._showInlineLabels = settings.showInlineLabels;
		this._fractionDigits = settings.fractionDigits;
		this._useColor = settings.useColor;
		this._maxLabelWidth = settings.yAxis.scale().maxLabelWidth();

		Object.assign(this, settings.CHARS);
	}

	[cap](leftChar, tickChar, tickCharMajor, rightChar, label = '') {
		const last = this._xAxis.ticks.length - 1;

		return label.concat(
			this._xAxis.ticks
				.reduce((result, value, index) => {
					return index === 0 ? leftChar : result
						.padEnd(value.offset - 1, this.CHART_HORIZONTAL)
						.concat(index === last ?
							rightChar :
							value.isMajor ?
								tickCharMajor :
								tickChar);
				}, '')
				.padStart(this._width - label.length, SPACE)
		);
	}

	getCharOffset(value, fractionDigits) {
		return this._xAxis.getCharOffset(value, fractionDigits);
	}

	prepend(string) {
		this._string = string + this._string;

		return this;
	}

	append(string) {
		this._string += string;

		return this;
	}

	getVerticalChar(offset) {
		return this._xAxis.isMajorTick(offset) ? this.CHART_VERTICAL_MAJOR : this.CHART_VERTICAL_MINOR;
	}

	padEnd(value, char) {
		if (char === SPACE) {
			for (let i = this.length + 1; i <= value; i++) {
				this.append(this._xAxis.isTickOffset(i) ? this.getVerticalChar(i) : char);
			}
		}
		else {
			this._string = this._string.padEnd(value, char);
		}

		return this;
	}

	prependLabel(result) {
		if (result.label !== this.prevLabel) {
			if ('groupIndent' in result) {
				this.prepend(
					(result.groupIndent ? this.GROUP_HEADER_FILL.repeat((result.groupIndent * INDENT_WIDTH) - 1)
						.concat(SPACE) : '')
						.concat(result.label)
						.padEnd(this._maxLabelWidth, SPACE)
				);
			}
			else {
				this.prepend(
					result.label.concat(SPACE).padStart(this._maxLabelWidth, SPACE)
				);
			}
		}
		else {
			this.prepend(SPACE.repeat(this._maxLabelWidth));
		}

		this.prevLabel = result.label;

		return this;
	}

	title() {
		return this._settings.title
			.padStart(this._width + this._settings.title.length >>> 1, SPACE)
			.padEnd(this._width, SPACE);
	}

	bottomLabels() {
		const last = this._xAxis.ticks.length - 1;

		return this._xAxis.ticks
			.reduce((result, value, index) => {
				return result
					.padEnd(value.offset - (index === last ?
						value.label.length :
						Math.floor(value.label.length / 2) + 1))
					.concat(value.label);
			}, '')
			.padStart(this._width, SPACE);
	}

	xAxisLabel() {
		return this._xAxis.label()
			.padStart(this._width - Math.ceil((this._xAxis.size() - this._xAxis.label().length) / 2), SPACE)
			.padEnd(this._width, SPACE);
	}

	top() {
		return this[cap](
			this.CHART_TOP_LEFT,
			this.CHART_TOP_TICK,
			this.CHART_TOP_TICK,
			this.CHART_TOP_RIGHT,
			this._settings.yAxis.scale().isGrouped() ? this._settings.yAxis.domain()[0].label : ''
		);
	}

	bottom() {
		return this[cap](
			this.CHART_BOTTOM_LEFT,
			this.CHART_BOTTOM_TICK,
			this.CHART_BOTTOM_TICK_MAJOR,
			this.CHART_BOTTOM_RIGHT
		);
	}

	get length() {
		return this._string.length;
	}

	toString() {
		return this._string + '';
	}
}
