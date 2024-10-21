import chalk from 'chalk';

const colorPalettes = {
	none: [
		chalk.white
	],
	light: [
		chalk.cyanBright,
		chalk.magentaBright,
		chalk.yellowBright,
		chalk.greenBright,
		chalk.white
	],
	bright: [
		chalk.blueBright,
		chalk.greenBright,
		chalk.magentaBright,
		chalk.yellowBright,
		chalk.cyanBright,
		chalk.redBright,
		chalk.white
	],
	dim: [
		chalk.blue,
		chalk.green,
		chalk.magenta,
		chalk.yellow,
		chalk.cyan,
		chalk.red,
		chalk.grey
	],
	cool: [
		chalk.blueBright,
		chalk.cyanBright,
		chalk.white
	],
	passFail: [
		chalk.greenBright,
		chalk.redBright,
		chalk.grey
	],
	blue: [
		chalk.blueBright
	],
	green: [
		chalk.green
	],
	magenta: [
		chalk.magentaBright
	],
	yellow: [
		chalk.yellow
	],
	cyan: [
		chalk.cyanBright
	],
	red: [
		chalk.redBright
	]
};

export default colorPalettes;
