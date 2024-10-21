import { lucidNode } from 'eslint-config-lucid';
import lucidTypescriptConfig from 'eslint-config-lucid-typescript';

export default [
	{
		ignores: [
			'**/*.js',
			'**/*.d.ts'
		]
	},
	...lucidNode,
	...lucidTypescriptConfig,
	{
		files: ['**/*.ts'],
		rules: {
			'security/detect-non-literal-fs-filename': 'off',
			'node/no-process-exit': 'off',
			'node/no-process-env': 'off'
		}
	}
];
