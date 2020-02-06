module.exports = function(api) {
	const presets = [
		[
			'@babel/preset-env'
		]
	];
	const plugins = [
		['istanbul', {'exclude': ['tests/**/*.js']}]
	];

	api.cache(false);

	return {
		presets,
		plugins
	};
};
