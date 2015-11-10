var fs = require('fs'),
	Q = require('Q'),
	copy = require('fs-extra').copy,
	repo = require('./src/repo'),
	chalk = require('chalk'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec;
	
var jqueryPromise = Q.nfcall(repo.cloneOrUpdate, 'https://github.com/jquery/jquery.git', './jquery')
	.then(function () {
		return Q.nfcall(exec, 'cd ./jquery && git checkout 1.12-stable');
	})
	.then(function (err) {
		console.log(chalk.green('>') + ' jQuery repository is up to date');
	});

var binariesPromise = Q.nfcall(repo.cloneOrUpdate, 'https://github.com/mihaifm/jsdom_binaries.git', './bin').then(function () {
	console.log(chalk.green('>') + ' Binaries repository is up to date');
});

Q.all([jqueryPromise, binariesPromise])
	.then(function () {
		return Q.nfcall(fs.readFile, './jquery/package.json');
	})
	.then(function (data) {
		var pkg, content;
		
		pkg = JSON.parse(data);
		
		delete pkg.devDependencies.jsdom;
		
		content = JSON.stringify(pkg, null, 2);
		
		return Q.nfcall(fs.writeFile, './jquery/package.json', content);
	})
	.then(function () {
		console.log(chalk.green('>') + ' Preparing to install packages...');
		
		var npm = process.platform === 'win32' ? 'npm.cmd' : 'npm',
			install = spawn(npm,  ['install'], {cwd: __dirname + '/jquery'}),
			dfd = Q.defer();
		
		install.on('error', function (err) {
			dfd.reject(err.toString());
		});
		
		install.on('exit', function () {
			dfd.resolve();
		});
		
		return dfd.promise;
	})
	.then(function () {
		var dest = './jquery/node_modules/',
			src = './bin/node_modules/';
		
		return Q.all[Q.nfcall(copy, src + 'contextify', dest), Q.nfcall(copy, src + 'jsdom', dest)];
	})
	.catch(function (err) {
		console.log(err);
	})
	.done(function () {
		console.log(chalk.green('>>') + ' All is good !');
	});