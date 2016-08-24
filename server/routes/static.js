var express = require('express');

module.exports = function (app, dirname) {
	app.use('/css', express.static(dirname + '/public/css'));
	app.use('/js', express.static(dirname + '/public/js'));
	app.use('/img', express.static(dirname + '/public/img'));

	if (app.get('env') === 'production') {
		app.use('/js/semantic.js', express.static(dirname + '/node_modules/semantic-ui/dist/semantic.min.js'));
		app.use('/css/semantic.css', express.static(dirname + '/node_modules/semantic-ui/dist/semantic.min.css'));
		app.use('/js/jquery.js', express.static(dirname + '/node_modules/jquery/dist/jquery.min.js'));
		app.use('/js/angular.js', express.static(dirname + '/node_modules/angular/angular.min.js'));
		app.use('/js/jdenticon.js', express.static(dirname + '/node_modules/jdenticon/dist/jdenticon.min.js'));
	}
	app.use('/js', express.static(dirname + '/node_modules/semantic-ui/dist/'));
	app.use('/css', express.static(dirname + '/node_modules/semantic-ui/dist/'));
	app.use('/js', express.static(dirname + '/node_modules/jquery/dist'));
	app.use('/js', express.static(dirname + '/node_modules/angular'));
	app.use('/js', express.static(dirname + '/node_modules/jdenticon/dist/'));
};
