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
			width: 40,
			colors: 'none',
			showInlineLabels: false
		},
		data: []
	};

	it('should render something if no data is provided', () => {
		const data = boxChart(defaultSettings);

		assert.equal(data, [
			'╭──────┬───────┬───────┬───────┬───────╮',
			'╰──────┴───────┴───────┴───────┴───────╯',
			'0    200m    400m    600m    800m      1'
		]);
	});

	it('should render an empty row if data is empty array', () => {
		const data = boxChart({
			...defaultSettings,
			data: [
				{ data: [], label: 'first' }
			]
		});

		assert.equal(data, [
			'      ╭───────┬───────┬───────┬────────╮',
			'first │       ╵       ╵       ╵        │',
			'      ╰───────┴───────┴───────┴────────╯',
			'      0     250m    500m    750m       1'
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
				'one      ╭─────────┬─────────┬─────────┬──────────╮',
				'   two   │         ╵        ╭─ Mdn: 46 ╵          │',
				'   first │         ╵     ┣━░▓▓━━┫      ╵          │',
				'         ╰─────────┴─────────┴─────────┴──────────╯',
				'         0        25        50        75        100'
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
				'one      ╭─────────┬─────────┬─────────┬──────────╮',
				'   two   │         ╵         ╵      Mdn: 86 ─╮    │',
				'   first │         ╵         ╵         ╵  ┣━░▓▓━┫ │',
				'         ╰─────────┴─────────┴─────────┴──────────╯',
				'         0        25        50        75        100'
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
					data: [43, 48, 48, 48, 48, 53, 53, 53, 59],
					label: 'first',
					group: ['two']
				}]
			});

			assert.equal(data, [
				'one         ╭────────┬─────────┬────────┬─────────╮',
				'  blah blah │  ░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓━━━━━━━━━━━━━┫   │',
				'two         │       ╰─ Mdn: 20 ╭─ Mdn: 48         │',
				'      first │        ╵      ┣━░▓▓━┫     ╵         │',
				'            ╰────────┴─────────┴────────┴─────────╯',
				'            0       25        50       75       100'
			]);
		});

		it('should place a label to the left in a prev group row with labels', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [10, 20, 30, 40, 52, 60, 70, 80, 90],
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
				'  blah blah │  ┣━━━━━━━░░░░░░░░░▓▓▓▓▓▓▓━━━━━━━┫   │',
				'two         │        Mdn: 46 ─╮╵╰─ Mdn: 52        │',
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
				'two         │        ╵   ╰─ Mdn: 35     ╵         │',
				'      first │        ╵     ┣━░▓▓━┫ ── Mdn: 46     │',
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
				'blah blah │         ╵     ┣━░▓▓━┫ ── Mdn: 46      │',
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
					'blah blah │   ·     ╵     ┣━░▓▓━┫·── Mdn: 46·     │',
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
					'blah blah │         ╵     ┣━░▓▓━┫  ·── Mdn: 49    │',
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
					'blah blah │         ╵     ┣━░▓▓━┫  ·── Mdn: 49    │',
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
				'blah blah │    Mdn: 49 ── ┣━░▓▓━┫   ·   ╵         │',
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
					'blah blah │    Mdn: 46 ──·┣━░▓▓━┫   ·   ╵         │',
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
					'blah blah │   Mdn: 46 ──· ┣━░▓▓━┫   ·   ╵         │',
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
					'blah blah │  Mdn: 46 ──·  ┣━░▓▓━┫   ·   ╵         │',
					'          ╰─────────┴─────────┴─────────┴─────────╯',
					'          0        25        50        75       100'
				]);
			}
		);

		it('should place a label in an extra row if prev row is occupied and outliers are in the way', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [63, 74, 76, 76, 76, 76, 84, 84, 84, 90],
					label: 'blah blah'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵         ╵    ·   ┣░▓▓▓━━┫   │',
				'          │         ╵         ╵         ╵╰─ Mdn: 76',
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
					'          │         ╵         ╵  Mdn: 82 ─╯       │',
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
				'blah blah │         ╵     ╭─ Mdn: 40·   ╵┣░▓▓▓━┫  │',
				'      two │         ╵ ┣━░░▓▓▓━┫   Mdn: 82 ─╯      │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should not create an extra row if labels fit', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [62, 74, 76, 76, 76, 76, 84, 84, 84, 90],
					label: 'blah blah'
				}, {
					data: [30, 40, 50, 60, 70],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵Mdn: 50 ─╮   ·    ┣░▓▓▓━━┫   │',
				'      two │         ╵ ┣━━━░░░░▓▓▓▓▓━━━┫ ╵╰─ Mdn: 76',
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
				'blah blah │       ╭─ Mdn: 20  ╵   ·    ┣░▓▓▓━┫    │',
				'      two │   ┣━░░▓▓▓━┫       ╵         ╵╰─ Mdn: 77',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place labels for next row on extra row if needed', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [40, 60, 84, 84, 84, 84, 86, 86, 86, 92],
					label: 'blah blah'
				}, {
					data: [30, 40, 50, 60, 70, 90],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵     ·   ╵   ·     ╵  ░▓ ·   │',
				'          │         ╵  Mdn: 55 ─╮ Mdn: 84 ─╯      │',
				'      two │         ╵ ┣━━━░░░░░░▓▓▓▓▓▓▓━━━━━━━┫   │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place labels to the left if previous row label is in the way', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [40, 60, 76, 78, 78, 78, 78, 86, 86, 86, 92],
					label: 'blah blah'
				}, {
					data: [30, 40, 50, 60, 70],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵     ·   ╵   ·     ░▓▓▓▓━┫   │',
				'      two │Mdn: 50 ── ┣━━━░░░░▓▓▓▓▓━━━┫ ╵╰─ Mdn: 78',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});

		it('should place labels on extra row if previous row label is in the way', () => {
			const data = boxChart({
				...defaultSettings,
				data: [{
					data: [40, 60, 76, 78, 78, 78, 78, 86, 86, 86, 92],
					label: 'blah blah'
				}, {
					data: [20, 30, 40, 50, 60, 70],
					label: 'two'
				}]
			});

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'blah blah │         ╵     ·   ╵   ·     ░▓▓▓▓━┫   │',
				'      two │       ┣━━━░░░░░░▓▓▓▓▓▓▓━━━┫ ╵╰─ Mdn: 78',
				'          │         ╵       ╰─ Mdn: 45  ╵         │',
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
					data: [30, 80],
					label: 'blah blah'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │         ╵ ·       ╵ ╭─ Mdn: 55·       │',
				'blah blah │         ╵ ░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓       │',
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
					data: [28, 75],
					label: 'blah blah'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │         ╵·Mdn: 52 ─╮        ·         │',
				'blah blah │         ╵░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓         │',
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
				'blah blah │         ╵ ┣━━━░░░░▓▓▓▓▓━━━┫ ── Mdn: 50│',
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
				'blah blah │    Mdn: 60 ── ┣━━━░░░░▓▓▓▓▓━━━┫       │',
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
					data: [28, 40, 45, 50, 55, 55, 60, 80],
					label: 'blah blah'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │         ╵·    · · · • ·     ╵ ·       │',
				'blah blah Mdn: 53 ──╵┣━━━━━░░░░▓▓▓━━━━━━━━┫       │',
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
				'          │         ╵         ╵╰─ Mdn: 53         │',
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
				'          │       · ╵     · ··●╰─ Mdn: 53     ·   │',
				'      two │         ╵     ┣░░░▓ ── Mdn: 49        │',
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
					data: [20, 40, 45, 53, 57, 57, 62, 82],
					label: 'blah blah'
				}, {
					data: [20, 40, 45, 48, 50, 50, 53, 81],
					label: 'two'
				}]
			}) as ISettings);

			assert.equal(data, [
				'          ╭─────────┬─────────┬─────────┬─────────╮',
				'          │       · ╵     · · ╵·• ·     ╵ ·       │',
				'blah blah │       ┣━━━━━━━━░░░░░▓▓━━━━━━━━┫       │',
				'          │       · ╵     · ··•·╰─ Mdn: 55·       │',
				'      two │         ╵     ┣░░░▓┫        ╵         │',
				'          │         ╵         ╰─ Mdn: 49╵         │',
				'          ╰─────────┴─────────┴─────────┴─────────╯',
				'          0        25        50        75       100'
			]);
		});
	});
});

