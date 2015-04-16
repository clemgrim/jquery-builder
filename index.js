var fs = require('fs'),
	path = require('path'),
	chalk = require('chalk'),
	_ = require('lodash'),
	copy = require('fs-extra').copy,
	exec = require('child_process').exec,
	grunt = process.platform === 'win32' ? 'grunt.cmd' : 'grunt';

module.exports = {
	build: function (exclude, cb) {
		cb = cb || _.noop;
		
		if (!fs.existsSync(__dirname + '/jquery')) {
			console.error(chalk.red('Error') + ' jQuery sources was not fount. Please run ' + chalk.gray('node node_modules/jqbuild/init.js') + ' in your terminal.');
			cb('jQuery sources was not fount');
			process.exit();
		}
		
		exec(grunt + ' custom:' + getExclude(exclude), {cwd: __dirname + '/jquery'}, function (err) {
			if (err) {
				cb(err);
			} else {
				copy(__dirname + '/jquery/dist', './dist', function (err) {
					if (err) {
						console.error(chalk.red(err));
					} else {
						console.log(chalk.green('>>') + ' jQuery has been saved in ' + path.resolve('./dist'));
					}
					
					cb(err);
				});
			}
		});
	},
};

function getExclude (exclude) {
	if (! exclude) {
		throw new Error ('You have to provide module to exclude');
	}
	
	if (_.isString(exclude)) {
		exclude = exclude.split(',');
	}
	
	return [].map.call(exclude, function (module) {
		return module.charAt(0) == '-' ? module : '-' + module;
	}).join(',');
}