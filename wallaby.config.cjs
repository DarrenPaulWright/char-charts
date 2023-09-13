'use strict';

module.exports = (wallaby) => {
	const path = require('node:path');

	process.env.NODE_PATH += path.delimiter + path.join(wallaby.projectCacheDir, 'src');

	return {
		files: [
			'src/**/*.ts',
			'!src/**/*.test.ts'
		],

		tests: [
			'src/**/*.test.ts'
		],
		env: {
			type: 'node',
			runner: 'hippogriff'
		}
	};
};
