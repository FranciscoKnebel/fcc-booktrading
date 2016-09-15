'use strict'

const isLoggedIn = require('../../modules/isLoggedIn');
var Book = require('../../models/book');
var User = require('../../models/user');

var mongoose = require('mongoose');

module.exports = function (app, dirname) {

	require('./profile')(app, dirname);

	app.post('/book/request/:id', isLoggedIn, function (req, res) {
		let bookID = req.params.id;
		let user = req.user;

		if (mongoose.Types.ObjectId.isValid(bookID)) {
			Book.findOne({
				_id: bookID
			}, function (err, book) {
				if (err)
					res.status(500).send(err.message);

				if (!book) {
					res.status(404).send("Request to book found no books with the matching id.");
				} else {
					//find book owner
					if (user) {
						User.findById(book.owner, function (err, owner) {
							if (err)
								res.status(500).send(err.message);

							if (!owner) {
								res.status(404).send("ERROR #0001: Book owner not found. Please contact developer, he forgot to remove a book on user account deletion.");
							}

							//add request to book on owner object
							owner.addRequestToBook(book, user);
							owner.save();
							res.redirect('/book/request');
						});
					} else {
						res.status(404).send("ERROR #0002: Logged user undefined.");
					}
				}
			});
		} else {
			res.status(400).send("Bad request, book id does not have the correct format.");
		}
	});

	app.get('/book/request', isLoggedIn, function (req, res) {
		res.render('book.requested.ejs', {user: req.user});
	});
};
