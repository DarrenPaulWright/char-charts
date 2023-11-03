import type { DeepRequired, IBandDomain, ISettings, ISettingsInternal } from '../types';
import processSettings from './processSettings.js';
import type Row from './Row';

export default (
	settings: DeepRequired<ISettings>,
	RowClass: new(internalSettings: ISettingsInternal) => Row
): Array<string> => {
	let output: Array<string> = [];
	const internalSettings = processSettings(settings);
	const row = new RowClass(internalSettings);

	if (internalSettings.title) {
		output.push(...row.title());
	}

	output.push(...row.top());

	(internalSettings.yAxis.domain() as Array<IBandDomain>)
		.forEach((value) => {
			row.preProcess(value);
		});

	(internalSettings.yAxis.domain() as Array<IBandDomain>)
		.forEach((value, index) => {
			if (!internalSettings.yAxis.scale.isGrouped() || index !== 0) {
				output = output.concat(...row.render(value));
			}
		});

	output.push(...row.bottom(), row.bottomLabels());

	if (internalSettings.xAxis.label) {
		output.push(...row.xAxisLabel());
	}

	return output;
};
