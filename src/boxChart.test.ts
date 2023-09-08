import { assert, describe, it } from 'hippogriff';
import { superimpose } from 'object-agent';
import { boxChart } from '../index.js';
import type { ISettings } from './types';

const xAxisSettings = {
	start: 0,
	end: 100,
	tickValue: 25
};

describe('single row', () => {
	const defaultSettings: ISettings = {
		render: {
			colors: 'none',
			showInlineLabels: false
		},
		data: []
	};

	it('should render something if no data is provided', () => {
		const data = boxChart(defaultSettings);

		assert.equal(data, [
			'          ╭──────┬──────┬──────┬───────╮',
			'undefined ┃      ╵      ╵      ╵       │',
			'          ╰──────┴──────┴──────┴───────╯',
			'          0    250m   500m   750m      1'
		]);
	});

	it('should render a single character for one datum', () => {
		const data = boxChart({
			...defaultSettings,
			xAxis: xAxisSettings,
			data: [
				{ data: [53], label: 'first' }
			]
		});

		assert.equal(data, [
			'      ╭───────┬───────┬───────┬────────╮',
			'first │       ╵       ╵┃      ╵        │',
			'      ╰───────┴───────┴───────┴────────╯',
			'      0      25      50      75      100'
		]);
	});

	it('should render a box for two datum', () => {
		const data = boxChart({
			...defaultSettings,
			xAxis: xAxisSettings,
			data: [
				{ data: [30, 70], label: 'first' }
			]
		});

		assert.equal(data, [
			'      ╭───────┬───────┬───────┬────────╮',
			'first │       ╵░░░░░░░░▓▓▓▓▓▓▓╵        │',
			'      ╰───────┴───────┴───────┴────────╯',
			'      0      25      50      75      100'
		]);
	});

	it('should render a box for two datum on a single character', () => {
		const data = boxChart({
			...defaultSettings,
			xAxis: xAxisSettings,
			data: [
				{ data: [69, 70], label: 'first' }
			]
		});

		assert.equal(data, [
			'      ╭───────┬───────┬───────┬────────╮',
			'first │       ╵       ╵     ░▓╵        │',
			'      ╰───────┴───────┴───────┴────────╯',
			'      0      25      50      75      100'
		]);
	});

	it('should render a Q1 fill on a single character', () => {
		const data = boxChart({
			...defaultSettings,
			xAxis: xAxisSettings,
			data: [
				{ data: [68, 68.7, 69], label: 'first' }
			]
		});

		assert.equal(data, [
			'      ╭───────┬───────┬───────┬────────╮',
			'first │       ╵       ╵     ░ ╵        │',
			'      ╰───────┴───────┴───────┴────────╯',
			'      0      25      50      75      100'
		]);
	});

	it('should render a box with whiskers for three datum', () => {
		const data = boxChart({
			...defaultSettings,
			xAxis: xAxisSettings,
			data: [
				{ data: [30, 60, 70], label: 'first' }
			]
		});

		assert.equal(data, [
			'      ╭───────┬───────┬───────┬────────╮',
			'first │       ╵┣━━━━░░░░░░▓▓━┫╵        │',
			'      ╰───────┴───────┴───────┴────────╯',
			'      0      25      50      75      100'
		]);
	});

	it('should prioritize box over whiskers on a single character', () => {
		const data = boxChart({
			...defaultSettings,
			xAxis: xAxisSettings,
			data: [
				{ data: [49, 49.5, 50], label: 'first' }
			]
		});

		assert.equal(data, [
			'      ╭───────┬───────┬───────┬────────╮',
			'first │       ╵       ▓       ╵        │',
			'      ╰───────┴───────┴───────┴────────╯',
			'      0      25      50      75      100'
		]);
	});

	it('should prioritize box over whiskers on two characters', () => {
		const data = boxChart({
			...defaultSettings,
			xAxis: xAxisSettings,
			data: [
				{ data: [49, 51, 53], label: 'first' }
			]
		});

		assert.equal(data, [
			'      ╭───────┬───────┬───────┬────────╮',
			'first │       ╵       ░▓      ╵        │',
			'      ╰───────┴───────┴───────┴────────╯',
			'      0      25      50      75      100'
		]);
	});

	it('should prioritize box over whiskers on more characters', () => {
		const data = boxChart({
			...defaultSettings,
			xAxis: xAxisSettings,
			data: [
				{ data: [25, 26, 26, 26, 74, 74, 74, 75], label: 'first' }
			]
		});

		assert.equal(data, [
			'      ╭───────┬───────┬───────┬────────╮',
			'first │       ░░░░░░░░░▓▓▓▓▓▓▓▓        │',
			'      ╰───────┴───────┴───────┴────────╯',
			'      0      25      50      75      100'
		]);
	});

	it('should show the right side of the box if 3 or more characters', () => {
		const data = boxChart(superimpose(defaultSettings, {
			xAxis: xAxisSettings,
			render: {
				width: 47
			},
			data: [
				{ data: [46, 46, 46, 51, 51, 51, 51], label: 'first' }
			]
		}) as ISettings);

		assert.equal(data, [
			'      ╭─────────┬─────────┬─────────┬─────────╮',
			'first │         ╵       ░░▓         ╵         │',
			'      ╰─────────┴─────────┴─────────┴─────────╯',
			'      0        25        50        75       100'
		]);
	});

	it('should show the left side of the box if 3 or more characters', () => {
		const data = boxChart(superimpose(defaultSettings, {
			xAxis: xAxisSettings,
			render: {
				width: 47
			},
			data: [
				{ data: [46, 46, 46, 46, 51, 51, 51], label: 'first' }
			]
		}) as ISettings);

		assert.equal(data, [
			'      ╭─────────┬─────────┬─────────┬─────────╮',
			'first │         ╵       ░▓▓         ╵         │',
			'      ╰─────────┴─────────┴─────────┴─────────╯',
			'      0        25        50        75       100'
		]);
	});

	it('should show the right side of the box if 3 or more characters with whiskers', () => {
		const data = boxChart(superimpose(defaultSettings, {
			xAxis: xAxisSettings,
			render: {
				width: 47
			},
			data: [
				{
					data: [41, 46, 46, 46, 51, 51, 51, 51, 57],
					label: 'first'
				}
			]
		}) as ISettings);

		assert.equal(data, [
			'      ╭─────────┬─────────┬─────────┬─────────╮',
			'first │         ╵     ┣━░░▓━┫       ╵         │',
			'      ╰─────────┴─────────┴─────────┴─────────╯',
			'      0        25        50        75       100'
		]);
	});

	it('should show the left side of the box if 3 or more characters with whiskers', () => {
		const data = boxChart(superimpose(defaultSettings, {
			xAxis: xAxisSettings,
			render: {
				width: 47
			},
			data: [
				{
					data: [41, 46, 46, 46, 46, 51, 51, 51, 57],
					label: 'first'
				}
			]
		}) as ISettings);

		assert.equal(data, [
			'      ╭─────────┬─────────┬─────────┬─────────╮',
			'first │         ╵     ┣━░▓▓━┫       ╵         │',
			'      ╰─────────┴─────────┴─────────┴─────────╯',
			'      0        25        50        75       100'
		]);
	});
});

