var fs = require('fs-extra'),
	path = require('path'),
	chalk = require('chalk'),
	_ = require('lodash'),
	exec = require('child_process').exec;

module.exports = {
	build: function (options, cb) {
		cb = cb || _.noop;
		
		if (!fs.existsSync(__dirname + '/jquery')) {
			cb('jQuery sources was not fount');
			process.exit();
		}
		
		grunt = 'node ' + __dirname + '/node_modules/grunt-cli/bin/grunt';
		
		exec(grunt + ' custom:' + getExclude(options.exclude), {cwd: __dirname + '/jquery'}, function (err) {
			if (err) {
				cb(err);
			} else {
				if (options.outputDir) {
					fs.copy(__dirname + '/jquery/dist', options.outputDir, function (ferr) {
						if (ferr) {
							cb(ferr);
						} else {
							if (!options.silent) {
								process.stdout.write(chalk.green('>>') + ' jQuery has been saved in ' + path.resolve(options.outputDir));
							}
							
							cb(ferr, path.resolve(options.outputDir + '/jquery.js'));
						}
					});
				} else {
					cb(err, path.resolve(__dirname + '/jquery/dist/jquery.js'));
				}
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