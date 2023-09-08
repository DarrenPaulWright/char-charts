import { assert, describe, it } from 'hippogriff';
import printValue from './printValue.js';
describe('printValue', () => {
    it('should return a number as a string if no fractionDigits are provided', () => {
        assert.is(printValue(24.123), '24');
    });
    it('should trim extra fractionDigits', () => {
        assert.is(printValue(24.123, 2), '24.12');
    });
    it('should add fractionDigits to an integer', () => {
        assert.is(printValue(24, 2), '24.00');
    });
    it('should add fractionDigits if needed', () => {
        assert.is(printValue(24.1, 2), '24.10');
    });
    it('should keep fractionDigits if a number rounds to zero', () => {
        assert.is(printValue(0.0023, 2), '0.00');
    });
    it('should convert a number to a localeString', () => {
        assert.is(printValue(123456.123456, 2), '123,456.12');
    });
});
