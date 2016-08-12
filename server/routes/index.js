'use strict';
var isLoggedIn = require('../modules/isLoggedIn');
var User = require('../models/user');

module.exports = function (app, dirname, passport, env, nev) {
	require('./static')(app, dirname);
	require('./auth/local')(app, passport, nev);
	//	require('./api')(app, dirname);

	app.get('/', function (req, res) {
		if (req.isAuthenticated())
			res.render('authenticated.index.ejs', {user: req.user});
		else {
			res.render('index.ejs');
		}
	});

	app.get('/logout', isLoggedIn, function (req, res) {
		req.logout();

		res.redirect('/');
	});

	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {user: req.user});
	});
}