describe('full', () => {
	const defaultSettings: ISettings = {
		render: {
			width: 40,
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
				width: 41,
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
			'               Test chart                ',
			'       ╭───────┬───────┬───────┬────────╮',
			' first │     · ╵       ┣━━━━━━░░░░░░░▓━┫│',
			'second │   ╭─ Mdn: 13.00 Mdn: 90.00 ─╯░▓│',
			' third ┣━░░▓▓▓┫╵       ╵   Mdn: 97.00 ─╯│',
			'  four ░ ── Mdn: 0.15  ╵       ╵        │',
			'  five ┃ ── Mdn: 2.00  ╵       ╵        │',
			'       ╰───────┴───────┴───────┴────────╯',
			'       0      25      50      75      100',
			'                       Hz                '
		]);
	});

	it('should render a full chart with multiple data points and wrapping text', () => {
		const data = boxChart(superimpose(defaultSettings, {
			title: 'Test chart',
			render: {
				width: 51,
				fractionDigits: 2,
				showInlineLabels: true
			},
			data: [
				{
					data: [20, 50, 90, 90, 90, 92, 92, 97],
					label: 'first with a long title that should wrap'
				},
				{ data: [95, 97, 99], label: 'second' },
				{ data: [2, 13, 24], label: 'third' },
				{ data: [0.1, 0.2], label: 'four with a long title that should wrap' },
				{ data: [2], label: 'five' }
			],
			xAxis: {
				label: 'Hz'
			}
		}) as ISettings);

		assert.equal(data, [
			'                    Test chart                     ',
			'                  ╭───────┬───────┬───────┬───────╮',
			'            first │       ╵       ╵       ╵       │',
			'with a long title │       ╵       ╵       ╵       │',
			' that should wrap │     · ╵       ┣━━━━━░░░░░░░▓━┫│',
			'           second │       ╵       ╵Mdn: 90.00 ─╯░▓│',
			'            third ┣━░░▓▓━┫╵       ╵  Mdn: 97.00 ─╯│',
			'             four │   ╰─ Mdn: 13.00       ╵       │',
			'with a long title │       ╵       ╵       ╵       │',
			' that should wrap ░       ╵       ╵       ╵       │',
			'                  ╰─ Mdn: 0.15    ╵       ╵       │',
			'             five ┃ ── Mdn: 2.00  ╵       ╵       │',
			'                  ╰───────┴───────┴───────┴───────╯',
			'                  0      25      50      75     100',
			'                                 Hz                '
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
			'   first │       ╵        │        ╵     Mdn: 91.00 ── ┣━━░░▓│',
			'         │       ╵        │        ╵       │        ╵       •·',
			'  second │       ╵        │        ╵       │        ╵       ░┫',
			'two      │       ╵        │       Mdn: 13.00 ─╮  Mdn: 97.00 ─╯',
			'         │       ╵        │    ·   ╵       │ ·    · ╵        │',
			'   third │  ╭─ Mdn: 0.15  │    ┣━━━━━━━━━░░░░░▓▓▓━┫ ╵        │',
			'         ·    ·  ╵        │        ╵       │        ╵        │',
			'    four ░░░▓▓▓  ╵        │    ╭─ Mdn: 2.00│        ╵        │',
			'         │       ╵        │    ·   ╵       │        ╵        │',
			'    five │       ╵        │    ┃   ╵       │        ╵        │',
			'         ╰───────┴────────┼────────┴───────┼────────┴────────╯',
			'         100m  320m       1       3.2     10       32      100',
			'                                  Hz                          '
		]);
	});

	it('should render sorted groups with extra rows', () => {
		const data = boxChart(superimpose(defaultSettings, {
			title: 'Test chart Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
			render: {
				width: 72,
				fractionDigits: 2,
				showInlineLabels: true,
				showDots: true,
				extraRowSpacing: true,
				sortLabels: 'asc'
			},
			data: [
				{
					data: [50, 90, 92, 97],
					label: 'first with a long title that should wrap',
					group: ['one with wrapping text that is kinda long', 'inner']
				},
				{
					data: [2, 13, 24],
					label: 'third',
					group: ['two with wrapping text that is kinda long']
				},
				{
					data: [0.1, 0.2],
					label: 'fourth',
					group: ['two with wrapping text that is kinda long']
				},
				{
					data: [95, 97, 100],
					label: 'second',
					group: ['one with wrapping text that is kinda long']
				},
				{
					data: [2],
					label: 'fifth with a long title that should wrap',
					group: ['two with wrapping text that is kinda long']
				}
			],
			xAxis: {
				scale: 'log',
				label: 'Hz (Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore)'
			}
		}) as ISettings);

		assert.equal(data, [
			'  Test chart Lorem ipsum dolor sit amet, consectetur adipiscing elit,   ',
			'               sed do eiusmod tempor incididunt ut labore               ',
			'one with wrapping   ╭───────┬───────┬────────┬────────┬───────┬────────╮',
			'text that is        │       ╵       │        ╵        │       ╵        │',
			'kinda long          │       ╵       │        ╵        │       ╵        │',
			'   inner            │       ╵       │        ╵        │       ╵        │',
			'              first │       ╵       │        ╵        │       ╵        │',
			'        with a long │       ╵       │        ╵        │       ╵        │',
			'         title that │       ╵       │        ╵        │       ╵  ·    ●│',
			'        should wrap │       ╵       │        ╵        │       ╵  ┣━━░░▓│',
			'                    │       ╵       │        ╵        │   Mdn: 91.00 ─╯│',
			'                    │       ╵       │        ╵        │       ╵       •·',
			'             second │       ╵       │        ╵        │       ╵       ░┫',
			'                    │       ╵       │        ╵        │    Mdn: 97.00 ─╯',
			'two with wrapping   │       ╵       │        ╵        │       ╵        │',
			'text that is        │       ╵       │        ╵        │       ╵        │',
			'kinda long          │       ╵       │        ╵        │       ╵        │',
			'              fifth │       ╵       │        ╵        │       ╵        │',
			'  with a long title │       ╵       │     ·  ╵        │       ╵        │',
			'   that should wrap │       ╵       │     ┃  ╵        │       ╵        │',
			'                    │       ╵       │     ╰─ Mdn: 2.00│       ╵        │',
			'                    ·    ·  ╵       │        ╵        │       ╵        │',
			'             fourth ░░░▓▓▓  ╵       │        ╵        │       ╵        │',
			'                    │  ╰─ Mdn: 0.15 │        ╵        │ ╭─ Mdn: 13.00  │',
			'                    │       ╵       │     ·  ╵        │·    · ╵        │',
			'              third │       ╵       │     ┣━━━━━━━━░░░░░▓▓▓━┫ ╵        │',
			'                    ╰───────┴───────┼────────┴────────┼───────┴────────╯',
			'                    100m  320m      1       3.2      10      32      100',
			'                        Hz (Lorem ipsum dolor sit amet, consectetur     ',
			'                    adipiscing elit, sed do eiusmod tempor incididunt ut',
			'                                          labore)                       '
		]);
	});
});
