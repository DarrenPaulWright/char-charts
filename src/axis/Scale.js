import { method } from 'type-enforcer';

const getValue = (value, loc, origin) => {
	if (value.value !== undefined) {
		return value.value;
	}
	else if (value.data && value.data[loc]() !== undefined) {
		return value.data[loc]();
	}

	return origin;
};

export default class Scale {
	constructor(data) {
		this.processData(data);
		this.minTickOffset = 7;
		this.majorTicks = [];
	}

	processData(data) {
		if (data.length > 1) {
			this.domain(
				data.reduce((result, value) => {
					result[0] = Math.min(result[0], getValue(value, 'first', result[0]));
					result[1] = Math.max(result[1], getValue(value, 'last', result[1]));

					return result;
				}, [Infinity, -Infinity])
			);
		}
		else if (data.length === 1) {
			const value1 = getValue(data[0], 'first', 0);
			const value2 = getValue(data[0], 'last', 0);

			if (value1 !== value2) {
				this.domain([value1, value2]);
			}
			else if (value1) {
				this.domain([0, value1]);
			}
			else {
				this.domain([0, 1]);
			}
		}
	}
}

Object.assign(Scale.prototype, {
	domain: method.array({init: [0, 1]}),
	tickValue: method.float({init: 0}),
	start: method.float({init: 0}),
	end: method.float({init: 0}),
	size: method.integer({
		init: 0,
		set() {
			this.range();
		}
	}),
	shouldGetTickValue: method.boolean({init: true}),
	shouldGetStart: method.boolean({init: true}),
	shouldGetEnd: method.boolean({init: true})
});
