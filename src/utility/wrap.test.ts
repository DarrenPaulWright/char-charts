import { assert, describe, it } from 'hippogriff';
import wrap from './wrap.js';

describe('wrap', () => {
	describe('left', () => {
		it('should return a full string if less than max', () => {
			assert.equal(wrap('test', 10), ['test']);
		});

		it('should return a wrapped string if more than max', () => {
			assert.equal(wrap('this is a long string that will wrap', 11), [
				'this is a',
				'long string',
				'that will',
				'wrap'
			]);
		});

		it('should break a long word', () => {
			assert.equal(wrap('this isalongstringthat will wrap', 12), [
				'this',
				'isalongstrin',
				'gthat will',
				'wrap'
			]);
		});
	});

	describe('right', () => {
		it('should return a full string if less than max', () => {
			assert.equal(wrap('test', 10, true), ['test']);
		});

		it('should return a wrapped string if more than max', () => {
			assert.equal(wrap('this is a long string that will wrap', 11, true), [
				'this',
				'is a long',
				'string that',
				'will wrap'
			]);
		});

		it('should return a wrapped string if more than max 2', () => {
			assert.equal(wrap('Apples with wrapping text that is kinda long', 20, true), [
				'Apples',
				'with wrapping text',
				'that is kinda long'
			]);
		});

		it('should break a long word', () => {
			assert.equal(wrap('this isalongstringthat will wrap', 12, true), [
				'this isalo',
				'ngstringthat',
				'will wrap'
			]);
		});
	});
});
