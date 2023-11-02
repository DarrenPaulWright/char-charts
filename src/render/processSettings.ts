import { compare, List } from 'hord';
import Axis from '../axis/Axis.js';
import { BASE_LABEL_OFFSET, GROUP_LABEL_OFFSET } from '../constants.js';
import type { DeepRequired, IChartDataInternal, ISettings, ISettingsInternal } from '../types';
import wrap from '../utility/wrap.js';
import { ASCII_STYLE, DOUBLED_STYLE, ROUNDED_STYLE, SQUARED_STYLE } from './chars.js';
import colorPalettes from './colorPalettes.js';

const calcValue = (
	value: Partial<IChartDataInternal>,
	calc: ISettingsInternal['calc']
): void => {
	switch (calc) {
		case 'min': {
			value.value = value.data!.first() as number;
			break;
		}

		case 'max': {
			value.value = value.data!.last() as number;
			break;
		}

		case 'mean': {
			value.value = value.data!.mean();
			break;
		}

		case 'median': {
			value.value = value.data!.median();
			break;
		}

		case 'quartiles': {
			Object.assign(value, value.data!.quartiles());
			break;
		}
	}
};

const styleMap: { [name: string]: typeof ROUNDED_STYLE } = {
	rounded: ROUNDED_STYLE,
	squared: SQUARED_STYLE,
	doubled: DOUBLED_STYLE,
	ascii: ASCII_STYLE
};

export default (settings: DeepRequired<ISettings>): ISettingsInternal => {
	const useColor = settings.render.colors !== 'none';
	const colors = colorPalettes[settings.render.colors] || colorPalettes.bright;
	const bgColors = colors.map((color) => color.inverse);
	const groupDepth = settings.data.reduce((result, datum) => {
		return Math.max(result, datum.group?.length || 0);
	}, 0);

	const isGrouped = groupDepth !== 0;

	if (isGrouped || settings.render.sortLabels) {
		const comparers = [];

		for (let index = 0; index < groupDepth; index++) {
			comparers.push(`group.${ index }`);
		}

		if (settings.render.sortLabels) {
			comparers.push('label');
		}

		settings.data.sort(compare(comparers, settings.render.sortLabels === 'desc'));
	}

	const maxYAxisWidth = settings.render.maxYAxisWidth -
		(isGrouped ? GROUP_LABEL_OFFSET : BASE_LABEL_OFFSET);

	const data = settings.data.map((value, index) => {
		const output: IChartDataInternal = {
			label: wrap(value.label ?? '', maxYAxisWidth, true),
			group: value.group ?? [],
			isGroup: false,
			color: colors[index % colors.length],
			bgColor: bgColors[index % bgColors.length],
			siblings: [],
			hasExtraRow: settings.render.extraRowSpacing &&
				index !== settings.data.length - 1
		};

		if ('value' in value) {
			output.value = value.value;
		}

		if (value.data || settings.calc) {
			output.data = new List();
			// eslint-disable-next-line @typescript-eslint/unbound-method
			output.data.comparer(List.comparers.number.asc);
			output.data.values(value.data);

			calcValue(output, settings.calc);
		}

		return output;
	});

	const yAxis = new Axis({ scale: 'band' }, data);
	const xAxis = new Axis(settings.xAxis, data);

	xAxis.size = settings.render.width - yAxis.scale.maxLabelWidth;

	if (settings.calc === 'quartiles') {
		const mapChars = (value: number): number => xAxis.getCharOffset(value);

		data.forEach((value) => {
			value.outliers = new List(value.outliers!.map(mapChars));
		});
	}

	return {
		title: settings.title,
		...settings.render,
		colors,
		calc: settings.calc,
		useColor,
		yAxis,
		xAxis,
		data,
		CHARS: styleMap[settings.render.style] || ROUNDED_STYLE
	};
};
