var jquery = require('../index.js'),
	assert = require('assert'),
	fs = require('fs'),
	start = new Date();

jquery.build(['deprecated','effects'], function (err) {
	assert.equal(err, null, 'Unable to build jQuery');
	
	fs.stat('./dist/jquery.js', function (err, stats) {
		assert.equal(err, null, 'File has not been created');
		assert.equal(stats.atime > start, true, 'File has not been written');
	});
});