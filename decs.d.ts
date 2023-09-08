declare module 'char-charts' {
	interface ISettings {
		title?: string;
		width?: number;
		fractionDigits?: number;
		showInlineLabels?: boolean;
		ascii?: boolean;
		showDots?: boolean;
		xAxis?: {
			scale?: 'linear' | 'log';
			label?: string;
			start?: number;
			end?: number;
			tickValue?: number;
		};
		data: Array<{
			data: Array<number>;
			label: string;
			group?: Array<string>
		}>;
	}

	export function boxChart(settings: ISettings): Array<string>;
}
declare module 'display-value' {
	interface IOptions {
		beautify: boolean;
	}

	export default function displayValue(value: unknown, options?: IOptions): string;
}

declare module 'textdiff-create' {
	type diffDelete = [-1, number];
	type diffEqual = [0, number];
	type diffAdd = [1, string];

	export default function createDiff(string1: string, string2: string): Array<diffDelete | diffEqual | diffAdd>;
}
