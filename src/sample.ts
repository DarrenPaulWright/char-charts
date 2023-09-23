import { superimpose } from 'object-agent';
import { barChart, boxChart, stackedBarChart } from '../index.js';
import type { ISettings } from './types';

const asciiOnly = false;

const runChartVariants = (
	chart: typeof barChart | typeof boxChart | typeof stackedBarChart,
	settings: ISettings
) => {
	console.log('');
	console.log('');

	console.log(chart(superimpose(settings, {
		title: `${ settings.title } ascii`,
		render: {
			style: 'ascii',
			colors: 'none'
		}
	}) as ISettings).join('\n'));

	console.log('');
	console.log('');

	console.log(chart(superimpose(settings, {
		title: `${ settings.title }, ascii, Bright`,
		render: {
			style: 'ascii',
			colors: 'bright'
		}
	}) as ISettings).join('\n'));

	if (!asciiOnly) {
		console.log('');
		console.log('');

		console.log(chart(superimpose(settings, {
			title: `${ settings.title } Doubled, inline labels false`,
			render: {
				showInlineLabels: false,
				style: 'squared',
				colors: 'cool'
			}
		}) as ISettings).join('\n'));

		console.log('');
		console.log('');

		console.log(chart(superimpose(settings, {
			title: `${ settings.title } Normal`,
			render: {
				style: 'doubled',
				colors: 'blue'
			}
		}) as ISettings).join('\n'));

		([
			'bright',
			'dim',
			'cool',
			'red',
			'cyan'
		] as Array<Required<Required<ISettings>['render']>['colors']>)
			.forEach((colors) => {
				console.log('');
				console.log('');

				console.log(chart(superimpose(settings, {
					title: `${ settings.title }, ${ colors }`,
					render: {
						colors
					}
				}) as ISettings).join('\n'));
			});
	}
};

runChartVariants(barChart, {
	title: 'Bar Chart',
	render: {
		width: 60,
		showInlineLabels: true,
		significantDigits: 3,
		extraRowSpacing: true
	},
	data: [{
		value: 1000000,
		label: 'Oranges',
		group: ['Fruit']
	}, {
		value: 10000000,
		label: 'Apples',
		group: ['Fruit']
	}, {
		value: 19000000,
		label: 'Pears',
		group: ['Fruit']
	}, {
		value: 52000000,
		label: 'Apricots',
		group: ['Fruit']
	}, {
		value: 120000000,
		label: 'Peaches',
		group: ['Fruit']
	}, {
		value: 3000000,
		label: 'Almond',
		group: ['Nuts']
	}, {
		value: 1000000,
		label: 'Peanut',
		group: ['Nuts']
	}, {
		value: 0,
		label: 'Pecan',
		group: ['Nuts']
	}],
	xAxis: {
		label: 'Satisfaction'
	}
});

runChartVariants(stackedBarChart, {
	title: 'Stacked Bar Chart',
	render: {
		width: 60,
		showInlineLabels: false,
		extraRowSpacing: true
	},
	data: [{
		value: [2, 4, 6, 4],
		label: 'Oranges',
		group: ['Fruit']
	}, {
		value: [3, 6, 9, 5],
		label: 'Apples',
		group: ['Fruit']
	}, {
		value: [4, 4, 7, 5],
		label: 'Pears',
		group: ['Fruit']
	}, {
		value: [2, 4, 6, 4],
		label: 'Almond',
		group: ['Nuts']
	}, {
		value: [3, 6, 9, 5],
		label: 'Peanut',
		group: ['Nuts']
	}, {
		value: [0, 0, 0],
		label: 'Pecan',
		group: ['Nuts']
	}]
});

runChartVariants(boxChart, {
	title: 'Box Chart',
	render: {
		width: 100,
		fractionDigits: 0,
		significantDigits: 3,
		showInlineLabels: true,
		showDots: true,
		extraRowSpacing: true
	},
	data: [{
		data: [20000, 50000, 50000, 90000, 90000, 90000, 90000, 92000, 92000, 92000, 97000],
		label: 'concat',
		group: ['String']
	}, {
		data: [2000, 13000, 24000],
		label: 'push',
		group: ['Array', 'Custom']
	}, {
		data: [0.1, 0.2],
		label: 'concat',
		group: ['Array', 'Native']
	}, {
		data: [95000, 97000, 99000, 100000],
		label: 'length',
		group: ['String']
	}, {
		data: [2],
		label: 'shift',
		group: ['Array', 'Custom']
	}],
	xAxis: {
		label: 'Ops/s'
	}
});

console.log('');
console.log('');

console.log(stackedBarChart({
	render: {
		width: 80,
		colors: 'passFail'
	},
	data: [{
		value: [19500, 4, 6],
		label: ''
	}],
	xAxis: {
		start: 0,
		end: 19510
	}
}).join('\n'));
