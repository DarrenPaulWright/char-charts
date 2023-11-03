import chalk from 'chalk';
import { deepEqual } from 'object-agent';
import { BASE_LABEL_OFFSET, GROUP_LABEL_OFFSET } from '../constants.js';
import { INDENT_WIDTH } from '../render/chars.js';
import type { IBandDomain, IChartDataInternal } from '../types';
import Scale from './Scale.js';

const addRow = (array: Array<IBandDomain>, data: IBandDomain): void => {
	const previous = array[array.length - 1];

	if (previous) {
		previous.siblings[1] = data;
	}

	data.siblings[0] = previous;

	array.push(data);
};

export default class BandScale extends Scale {
	protected processData(data: Array<IChartDataInternal>): void {
		let currentGroup: Array<Array<string>> = [];

		this.domain = data.reduce<Array<IBandDomain>>((result, value) => {
			if (!deepEqual(value.group, currentGroup)) {
				let isNew = false;

				value.group.forEach((group, index) => {
					this._isGrouped = true;

					const maxLabelWidth = group.reduce<number>((max, label) => {
						return Math.max(max, label.length);
					}, 0);

					this.maxLabelWidth = Math.max(
						this.maxLabelWidth,
						(maxLabelWidth + GROUP_LABEL_OFFSET) + (index * INDENT_WIDTH)
					);

					if (isNew || !deepEqual(currentGroup[index], group)) {
						addRow(result, {
							label: group,
							value: 0,
							group: [],
							isGroup: true,
							groupIndent: index,
							color: chalk.white,
							bgColor: chalk.bgWhite,
							siblings: [],
							hasExtraRow: false
						});

						isNew = true;
					}
				});

				currentGroup = value.group;
			}

			addRow(result, value as IBandDomain);

			const maxLabelWidth = value.label.reduce<number>((max, label) => {
				return Math.max(max, label.length);
			}, 0);

			this.maxLabelWidth = Math.max(
				this.maxLabelWidth,
				maxLabelWidth + (this._isGrouped ? GROUP_LABEL_OFFSET : BASE_LABEL_OFFSET)
			);

			return result;
		}, []);

		if (this.maxLabelWidth === BASE_LABEL_OFFSET) {
			this.maxLabelWidth = 0;
		}
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	getCharOffset(): number {
		return 0;
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	isMajorTick(): boolean {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this,@typescript-eslint/no-empty-function
	setRange(): void {
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	ticks(): Array<number> {
		return [];
	}
}
