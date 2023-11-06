import { firstDigit, pow10 } from 'type-enforcer-math';

const ceil = (value: number, fractionDigits: number | null = 0, precision = 0): number => {
	let output = value;
	let digits = fractionDigits;
	let precisionDigits = precision;

	if (precisionDigits !== 0) {
		const first = firstDigit(output);

		if (digits === null) {
			digits = precisionDigits - first;
		}

		precisionDigits = pow10(first - precisionDigits);
		output = Math.ceil(output / precisionDigits) * precisionDigits;
	}

	digits = pow10(Math.max(0, digits || 0));

	return Math.ceil(output * digits) / digits;
};

export default ceil;
