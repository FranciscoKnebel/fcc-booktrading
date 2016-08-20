const isLoggedIn = require('../../modules/isLoggedIn');

module.exports = function (app, dirname) {

	app.post('/new/book', function (req, res) {
		console.log("Great choice, mate");
	});

	app.post('/profile/update/', isLoggedIn, function (req, res) {
		var user = req.user;

		user.changeInformation('picture', req.body.picture);
		user.changeInformation('email', req.body.email);
		user.changeInformation('city', req.body.city); //format city name to "New York City" style
		user.changeInformation('phone', req.body.phone);
		user.save(function (err) {
			if (err)
				console.error(err);

			req.user = user;
			res.redirect('/profile');
		});
	});

	app.delete('/profile/delete/books', isLoggedIn, function (req, res) {
		console.log("But whyyyyy 1");
	});

	app.delete('/profile/delete/account', isLoggedIn, function (req, res) {
		console.log("But whyyyyy 2");
	});

	app.post('/profile/delete/books', isLoggedIn, function (req, res) {
		console.log("But whyyyyy 3");
		console.log(req.body); //array of book IDs.
	});
};
