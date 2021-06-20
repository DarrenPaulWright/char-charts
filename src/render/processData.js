import { List } from 'hord';
import Axis from '../axis/Axis.js';

export default (settings) => {
	settings.data.forEach((value) => {
		if (!value.label) {
			value.label = '';
		}
		if (!value.group) {
			value.group = [];
		}

		if (value.data || settings.calc) {
			value.data = new List()
				.comparer(List.comparers.number.asc)
				.values(value.data);
		}

		if (settings.calc === 'min') {
			value.value = value.data.first();
		}
		else if (settings.calc === 'max') {
			value.value = value.data.last();
		}
		else if (settings.calc === 'mean') {
			value.value = value.data.mean();
		}
		else if (settings.calc === 'median') {
			value.value = value.data.median();
		}
		else if (settings.calc === 'quartiles') {
			Object.assign(value, value.data.quartiles());
		}
	});

	settings.yAxis = new Axis({ scale: 'band' }, settings.data);

	settings.xAxis = new Axis(settings.xAxis, settings.data)
		.size(settings.width - settings.yAxis.scale().maxLabelWidth());

	if (settings.calc === 'quartiles') {
		const mapChars = (value) => settings.xAxis.getCharOffset(value);

		settings.data.forEach((value) => {
			value.outliers = value.outliers.map(mapChars);
		});
	}
};
