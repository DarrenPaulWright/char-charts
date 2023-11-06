import { firstDigit, pow10 } from 'type-enforcer-math';

const floor = (value: number, fractionDigits: number | null = 0, precision = 0): number => {
	let output = value;
	let digits = fractionDigits;
	let precisionDigits = precision;

	if (precisionDigits !== 0) {
		const first = firstDigit(output);

		if (digits === null) {
			digits = precisionDigits - first;
		}

		precisionDigits = pow10(first - precisionDigits);
		output = Math.floor(output / precisionDigits) * precisionDigits;
	}

	digits = pow10(Math.max(0, digits || 0));

	return Math.floor(output * digits) / digits;
};

export default floor;
