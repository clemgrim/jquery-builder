var exec = require('child_process').exec,
	fs = require('fs-extra');

var repo = {
	clone: function (url, path, cb) {
		fs.removeSync(path);
		
		return exec('git clone ' + url + ' ' + path, cb);
	},
	
	update: function (url, path, cb) {
		return exec('cd ' + path + ' && git reset --hard && git pull', cb);
	},
	
	cloneOrUpdate: function (url, path, cb) {
		var exists = fs.existsSync(path + '/.git');
		
		return exists ? repo.update(url, path, cb) : repo.clone(url, path, cb);
	},
};

module.exports = repo;