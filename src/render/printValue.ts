import { abbrNumber } from 'type-enforcer-math';
import type { ISettingsInternal } from '../types';

export default (value: number, settings: ISettingsInternal): string => {
	if (settings.significantDigits !== 0) {
		return abbrNumber(value, {
			precision: settings.significantDigits,
			suffix: settings.xAxis.suffix
		});
	}

	return value.toLocaleString(undefined, {
		minimumFractionDigits: settings.fractionDigits,
		maximumFractionDigits: settings.fractionDigits
	}) + settings.xAxis.suffix;
};
