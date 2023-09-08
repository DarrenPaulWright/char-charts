export default (value: number, desiredFractionDigits = 0): string => {
	return value.toLocaleString(undefined, {
		minimumFractionDigits: desiredFractionDigits,
		maximumFractionDigits: desiredFractionDigits
	});
};
