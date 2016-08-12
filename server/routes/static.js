var express = require('express');

module.exports = function (app, dirname) {
	app.use('/css', express.static(dirname + '/public/css'));
	app.use('/js', express.static(dirname + '/public/js'));
	app.use('/img', express.static(dirname + '/public/img'));

	app.use('/js', express.static(dirname + '/node_modules/semantic-ui/dist/')); // redirect semantic JS
	app.use('/js', express.static(dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
	app.use('/js', express.static(dirname + '/node_modules/angular'));
	app.use('/css', express.static(dirname + '/node_modules/semantic-ui/dist/')); // redirect semantic css
};
