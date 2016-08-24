'use strict'

const isLoggedIn = require('../../modules/isLoggedIn');
var google = require('googleapis');
var bookAPI = google.books('v1');
var Book = require('../../models/book');

module.exports = function (app, dirname) {
	//add
	app.post('/profile/add/book', isLoggedIn, function (req, res) {
		if (req.body.custom) {
			var book = new Book();
			var books = [];

			req.user.temp = book.createCustom(req.body);
			books.push(book);

			res.render('profile.addbook.result.ejs', {
				user: req.user,
				results: books
			});
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

	app.post('/profile/add/book/approve', isLoggedIn, function (req, res) {
		console.log(req.body);

		var user = req.user;
		var bookWasAdded = user.addBook(book);
		if (bookWasAdded) {} else {}
	});

	//delete
	app.post('/profile/delete/books', isLoggedIn, function (req, res) {
		console.log("But whyyyyy 3");
		console.log(req.body); //array of book IDs.
	});

	//update
	app.post('/profile/update/', isLoggedIn, function (req, res) {
		var user = req.user;
		const action = req.body.update;

		if (action === "update") {
			user.changeInformation('picture', req.body.picture);
			//user.changeInformation('email', req.body.email);
			user.changeInformation('city', req.body.city);
			user.changeInformation('phone', req.body.phone);
			user.changeInformation('description', req.body.description);
			user.changeToggles({publicInformation: req.body.publicInformation, hideDescription: req.body.hideDescription});
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
}

//<% if(! (book.hash == 'null')) { %> < svg width = "80" height = "80" data - jdenticon - hash = "<%= book.hash %>" > </svg><% } %> < script src = "/js/jdenticon.js" > </script>
