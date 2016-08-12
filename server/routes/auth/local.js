const isLoggedIn = require('../../modules/isLoggedIn');
const isLoggedOut = require('../../modules/isLoggedOut');

module.exports = function (app, passport) {
	app.get('/login', isLoggedOut, function (req, res) {
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});

	app.post('/login', isLoggedOut, passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/auth', function (req, res) {
		res.redirect('/login');
	});

	app.get('/signup', isLoggedOut, function (req, res) {
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	});

	app.post('/signup', isLoggedOut, passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));
}
