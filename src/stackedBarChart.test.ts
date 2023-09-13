import { assert, it } from 'hippogriff';
import { stackedBarChart } from '../index.js';
import type { ISettings } from './types';

const defaultSettings: ISettings = {
	render: {
		width: 40,
		colors: 'none'
	},
	data: []
};

it('should render something if no data is provided', () => {
	const data = stackedBarChart(defaultSettings);

	assert.equal(data, [
		'╭──────┬───────┬───────┬───────┬───────╮',
		'╰──────┴───────┴───────┴───────┴───────╯',
		'0    200m    400m    600m    800m      1'
	]);
});

it('should render something if one data point is provided', () => {
	const data = stackedBarChart({
		...defaultSettings,
		data: [
			{ value: [97], label: 'first' }
		]
	});

	assert.equal(data, [
		'      ╭───────┬───────┬───────┬────────╮',
		'first ▐████████████████████████████████│',
		'      ╰───────┴───────┴───────┴────────╯',
		'      0      25      50      75      100'
	]);
});

it('should render multiple stacks', () => {
	const data = stackedBarChart({
		...defaultSettings,
		data: [
			{ value: [50, 25, 22], label: 'first' }
		]
	});

	assert.equal(data, [
		'      ╭───────┬───────┬───────┬────────╮',
		'first ▐████████████████▒▒▒▒▒▒▒▒░░░░░░░░│',
		'      ╰───────┴───────┴───────┴────────╯',
		'      0      25      50      75      100'
	]);
});

it('should render groups', () => {
	const data = stackedBarChart({
		...defaultSettings,
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

	assert.equal(data, [
		'Fruit     ╭────────┬─────────┬─────────╮',
		'  Oranges ▐█▒▒▒▒░░░░░░████   │         │',
		'   Apples ▐██▒▒▒▒▒▒░░░░░░░░░█████      │',
		'    Pears ▐███▒▒▒▒░░░░░░░█████         │',
		'Nuts      │        │         │         │',
		'   Almond ▐█▒▒▒▒░░░░░░████   │         │',
		'   Peanut ▐██▒▒▒▒▒▒░░░░░░░░░█████      │',
		'    Pecan │        │         │         │',
		'          ╰────────┼─────────┼─────────╯',
		'          0       10        20        30'
	]);
});
