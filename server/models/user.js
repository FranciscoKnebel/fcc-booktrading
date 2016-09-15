'use strict'

const notFound = -1;

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const isImageUrl = require('is-image-url');
const capitalize = require('capitalize');
const gravatar = require('gravatar');
var shortid = require('shortid');
var autopopulate = require('mongoose-autopopulate');
var Book = require('./book');

// define the schema for our user model
var userSchema = mongoose.Schema({
	email: String,
	password: String,
	books: [
		{
			book: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Book',
				autopopulate: true
			},
			requested: [
				{
					by: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'User',
						autopopulate: {
							select: 'email link picture city phone'
						}
					},
					when: Date
				}
			]
		}
	],
	link: {
		type: String,
		'default': shortid.generate
	},
	picture: String,
	city: String,
	phone: String,
	description: String,
	configs: {
		publicInformation: Boolean,
		hideDescription: Boolean,
		theme: Number
	}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

userSchema.plugin(autopopulate);

// generating a hash
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.findAndAddBook = function (bookID, collection) {
	for (let i = 0; i < collection.length; i++) {
		if (collection[i]._id === bookID) {
			var newBook = new Book();
			newBook.update(collection[i], this);
			newBook.save();

			var obj = {
				title: newBook.title,
				description: newBook.description,
				book: newBook
			}

			collection.splice(i, 1);
			this.books.push(obj);
			return true;
		}
	}

	return false;
}

userSchema.methods.removeBook = function (bookID) {
	var index = findOptionIndex(this.books, 'book', '_id', bookID);

	if (index === notFound) {
		return false;
	} else {
		this.books.splice(index, 1);
		return this.books;
	}
}

userSchema.methods.changeInformation = function (property, value) {
	if (this[property] !== value) {
		if (property === "picture") {
			if (isImageUrl(value)) {
				this[property] = value;
			} else {
				this[property] = gravatar.url(this.email, {
					s: '200',
					d: 'identicon'
				});;
			}
		} else if (property === "city") {
			this[property] = capitalize.words(value);
		} else {
			this[property] = value;
		}
	} else {
		return false;
	}

	this.markModified(property);
	return this;
}

userSchema.methods.changeConfigs = function (configs) {
	this.configs.publicInformation = (configs.publicInformation == 'on')
	this.configs.hideDescription = (configs.hideDescription == 'on')

	if (configs.theme == "" || configs.theme === 0) {
		this.configs.theme = 1;
	} else {
		this.configs.theme = configs.theme;
	}

	this.markModified(configs);
	return this;
}

userSchema.methods.getRequestedBooks = function () {
	var requested = [];

	for (var i = 0; i < this.books.length; i++) {
		if (this.books[i].requested.length > 0) { //book is requested by at least one person
			requested.push(this.books[i]);
		}
	}

	return requested;
}

userSchema.methods.addRequestToBook = function (book, user) {
	for (var i = 0; i < this.books.length; i++) {
		if (this.books[i].book.id === book.id) {
			this.books[i].requested.push({by: user, when: new Date()});
			this.markModified('books');
			return this.books[i];
		}
	}
	return false;
}

userSchema.methods.removeRequestToBook = function (book, user) {
	for (var i = 0; i < this.books.length; i++) {
		if (this.books[i].book._id === book._id) {
			for (var j = 0; j < this.books[i].requested.length; j++) {
				if (this.books[i].requested[j].by.id === user.id) {
					this.books[i].requested.splice(j, 1);
					this.markModified('books');
					return this.books[i];
				}
			}
			return false;
		}
	}
	return false;
}

userSchema.methods.removeRequestWithID = function (bookID, requestID) {
	for (let i = 0; i < this.books.length; i++) {
		if (this.books[i]._id == bookID) {
			for (let j = 0; j < this.books[i].requested.length; j++) {
				if (this.books[i].requested[j].id == requestID) {
					this.books[i].requested.splice(j, 1);
					this.markModified('books');
					return this.books[i];
				}
			}
			return false;
		}
	}
	return false;
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

function findOptionIndex(array, key, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] == value) {
			return i;
		}
	}
	return notFound;
}

function findOptionIndex(array, key, key2, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key][key2] == value) {
			return i;
		}
	}
	return notFound;
}
