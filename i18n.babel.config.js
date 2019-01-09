const config = {
	presets: [ '@babel/react' ],
	plugins: [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-export-namespace-from',
		'@babel/plugin-syntax-dynamic-import',
		[
			'@wordpress/babel-plugin-makepot',
			{
				output: 'build/i18n-calypso/gutenberg-strings.pot',
				headers: {
					'content-type': 'text/plain; charset=UTF-8',
					'x-generator': 'calypso',
				},
			},
		],
		[
			'@automattic/babel-plugin-i18n-calypso',
			{
				dir: 'build/i18n-calypso/',
				headers: {
					'content-type': 'text/plain; charset=UTF-8',
					'x-generator': 'calypso',
				},
			},
		],
	],
};

module.exports = config;
