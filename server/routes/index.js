'use strict';
var isLoggedIn = require('../modules/isLoggedIn');
var User = require('../models/user');
const shortid = require('shortid');

module.exports = function (app, dirname, passport, env, nev) {
	require('./static')(app, dirname);
	require('./auth/local')(app, passport, nev);
	require('./api/index')(app, dirname);

	app.get('/', function (req, res) {
		if (req.isAuthenticated())
			res.render('index.authenticated.ejs', {user: req.user});
		else {
			res.render('index.ejs');
		}
	});

	app.get('/logout', isLoggedIn, function (req, res) {
		req.logout();

		res.redirect('/');
	});

	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.authenticated.ejs', {
			user: req.user,
			requested: req.user.getRequestedBooks()
		});
	});

	app.get('/profile/:id', function (req, res) {
		const userID = req.params.id;

		if (shortid.isValid(userID)) {
			User.findOne({
				'link': userID
			}, function (err, user) {
				if (err)
					console.error(err);

				if (user) {
					res.render('profile.ejs', {user: user});
				} else {
					res.render('profile.invalid.ejs', {link: userID});
				}
			});
		} else {
			res.render('profile.invalid.ejs', {link: userID});
		}
	});
}