describe('labels', () => {
	const defaultSettings: ISettings = {
		render: {
			width: 51,
			colors: 'none',
			showInlineLabels: true
		},
		data: [],
		xAxis: xAxisSettings
	};

	describe('groups', () => {
		it('should place a label to the right in a prev group row', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [41, 46, 46, 46, 46, 51, 51, 51, 57],
					label: 'first',
					group: ['one', 'two']
				}]
			});

			assert.equal(data, [
				'one       ╭─────────┬─────────┬─────────┬─────────╮',
				'─── two   │         ╵        ╭─ μ½: 46  ╵         │',
				'    first │         ╵     ┣━░▓▓━┫       ╵         │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a label to the left in a prev group row', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [81, 86, 86, 86, 86, 91, 91, 91, 97],
					label: 'first',
					group: ['one', 'two']
				}]
			});

			assert.equal(data, [
				'one       ╭─────────┬─────────┬─────────┬─────────╮',
				'─── two   │         ╵         ╵      μ½: 86 ─╮    │',
				'    first │         ╵         ╵         ╵ ┣━░▓▓━┫ │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a label to the right in a prev group row with labels', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [10,
						10,
						10,
						10,
						10,
						10,
						10,
						20,
						30,
						40,
						50,
						60,
						70,
						80,
						90],
					label: 'blah blah',
					group: ['one']
				}, {
					data: [41, 46, 46, 46, 46, 51, 51, 51, 57],
					label: 'first',
					group: ['two']
				}]
			});

			assert.equal(data, [
				'one         ╭────────┬─────────┬────────┬─────────╮',
				'  blah blah │  ░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓━━━━━━━━━━━━━┫   │',
				'two         │       ╰─ μ½: 20 ╭─ μ½: 46 ╵         │',
				'      first │        ╵     ┣━░▓▓━┫      ╵         │',
				'            ╰────────┴─────────┴────────┴─────────╯',
				'            0       25        50       75       100'
			]);
		});

		it('should place a label to the left in a prev group row with labels', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [10, 20, 30, 40, 50, 60, 70, 80, 90],
					label: 'blah blah',
					group: ['one']
				}, {
					data: [41, 46, 46, 46, 46, 51, 51, 51, 57],
					label: 'first',
					group: ['two']
				}]
			});

			assert.equal(data, [
				'one         ╭────────┬─────────┬────────┬─────────╮',
				'  blah blah │  ┣━━━━━━━░░░░░░░░▓▓▓▓▓▓▓▓━━━━━━━┫   │',
				'two         │        ╵μ½: 46 ─╮╰─ μ½: 50╵         │',
				'      first │        ╵     ┣━░▓▓━┫      ╵         │',
				'            ╰────────┴─────────┴────────┴─────────╯',
				'            0       25        50       75       100'
			]);
		});

		it('should place a label on the same row if a prev group row has a label on the median', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [10, 10, 10, 10, 20, 30, 40, 50, 60, 70, 80, 90],
					label: 'blah blah',
					group: ['one']
				}, {
					data: [41, 46, 46, 46, 46, 51, 51, 51, 57],
					label: 'first',
					group: ['two']
				}]
			});

			assert.equal(data, [
				'one         ╭────────┬─────────┬────────┬─────────╮',
				'  blah blah │  ░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓━━━━━━━━━┫   │',
				'two         │        ╵   ╰─ μ½: 35      ╵         │',
				'      first │        ╵     ┣━░▓▓━┫ ── μ½: 46      │',
				'            ╰────────┴─────────┴────────┴─────────╯',
				'            0       25        50       75       100'
			]);
		});
	});

	describe('outliers', () => {
		it('should place a label to the right if prev row is occupied and space is available', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [41, 46, 46, 46, 46, 51, 52, 52, 57],
					label: 'blah blah'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵     ┣━░▓▓━┫ ── μ½: 46       │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it(
			'should place a label to the right if prev row is occupied and space is available, outlier in first space',
			() => {
				const data = boxChart({
					...defaultSettings,
					data: [{
						data: [10,
							11,
							41,
							46,
							46,
							46,
							46,
							51,
							51,
							51,
							55,
							59,
							85],
						label: 'blah blah'
					}]
				});

				assert.equal(data, [
					'          ╭─────────┬─────────┬─────────┬─────────╮',
					'blah blah │   ·     ╵     ┣━░▓▓━┫·── μ½: 46 ·     │',
					'          ╰─────────┴─────────┴─────────┴─────────╯',
					'          0        25        50        75       100'
				]);
			}
		);

		it(
			'should place a label to the right if prev row is occupied and space is available, outlier in second space',
			() => {
				const data = boxChart({
					...defaultSettings,
					data: [{
						data: [41, 46, 46, 46, 46, 51, 51, 51, 57, 63],
						label: 'blah blah'
					}]
				});

				assert.equal(data, [
					'          ╭─────────┬─────────┬─────────┬─────────╮',
					'blah blah │         ╵     ┣━░▓▓━┫  ·── μ½: 49     │',
					'          ╰─────────┴─────────┴─────────┴─────────╯',
					'          0        25        50        75       100'
				]);
			}
		);

		it(
			'should place a label to the right if prev row is occupied and space is available, outlier in third space',
			() => {
				const data = boxChart({
					...defaultSettings,
					data: [{
						data: [41, 46, 46, 46, 46, 51, 51, 51, 57, 63],
						label: 'blah blah'
					}]
				});

				assert.equal(data, [
					'          ╭─────────┬─────────┬─────────┬─────────╮',
					'blah blah │         ╵     ┣━░▓▓━┫  ·── μ½: 49     │',
					'          ╰─────────┴─────────┴─────────┴─────────╯',
					'          0        25        50        75       100'
				]);
			}
		);

		it('should place a label to the left if prev row is occupied and space is available', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [41, 46, 46, 46, 46, 51, 51, 51, 57, 67],
					label: 'blah blah'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │     μ½: 49 ── ┣━░▓▓━┫   ·   ╵         │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it(
			'should place a label to the left if prev row is occupied and space is available, outlier in first space',
			() => {
				const data = boxChart({
					...defaultSettings,
					data: [{
						data: [38, 41, 46, 46, 46, 46, 51, 51, 51, 57, 67],
						label: 'blah blah'
					}]
				});

				assert.equal(data, [
					'          ╭─────────┬─────────┬─────────┬─────────╮',
					'blah blah │     μ½: 46 ──·┣━░▓▓━┫   ·   ╵         │',
					'          ╰─────────┴─────────┴─────────┴─────────╯',
					'          0        25        50        75       100'
				]);
			}
		);

		it(
			'should place a label to the left if prev row is occupied and space is available, outlier in second space',
			() => {
				const data = boxChart({
					...defaultSettings,
					data: [{
						data: [35, 41, 46, 46, 46, 46, 51, 51, 51, 57, 67],
						label: 'blah blah'
					}]
				});

				assert.equal(data, [
					'          ╭─────────┬─────────┬─────────┬─────────╮',
					'blah blah │    μ½: 46 ──· ┣━░▓▓━┫   ·   ╵         │',
					'          ╰─────────┴─────────┴─────────┴─────────╯',
					'          0        25        50        75       100'
				]);
			}
		);

		it(
			'should place a label to the left if prev row is occupied and space is available, outlier in third space',
			() => {
				const data = boxChart({
					...defaultSettings,
					data: [{
						data: [33, 41, 46, 46, 46, 46, 51, 51, 51, 57, 67],
						label: 'blah blah'
					}]
				});

				assert.equal(data, [
					'          ╭─────────┬─────────┬─────────┬─────────╮',
					'blah blah │   μ½: 46 ──·  ┣━░▓▓━┫   ·   ╵         │',
					'          ╰─────────┴─────────┴─────────┴─────────╯',
					'          0        25        50        75       100'
				]);
			}
		);

		it('should place a label in an extra row if prev row is occupied and outliers are in the way', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [63, 74, 78, 78, 78, 78, 84, 84, 84, 90],
					label: 'blah blah'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵         ╵    ·   ┣━░▓▓━━┫   │',
				'          │         ╵         ╵         ╵ ╰─ μ½: 78',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it(
			'should place a label in an extra row to the left if prev row is occupied and outliers are in the way',
			() => {
				const data = boxChart({
					...defaultSettings,
					data: [{
						data: [67, 78, 82, 82, 82, 82, 88, 88, 88, 94],
						label: 'blah blah'
					}]
				});

				assert.equal(data, [
					'          ╭─────────┬─────────┬─────────┬─────────╮',
					'blah blah │         ╵         ╵     ·   ╵┣░▓▓▓━┫  │',
					'          │         ╵         ╵   μ½: 82 ─╯       │',
					'          ╰─────────┴─────────┴─────────┴─────────╯',
					'          0        25        50        75       100'
				]);
			}
		);

		it('should place a label in the next row if prev row is occupied and outliers are in the way', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [67, 78, 82, 82, 82, 82, 88, 88, 88, 94],
					label: 'blah blah'
				}, {
					data: [30, 40, 50],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵     ╭─ μ½: 40 ·   ╵┣░▓▓▓━┫  │',
				'      two │         ╵ ┣━░░▓▓▓━┫    μ½: 82 ─╯      │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should not create an extra row if labels fit', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [62, 74, 78, 78, 78, 78, 84, 84, 84, 90],
					label: 'blah blah'
				}, {
					data: [30, 40, 50, 60, 70],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵ μ½: 50 ─╮   ·    ┣━░▓▓━━┫   │',
				'      two │         ╵ ┣━━━░░░░▓▓▓▓▓━━━┫ ╵ ╰─ μ½: 78',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a label in the prev row if able', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [62, 73, 77, 77, 77, 77, 83, 83, 83, 89],
					label: 'blah blah'
				}, {
					data: [10, 20, 30],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │       ╭─ μ½: 20   ╵   ·    ┣░▓▓▓━┫    │',
				'      two │   ┣━░░▓▓▓━┫       ╵         ╵╰─ μ½: 77│',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place labels for next row on extra row if needed', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [65, 76, 80, 80, 80, 80, 86, 86, 86, 92],
					label: 'blah blah'
				}, {
					data: [30, 40, 50, 60, 70, 90],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵         ╵     ·   ┣━░▓▓━┫   │',
				'          │         ╵   μ½: 55 ─╮ μ½: 80 ─╯       │',
				'      two │         ╵ ┣━━━░░░░░░▓▓▓▓▓▓▓━━━━━━━┫   │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place labels to the left if previous row label is in the way', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [40, 65, 76, 80, 80, 80, 80, 86, 86, 86, 92],
					label: 'blah blah'
				}, {
					data: [30, 40, 50, 60, 70],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵     ·   ╵     ·   ┣░▓▓▓━┫   │',
				'      two │ μ½: 50 ── ┣━━━░░░░▓▓▓▓▓━━━┫ ╵ ╰─ μ½: 80',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place labels on extra row if previous row label is in the way', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [40, 60, 76, 80, 80, 80, 80, 86, 86, 86, 92],
					label: 'blah blah'
				}, {
					data: [20, 30, 40, 50, 60, 70],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵     ·   ╵   ·     ┣░▓▓▓━┫   │',
				'      two │       ┣━━━░░░░░░▓▓▓▓▓▓▓━━━┫ ╵ ╰─ μ½: 80',
				'          │         ╵       ╰─ μ½: 45   ╵         │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});
	});

	describe('showDots', () => {
		it('should place a label to the right', () => {
			const data = boxChart(superimpose(defaultSettings, {
				render: {
					showDots: true
				},
				data: [{
					data: [30, 76],
					label: 'blah blah'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │         ╵ ·       ╵╭─ μ½: 53·         │',
				'blah blah │         ╵ ░░░░░░░░░▓▓▓▓▓▓▓▓▓▓         │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a label to the left', () => {
			const data = boxChart(superimpose(defaultSettings, {
				render: {
					showDots: true
				},
				data: [{
					data: [28, 72],
					label: 'blah blah'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │         ╵·μ½: 50 ─╮       · ╵         │',
				'blah blah │         ╵░░░░░░░░░▓▓▓▓▓▓▓▓▓ ╵         │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a label on the same row if dots are in the way', () => {
			const data = boxChart(superimpose(defaultSettings, {
				render: {
					showDots: true
				},
				data: [{
					data: [30, 50, 70],
					label: 'blah blah'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │         ╵ ·       ·       · ╵         │',
				'blah blah │         ╵ ┣━━━░░░░▓▓▓▓▓━━━┫ ── μ½: 50 │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a label on the same row to the left if dots are in the way', () => {
			const data = boxChart(superimpose(defaultSettings, {
				render: {
					showDots: true
				},
				data: [{
					data: [40, 60, 80],
					label: 'blah blah'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │         ╵     ·   ╵   ·     ╵ ·       │',
				'blah blah │     μ½: 60 ── ┣━━━░░░░▓▓▓▓▓━━━┫       │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a left label all the way to the left edge', () => {
			const data = boxChart(superimpose(defaultSettings, {
				render: {
					showDots: true
				},
				data: [{
					data: [25, 40, 45, 50, 55, 55, 60, 80],
					label: 'blah blah'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │         ·     · · · • ·     ╵ ·       │',
				'blah blah μ½: 53 ── ┣━━━━━━░░░░▓▓▓━━━━━━━━┫       │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a label on an extra row', () => {
			const data = boxChart(superimpose(defaultSettings, {
				render: {
					showDots: true
				},
				data: [{
					data: [20, 40, 45, 50, 55, 55, 60, 80],
					label: 'blah blah'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │       · ╵     · · · • ·     ╵ ·       │',
				'blah blah │       ┣━━━━━━━━░░░░▓▓▓━━━━━━━━┫       │',
				'          │         ╵         ╵╰─ μ½: 53╵         │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a label between wide dots', () => {
			const data = boxChart(superimpose(defaultSettings, {
				render: {
					showDots: true
				},
				data: [{
					data: [20, 40, 45, 50, 55, 55, 60, 80],
					label: 'blah blah'
				}, {
					data: [20, 40, 45, 48, 50, 50, 52, 90],
					label: 'two'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │       · ╵     · · · • ·     ╵ ·       │',
				'blah blah │       ┣━━━━━━━━░░░░▓▓▓━━━━━━━━┫       │',
				'          │       · ╵     · ··●╰─ μ½: 53╵     ·   │',
				'      two │       · ╵     ┣░░░▓ ── μ½: 49     ·   │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place a label between dots', () => {
			const data = boxChart(superimpose(defaultSettings, {
				render: {
					showDots: true
				},
				data: [{
					data: [20, 40, 45, 52, 57, 57, 62, 82],
					label: 'blah blah'
				}, {
					data: [20, 40, 45, 48, 50, 50, 53, 79],
					label: 'two'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │       · ╵     · · · • ·     ╵ ·       │',
				'blah blah │       ┣━━━━━━━━░░░░░▓▓━━━━━━━━┫       │',
				'          │       · ╵     · ··•·╰─ μ½: 55·        │',
				'      two │       · ╵     ┣░░░▓┫        ╵·        │',
				'          │         ╵         ╰─ μ½: 49 ╵         │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});
	});
});

describe('full', () => {
	const defaultSettings: ISettings = {
		render: {
			colors: 'none'
		},
		data: []
	};

	it('should render ascii', () => {
		const data = boxChart(superimpose(defaultSettings, {
			render: {
				style: 'ascii',
				showInlineLabels: false
			},
			data: [
				{ data: [90, 92, 97], label: 'first' }
			]
		}) as ISettings);

		assert.equal(data, [
			'      +-------,-------,-------,--------+',
			'first |~~~####%%%%%%%%%%%~~~~~~~~~|    |',
			'      +-------\'-------\'-------\'--------+',
			'      90     92      94      96       98'
		]);
	});

	it('should render a full chart with multiple data points', () => {
		const data = boxChart(superimpose(defaultSettings, {
			title: 'Test chart',
			render: {
				fractionDigits: 2,
				showInlineLabels: true
			},
			data: [
				{ data: [20, 50, 90, 90, 90, 92, 92, 97], label: 'first' },
				{ data: [95, 97, 99], label: 'second' },
				{ data: [2, 13, 24], label: 'third' },
				{ data: [0.1, 0.2], label: 'four' },
				{ data: [2], label: 'five' }
			],
			xAxis: {
				label: 'Hz'
			}
		}) as ISettings);

		assert.equal(data, [
			'               Test chart               ',
			'       ╭───────┬───────┬───────┬───────╮',
			' first │     · ╵       ┣━━━━━░░░░░░░▓━┫│',
			'second │   ╭─ μ½: 13.00╵ μ½: 90.00 ─╯░▓│',
			' third ┣━░░▓▓━┫╵       ╵   μ½: 97.00 ─╯│',
			'  four ░ ── μ½: 0.15   ╵       ╵       │',
			'  five ┃ ── μ½: 2.00   ╵       ╵       │',
			'       ╰───────┴───────┴───────┴───────╯',
			'       0      25      50      75     100',
			'                      Hz                '
		]);
	});

	it('should render groups and custom width', () => {
		const data = boxChart(superimpose(defaultSettings, {
			title: 'Test chart',
			render: {
				width: 62,
				fractionDigits: 2,
				showInlineLabels: true,
				showDots: true
			},
			data: [
				{ data: [50, 90, 92, 97], label: 'first', group: ['one'] },
				{ data: [95, 97, 100], label: 'second', group: ['one'] },
				{ data: [2, 13, 24], label: 'third', group: ['two'] },
				{ data: [0.1, 0.2], label: 'four', group: ['two'] },
				{ data: [2], label: 'five', group: ['two'] }
			],
			xAxis: {
				scale: 'log',
				label: 'Hz'
			}
		}) as ISettings);

		assert.equal(data, [
			'                          Test chart                          ',
			'one      ╭───────┬────────┬────────┬───────┬────────┬────────╮',
			'         │       ╵        │        ╵       │        ╵  ·    ●│',
			'   first │       ╵        │        ╵      μ½: 91.00 ── ┣━━░░▓│',
			'         │       ╵        │        ╵       │        ╵       •·',
			'  second │       ╵        │        ╵       │        ╵       ░┫',
			'two      │       ╵        │        μ½: 13.00 ─╮   μ½: 97.00 ─╯',
			'         │       ╵        │    ·   ╵       │ ·    · ╵        │',
			'   third │  ╭─ μ½: 0.15   │    ┣━━━━━━━━━░░░░░▓▓▓━┫ ╵        │',
			'         ·    ·  ╵        │        ╵       │        ╵        │',
			'    four ░░░▓▓▓  ╵        │    ╭─ μ½: 2.00 │        ╵        │',
			'         │       ╵        │    ·   ╵       │        ╵        │',
			'    five │       ╵        │    ┃   ╵       │        ╵        │',
			'         ╰───────┴────────┼────────┴───────┼────────┴────────╯',
			'         100m  320m       1       3.2     10       32      100',
			'                                  Hz                          '
		]);
	});
});
