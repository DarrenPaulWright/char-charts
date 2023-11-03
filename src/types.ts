import type chalk from 'chalk';
import type { List } from 'hord';
import type Axis from './axis/Axis.js';
import type { ROUNDED_STYLE } from './render/chars.js';
import type colorPalettes from './render/colorPalettes.js';

export type DeepRequired<T> = Required<{ [P in keyof T]: DeepRequired<T[P]> }>;

type RequireKeys<T extends object, K extends keyof T> =
	(Required<Pick<T, K>> & Omit<T, K>) extends infer O ? { [P in keyof O]: O[P] } : never;

export interface ITick {
	offset: number;
	label: string;
	isMajor: boolean;
}

export interface IPlacedLabel {
	label: string;
	low: number;
	high: number;
	relation: 'prevRow' | 'sameRow' | 'sameRowDots' | 'nextRow' | 'extraRow';
	color: typeof chalk;
}

export type INumericDomain = [number, number];

export type IBandDomain = RequireKeys<IChartDataInternal, 'label' | 'value' | 'siblings'>;

export interface IChartData {
	data?: Array<number>;
	value?: number | Array<number>;
	label: string;
	group?: Array<string>;
}

export interface IChartDataInternal {
	data?: List;
	value?: number | Array<number>;
	label: Array<string>;
	group: Array<Array<string>>;
	isGroup: boolean;
	groupIndent?: number;

	color: typeof chalk;
	bgColor: typeof chalk;

	siblings: Array<IBandDomain>;
	placedLabels?: Array<IPlacedLabel>;
	isInlineLabelPlaced?: boolean;
	hasExtraRow: boolean;

	min?: number;
	Q1?: number;
	median?: number;
	Q3?: number;
	max?: number;
	outliers?: List;
	dotsOffsets?: List;
	offsets?: {
		min: number;
		Q1: number;
		median: number;
		Q3: number;
		max: number;
	};
}

export interface IAxisSettings {
	scale?: 'linear' | 'band' | 'log';
	label?: string;
	start?: number;
	end?: number;
	tickValue?: number;
	suffix?: string;
}

export interface ISettings {
	title?: string;
	render?: {
		width?: number;
		maxYAxisWidth?: number;
		fractionDigits?: number;
		significantDigits?: number;
		showInlineLabels?: boolean;
		showDots?: boolean;
		style?: 'rounded' | 'squared' | 'doubled' | 'ascii';
		colors?: keyof typeof colorPalettes;
		extraRowSpacing?: boolean;
		sortLabels?: 'asc' | 'desc' | undefined;
	};
	calc?: 'min' | 'max' | 'mean' | 'median' | 'quartiles' | null;
	xAxis?: IAxisSettings;
	data: Array<IChartData>;
}

export interface ISettingsInternal {
	title: string;
	width: number;
	maxYAxisWidth: number;
	fractionDigits: number;
	significantDigits: number;
	showInlineLabels: boolean;
	showDots: boolean;
	useColor: boolean;
	colors: Array<typeof chalk>;
	extraRowSpacing: boolean;
	style: DeepRequired<ISettings>['render']['style'];
	CHARS: typeof ROUNDED_STYLE;
	calc: 'min' | 'max' | 'mean' | 'median' | 'quartiles' | null;
	yAxis: Axis;
	xAxis: Axis;
	data: Array<IChartDataInternal>;
}
