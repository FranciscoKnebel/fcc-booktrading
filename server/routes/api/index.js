const isLoggedIn = require('../../modules/isLoggedIn');

module.exports = function (app, dirname) {

	app.post('/profile/new/book', isLoggedIn, function (req, res) {
		console.log("Great choice, mate");
	});

	app.post('/profile/update/', isLoggedIn, function (req, res) {
		var user = req.user;
		const action = req.body.update;
		if (action === "update") {
			user.changeInformation('picture', req.body.picture);
			//user.changeInformation('email', req.body.email);
			user.changeInformation('city', req.body.city);
			user.changeInformation('phone', req.body.phone);
			user.save(function (err) {
				if (err)
					console.error(err);

				req.user = user;
				res.redirect('/profile');
			});
		} else if (action === "deletebooks") {
			user.changeInformation('books', []);
			user.save(function (err) {
				if (err)
					console.error(err);

				req.user = user;
				res.redirect('/profile');
			});
		} else if (action === "deleteaccount") {
			console.log("Deleting account " + user.id);
			user.remove(function (err) {
				if (err)
					console.error(err);
				else {
					req.logout();
					res.redirect('/');
				}
				res.redirect('/profile');
			});
		} else {
			console.error("Invalid form action on profile update: " + action);
			res.redirect('/profile');
		}

	});

	app.post('/profile/delete/books', isLoggedIn, function (req, res) {
		console.log("But whyyyyy 3");
		console.log(req.body); //array of book IDs.
	});
};
