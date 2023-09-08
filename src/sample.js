import { superimpose } from 'object-agent';
import { barChart, boxChart } from '../index.js';

const asciiOnly = false;

const runChartVariants = (Chart, settings) => {
	console.log('');
	console.log('');

	console.log(Chart(superimpose(settings, {
		title: settings.title + ' ascii',
		render: {
			style: 'ascii',
			colors: 'none'
		}
	})).join('\n'));

	console.log('');
	console.log('');

	console.log(Chart(superimpose(settings, {
		title: settings.title + ', ascii, Bright',
		render: {
			style: 'ascii',
			colors: 'bright'
		}
	})).join('\n'));

	if (!asciiOnly) {
		console.log('');
		console.log('');

		console.log(Chart(superimpose(settings, {
			title: settings.title + ' Doubled, inline labels false',
			render: {
				showInlineLabels: false,
				style: 'squared',
				colors: 'cool'
			}
		})).join('\n'));

		console.log('');
		console.log('');

		console.log(Chart(superimpose(settings, {
			title: settings.title + ' Normal',
			render: {
				style: 'doubled',
				colors: 'blue'
			}
		})).join('\n'));

		[
			'bright',
			'dim',
			'cool',
			'red',
			'cyan'
		]
			.forEach((colors) => {
				console.log('');
				console.log('');

				console.log(Chart(superimpose(settings, {
					title: `${ settings.title }, ${ colors }`,
					render: {
						colors
					}
				})).join('\n'));
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

runChartVariants(boxChart, {
	title: 'Box Chart',
	render: {
		width: 120,
		fractionDigits: 2,
		showInlineLabels: true,
		showDots: true
	},
	data: [{
		data: [20, 50, 50, 90, 90, 90, 90, 92, 92, 92, 97],
		label: 'first',
		group: ['Top']
	}, {
		data: [95, 97, 99, 100],
		label: 'second',
		group: ['Top']
	}, {
		data: [2, 13, 24],
		label: 'third',
		group: ['Bottom']
	}, {
		data: [0.1, 0.2],
		label: 'four',
		group: ['Bottom']
	}, {
		data: [2],
		label: 'five',
		group: ['Bottom']
	}],
	xAxis: {
		label: 'Hz'
	}
});
