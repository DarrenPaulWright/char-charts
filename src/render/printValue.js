import { isNumber } from 'type-enforcer';

export default (value, desiredFractionDigits = 0) => {
	return isNumber(value) ? value.toLocaleString(undefined, {
		minimumFractionDigits: desiredFractionDigits,
		maximumFractionDigits: desiredFractionDigits
	}) : '?';
};
