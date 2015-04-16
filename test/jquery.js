var jquery = require('../index.js'),
	assert = require('assert'),
	fs = require('fs-extra'),
	start = new Date(),
	options = {
		exclude: ['deprecated','effects'],
		silent: true,
		outputDir: './dist'
	};

jquery.build(options, function (err, file) {
	assert.equal(err, null, 'Unable to build jQuery');

	fs.stat(file, function (err, stats) {

		assert.equal(err, null, 'File has not been created');
		assert.equal(stats.mtime > start, true, 'File has not been written');
	});
});