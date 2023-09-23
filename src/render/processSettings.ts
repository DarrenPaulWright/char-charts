import chalk from 'chalk';
import { List } from 'hord';
import { deepEqual } from 'object-agent';
import Axis from '../axis/Axis.js';
import type { DeepRequired, IChartDataInternal, ISettings, ISettingsInternal } from '../types';
import { ASCII_STYLE, DOUBLED_STYLE, ROUNDED_STYLE, SQUARED_STYLE } from './chars.js';

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

const colorPalettes = {
	none: [
		chalk.white
	],
	bright: [
		chalk.blueBright,
		chalk.greenBright,
		chalk.magentaBright,
		chalk.yellowBright,
		chalk.cyanBright,
		chalk.redBright,
		chalk.white
	],
	dim: [
		chalk.blue,
		chalk.green,
		chalk.magenta,
		chalk.yellow,
		chalk.cyan,
		chalk.red,
		chalk.grey
	],
	cool: [
		chalk.blueBright,
		chalk.cyanBright,
		chalk.white
	],
	passFail: [
		chalk.greenBright,
		chalk.redBright,
		chalk.grey
	],
	blue: [
		chalk.blueBright
	],
	green: [
		chalk.green
	],
	magenta: [
		chalk.magentaBright
	],
	yellow: [
		chalk.yellow
	],
	cyan: [
		chalk.cyanBright
	],
	red: [
		chalk.redBright
	]
};

const styleMap: { [name: string]: typeof ROUNDED_STYLE } = {
	rounded: ROUNDED_STYLE,
	squared: SQUARED_STYLE,
	doubled: DOUBLED_STYLE,
	ascii: ASCII_STYLE
};

export default (settings: DeepRequired<ISettings>): ISettingsInternal => {
	const useColor = settings.render.colors !== 'none';
	const colors = colorPalettes[settings.render.colors];
	const bgColors = colors.map((color) => color.inverse);

	const data: Array<IChartDataInternal> = settings.data.map((value, index) => {
		const output: IChartDataInternal = {
			label: value.label ?? '',
			group: value.group ?? [],
			isGroup: false,
			color: colors[index % colors.length],
			bgColor: bgColors[index % bgColors.length],
			siblings: [],
			hasExtraRow: settings.render.extraRowSpacing &&
				index !== settings.data.length - 1 &&
				deepEqual(value.group, settings.data[index + 1]?.group)
		};

		if ('value' in value) {
			output.value = value.value;
		}

		if (value.data || settings.calc) {
			output.data = new List();
			// eslint-disable-next-line @typescript-eslint/unbound-method
			output.data.comparer(List.comparers.number.asc);
			output.data.values(value.data);
		}

		calcValue(output, settings.calc);

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
