import chalk from 'chalk';
import { assert, describe, it } from 'hippogriff';
import { List } from 'hord';
import Scale from './Scale.js';
describe('.domain', () => {
    const extraValues = {
        label: '',
        group: [],
        isGroup: false,
        color: chalk.red,
        bgColor: chalk.green,
        siblings: [],
        hasExtraRow: false
    };
    class TestScale extends Scale {
        // eslint-disable-next-line @typescript-eslint/class-methods-use-this
        setRange() {
        }
        // eslint-disable-next-line @typescript-eslint/class-methods-use-this
        ticks() {
            return [];
        }
    }
    it('should have a default domain of 0,1', () => {
        const scale = new TestScale([]);
        assert.equal(scale.domain, [0, 1]);
    });
    it('should calculate the domain with min 0 when instantiated with values', () => {
        const scale = new TestScale([{
                value: 0,
                ...extraValues
            }, {
                ...extraValues
            }, {
                value: 100,
                ...extraValues
            }]);
        assert.equal(scale.domain, [0, 100]);
    });
    it('should calculate the domain with max 0 when instantiated with values', () => {
        const scale = new TestScale([{
                value: 0,
                ...extraValues
            }, {
                value: -100,
                ...extraValues
            }]);
        assert.equal(scale.domain, [-100, 0]);
    });
    it('should calculate the domain with min 0 when instantiated with data', () => {
        const scale = new TestScale([{
                data: new List([0, 1, 2, 3]),
                ...extraValues
            }, {
                data: new List([100, 99, 98]),
                ...extraValues
            }]);
        assert.equal(scale.domain, [0, 100]);
    });
    it('should calculate the domain with max 0 when instantiated with data', () => {
        const scale = new TestScale([{
                data: new List([0, -1, -2, -3]),
                ...extraValues
            }, {
                data: new List([-98, -99, -100]),
                ...extraValues
            }]);
        assert.equal(scale.domain, [-100, 0]);
    });
});
