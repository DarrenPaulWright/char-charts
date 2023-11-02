const wrap = (string: string, maxLength: number, isRight = false): Array<string> => {
	let label = string.trim();
	let isForced = false;
	const output: Array<string> = [];

	while (label.length > maxLength) {
		let index = isRight ?
			label.indexOf(' ', label.length - maxLength - 1) :
			label.lastIndexOf(' ', maxLength);

		isForced = false;

		if (index === -1) {
			isForced = true;
			index = isRight ? label.length - maxLength - 1 : maxLength;
		}

		if (isRight) {
			output.unshift(label.slice(index + 1));
			label = label.slice(0, isForced ? index + 1 : index);
		}
		else {
			output.push(label.slice(0, index));
			label = label.slice(isForced ? index : index + 1);
		}
	}

	if (isRight) {
		output.unshift(label);
	}
	else {
		output.push(label);
	}

	return output;
};

export default wrap;
