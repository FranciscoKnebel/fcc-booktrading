const isLoggedIn = require('../../modules/isLoggedIn');
const isLoggedOut = require('../../modules/isLoggedOut');

module.exports = function (app, passport, nev) {
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
		successRedirect: '/verify',
		failureRedirect: '/signup',
		successFlash: true,
		failureFlash: true
	}));

	app.get('/verify', function (req, res) {
		res.render('verify.ejs', {
			message: req.flash('verifyMessage'),
			verifying: false
		});
	});

	app.get('/verify/:id', function (req, res) {
		nev.confirmTempUser(req.params.id, function (err, user) {
			if (err) {
				console.error(err);
				res.render('signup.ejs', {message: err.message});
			}

			if (user) {
				res.render('verify.ejs', {
					message: "User " + user.email + " is now verified.",
					verifying: true
				});
			} else {
				res.render('signup.ejs', {message: 'User verify invalid.'});
			}
		});

	});
}
