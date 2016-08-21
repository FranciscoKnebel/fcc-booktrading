'use strict';
var isLoggedIn = require('../modules/isLoggedIn');
var User = require('../models/user');
const shortid = require('shortid');
const formatDate = require('format-date');
const dateDifference = require('date-difference');

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
			message: req.flash('profile.authenticated'),
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
					res.render('profile.ejs', {
						user: user,
						since: formatDate('{utc-day} of {utc-month-name}, {utc-year}', user.createdAt),
						lastseen: dateDifference(user.updatedAt, new Date(), {compact: true})
					});
				} else {
					res.render('profile.invalid.ejs', {link: userID});
				}
			});
		} else {
			res.render('profile.invalid.ejs', {link: userID});
		}
	});

	app.get('*', function (req, res) {
		res.status(404).render('404.ejs', {
			user: req.user,
			link: req.url || req.originalUrl
		});
	});
}
