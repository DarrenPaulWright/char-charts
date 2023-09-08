import chalk from 'chalk';
import { deepEqual } from 'object-agent';
import { INDENT_WIDTH } from '../render/chars.js';
import Scale from './Scale.js';
const addRow = (array, data) => {
    const previous = array[array.length - 1];
    if (previous) {
        previous.siblings[1] = data;
    }
    data.siblings[0] = previous;
    array.push(data);
};
export default class BandScale extends Scale {
    processData(data) {
        let currentGroup = [];
        this.domain = data.reduce((result, value) => {
            if (!deepEqual(value.group, currentGroup)) {
                let isNew = false;
                value.group.forEach((group, index) => {
                    this._isGrouped = true;
                    this.maxLabelWidth = Math.max(this.maxLabelWidth, (group.length + 3) + (index * INDENT_WIDTH));
                    if (isNew || currentGroup[index] !== group) {
                        addRow(result, {
                            label: group,
                            value: 0,
                            group: [],
                            isGroup: true,
                            groupIndent: index,
                            color: chalk.white,
                            bgColor: chalk.bgWhite,
                            siblings: []
                        });
                        isNew = true;
                    }
                });
                currentGroup = value.group;
            }
            addRow(result, value);
            this.maxLabelWidth = Math.max(this.maxLabelWidth, value.label.length + (this._isGrouped ? 3 : 1));
            return result;
        }, []);
    }
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    getCharOffset() {
        return 0;
    }
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    isMajorTick() {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this,@typescript-eslint/no-empty-function
    setRange() {
    }
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    ticks() {
        return [];
    }
}
