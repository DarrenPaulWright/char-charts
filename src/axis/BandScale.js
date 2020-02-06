import { deepEqual } from 'object-agent';
import { INDENT_WIDTH } from '../render/chars.js';
import Scale from './Scale.js';

const addRow = (array, data) => {
	const prev = array[array.length - 1];

	if (prev) {
		prev.siblings.push(data);
	}

	data.siblings = [prev];

	array.push(data);
};

export default class BandScale extends Scale {
	processData(data) {
		let currentGroup = [];

		this._maxLabelWidth = 0;
		this._isGrouped = false;

		this.domain(data.reduce((result, value) => {
			if (!deepEqual(value.group, currentGroup)) {
				let isNew = false;

				value.group.forEach((group, index) => {
					this._isGrouped = true;
					this._maxLabelWidth = Math.max(this._maxLabelWidth, (group.length + 3) + (index * INDENT_WIDTH));

					if (isNew || currentGroup[index] !== group) {
						addRow(result, {
							label: group,
							groupIndent: index
						});

						isNew = true;
					}
				});

				currentGroup = value.group;
			}

			addRow(result, value);

			this._maxLabelWidth = Math.max(this._maxLabelWidth, value.label.length + 1);

			return result;
		}, []));
	}

	maxLabelWidth() {
		return this._maxLabelWidth;
	}

	isGrouped() {
		return this._isGrouped;
	}
}
