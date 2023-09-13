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
		showInlineLabels: true
	},
	data: [{
		value: 1,
		label: 'Oranges',
		group: ['Fruit']
	}, {
		value: 10,
		label: 'Apples',
		group: ['Fruit']
	}, {
		value: 19,
		label: 'Pears',
		group: ['Fruit']
	}, {
		value: 52,
		label: 'Apricots',
		group: ['Fruit']
	}, {
		value: 120,
		label: 'Peaches',
		group: ['Fruit']
	}, {
		value: 3,
		label: 'Almond',
		group: ['Nuts']
	}, {
		value: 1,
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
		showInlineLabels: false
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
		width: 60,
		fractionDigits: 2,
		showInlineLabels: true,
		showDots: true
	},
	data: [{
		data: [20, 50, 50, 90, 90, 90, 90, 92, 92, 92, 97],
		label: 'concat',
		group: ['String']
	}, {
		data: [95, 97, 99, 100],
		label: 'length',
		group: ['String']
	}, {
		data: [2, 13, 24],
		label: 'push',
		group: ['Array']
	}, {
		data: [0.1, 0.2],
		label: 'concat',
		group: ['Array']
	}, {
		data: [2],
		label: 'shift',
		group: ['Array']
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
		value: [87, 4, 6],
		label: ''
	}],
	xAxis: {
		start: 0,
		end: 97
	}
}).join('\n'));
