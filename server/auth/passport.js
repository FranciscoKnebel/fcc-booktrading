var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport, mongoose, nev) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	//LOCAL LOGIN
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, email, password, done) {
		User.findOne({
			'email': email
		}, function (err, user) {
			if (err)
				return done(err);

			if (!user) {
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			}

			if (!user.validPassword(password)) 
				return done(null, false, req.flash('loginMessage', "Oops! Wrong password"));

			return done(null, user);
		});
	}));

	//LOCAL SIGNUP
	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	}, function (req, email, password, done) {
		// asynchronous
		process.nextTick(function () {
			User.findOne({
				'email': email
			}, function (err, existingUser) { // if there are any errors, return the error
				if (err) {
					return done(err);
				}

				// check to see if there's already a user with that email
				if (existingUser) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				}

				//  If we're logged in, return local account.
				if (req.user) {
					return done(null, req.user);
				} else { //  We're not logged in, so we're creating a brand new user.
					// create the user
					var newUser = new User();

					newUser.email = email;
					newUser.password = newUser.generateHash(password);

					nev.createTempUser(newUser, function (err, existingPersistentUser, newTempUser) {
						if (err) {
							return done(null, false, req.flash('signupMessage', err.message));
						}

						if (existingPersistentUser) {
							return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
						}

						if (newTempUser) {
							var URL = newTempUser[nev.options.URLFieldName];

							nev.sendVerificationEmail(email, URL, function (err, info) {
								if (err) {
									//handle error
									return done(null, false, req.flash('signupMessage', err.message));
								}

								//flash message of success
								return done(null, newUser, req.flash('verifyMessage', URL));
							});
						} else {
							//flash message of failure
							nev.resendVerificationEmail(email, function (err, userFound) {
								if (err) {
									return done(null, false, req.flash('signupMessage', err.message));
								}

								if (userFound) {
									return done(null, false, req.flash('signupMessage', "You have already registered! We are sending a new confirmation to your e-mail."));
								} else {
									return done(null, false, req.flash('signupMessage', "Failure to signup."));
								}
							}, function () {});
						}
					});
				}
			});
		})
	}));
};
