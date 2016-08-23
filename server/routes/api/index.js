'use strict'
const isLoggedIn = require('../../modules/isLoggedIn');
var google = require('googleapis');
var bookAPI = google.books('v1');
var Book = require('../../models/book');

module.exports = function (app, dirname) {

	app.post('/profile/add/book', isLoggedIn, function (req, res) {
		if (req.body.custom) {
			console.log("Creating book from req.body stuff");
			res.send(true);
		} else {
			var query = req.body.query;

			if (query) {
				bookAPI.volumes.list({
					q: query,
					key: process.env.GOOGLEBOOKS_API_KEY
				}, function (err, response) {
					if (err)
						console.error(err);

					var books = [];
					response.items.forEach(elem => {
						let book = new Book();
						books.push(book.create(elem));
					});
					req.user.temp = books;

					if (!response.items) {
						res.status(404).send(null);
					} else {
						res.render('profile.addbook.result.ejs', {
							user: req.user,
							results: books
						});
					}
				});
			} else {
				res.render('profile.addbook.ejs', {user: req.user});
			}
		}
	});

	app.post('/profile/new/book/approve', isLoggedIn, function (req, res) {
		console.log(req.body);

		var user = req.user;
		var bookWasAdded = user.addBook(book);
		if (bookWasAdded) {} else {}
	});

	app.post('/profile/update/', isLoggedIn, function (req, res) {
		var user = req.user;
		const action = req.body.update;

		if (action === "update") {
			user.changeInformation('picture', req.body.picture);
			//user.changeInformation('email', req.body.email);
			user.changeInformation('city', req.body.city);
			user.changeInformation('phone', req.body.phone);
			user.changeInformation('description', req.body.description);
			user.save(function (err) {
				if (err) {
					console.error(err);
					req.flash('profile.authenticated', err.message);
				} else {
					req.flash('profile.authenticated', "Updated user profile information.");
					req.user = user;
				}
				res.redirect('/profile');
			});
		} else if (action === "deletebooks") {
			user.changeInformation('books', []);
			user.save(function (err) {
				if (err) {
					console.error(err);
					req.flash('profile.authenticated', err.message);
				} else {
					req.user = user;
					req.flash('profile.authenticated', "Deleted all user owned books from profile.");
				}
				res.redirect('/profile');
			});
		} else if (action === "deleteaccount") {
			console.log("Deleting account " + user.id);
			user.remove(function (err) {
				if (err) {
					console.error(err);
					res.redirect('/profile');
				} else {
					req.logout();
					res.redirect('/');
				}
			});
		} else {
			console.error("Invalid form action on profile update by user " + user.id + ": " + action);
			res.redirect('/profile');
		}
	});

	app.post('/profile/delete/books', isLoggedIn, function (req, res) {
		console.log("But whyyyyy 3");
		console.log(req.body); //array of book IDs.
	});
};
