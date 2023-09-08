import chalk from 'chalk';
import { assert, describe, it } from 'hippogriff';
import BandScale from './BandScale.js';
describe('init', () => {
    it('should accept an empty array', () => {
        const scale = new BandScale([]);
        assert.is(scale.domain.length, 0);
        assert.is(scale.maxLabelWidth, 0);
        assert.is(scale.isGrouped(), false);
    });
    it('should set the domain and maxLabelWidth', () => {
        const data = [{
                value: 0,
                label: 'first',
                group: [],
                isGroup: false,
                siblings: [],
                color: chalk.red,
                bgColor: chalk.green
            }, {
                value: 12,
                label: 'second',
                group: [],
                isGroup: false,
                siblings: [],
                color: chalk.red,
                bgColor: chalk.green
            }, {
                value: 7,
                label: 'third',
                group: [],
                isGroup: false,
                siblings: [],
                color: chalk.red,
                bgColor: chalk.green
            }];
        const scale = new BandScale(data);
        const domain = scale.domain;
        assert.is(domain.length, 3);
        domain.forEach((item, index) => {
            assert.is(item.siblings[0], index === 0 ? undefined : domain[index - 1]);
            assert.is(item.siblings[1], index === domain.length - 1 ? undefined : domain[index + 1]);
        });
        assert.is(domain[0], data[0]);
        assert.is(domain[1], data[1]);
        assert.is(domain[2], data[2]);
        assert.is(scale.maxLabelWidth, 7);
        assert.is(scale.isGrouped(), false);
    });
    it('should add rows for groups', () => {
        const data = [{
                value: 0,
                label: 'first',
                group: ['one'],
                isGroup: false,
                siblings: [],
                color: chalk.red,
                bgColor: chalk.green
            }, {
                value: 12,
                label: 'second',
                group: ['one'],
                isGroup: false,
                siblings: [],
                color: chalk.red,
                bgColor: chalk.green
            }, {
                value: 7,
                label: 'third',
                group: ['two long'],
                isGroup: false,
                siblings: [],
                color: chalk.red,
                bgColor: chalk.green
            }];
        const scale = new BandScale(data);
        const domain = scale.domain;
        assert.is(domain.length, 5);
        domain.forEach((item, index) => {
            assert.is(item.siblings[0], index === 0 ? undefined : domain[index - 1]);
            assert.is(item.siblings[1], index === domain.length - 1 ? undefined : domain[index + 1]);
        });
        assert.is(domain[0].label, 'one');
        assert.is(domain[0].groupIndent, 0);
        assert.equal(domain[0].siblings, [undefined, domain[1]]);
        assert.is(domain[1], data[0]);
        assert.is(domain[2], data[1]);
        assert.is(domain[3].label, 'two long');
        assert.is(domain[3].groupIndent, 0);
        assert.equal(domain[3].siblings, [domain[2], domain[4]]);
        assert.is(domain[4], data[2]);
        assert.is(scale.maxLabelWidth, 11);
        assert.is(scale.isGrouped(), true);
    });
    it('should add rows for nested groups', () => {
        const data = [{
                value: 0,
                label: 'first',
                group: ['one', 'sub one'],
                isGroup: false,
                siblings: [],
                color: chalk.red,
                bgColor: chalk.green
            }, {
                value: 12,
                label: 'second',
                group: ['one', 'sub two'],
                isGroup: false,
                siblings: [],
                color: chalk.red,
                bgColor: chalk.green
            }, {
                value: 7,
                label: 'third',
                group: ['two long', 'sub one'],
                isGroup: false,
                siblings: [],
                color: chalk.red,
                bgColor: chalk.green
            }];
        const scale = new BandScale(data);
        const domain = scale.domain;
        assert.is(domain.length, 8);
        domain.forEach((item, index) => {
            assert.is(item.siblings[0], index === 0 ? undefined : domain[index - 1]);
            assert.is(item.siblings[1], index === domain.length - 1 ? undefined : domain[index + 1]);
        });
        assert.is(domain[0].label, 'one');
        assert.is(domain[0].groupIndent, 0);
        assert.equal(domain[0].siblings, [undefined, domain[1]]);
        assert.is(domain[1].label, 'sub one');
        assert.is(domain[1].groupIndent, 1);
        assert.equal(domain[1].siblings, [domain[0], domain[2]]);
        assert.is(domain[2], data[0]);
        assert.is(domain[3].label, 'sub two');
        assert.is(domain[3].groupIndent, 1);
        assert.equal(domain[3].siblings, [domain[2], domain[4]]);
        assert.is(domain[4], data[1]);
        assert.is(domain[5].label, 'two long');
        assert.is(domain[5].groupIndent, 0);
        assert.equal(domain[5].siblings, [domain[4], domain[6]]);
        assert.is(domain[6].label, 'sub one');
        assert.is(domain[6].groupIndent, 1);
        assert.equal(domain[6].siblings, [domain[5], domain[7]]);
        assert.is(domain[7], data[2]);
        assert.is(scale.maxLabelWidth, 14);
        assert.is(scale.isGrouped(), true);
    });
});
