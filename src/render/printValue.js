import { fractionDigits, round } from 'type-enforcer-math';

export default (value, desiredFractionDigits) => {
	value = round(value, desiredFractionDigits);

	const actualFractionDigits = fractionDigits(value);

	return value.toLocaleString() +
		(desiredFractionDigits && actualFractionDigits === 0 ? '.' : '') +
		'0'.repeat(desiredFractionDigits - actualFractionDigits);
}

