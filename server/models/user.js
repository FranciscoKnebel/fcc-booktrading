const notFound = -1;

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const isImageUrl = require('is-image-url');
const capitalize = require('capitalize');
const gravatar = require('gravatar');

// define the schema for our user model
var userSchema = mongoose.Schema({
	email: String,
	password: String,
	books: [
		{
			title: String,
			description: String,
			pictures: [String],
			book: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Book'
			},
			requested: [
				{
					by: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'User'
					},
					when: Date
				}
			]
		}
	],
	link: String,
	picture: String,
	city: String,
	phone: String,
	description: String,
	toggles: {
		publicInformation: Boolean,
		hideDescription: Boolean
	}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

// generating a hash
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.addBook = function (book) {
	var index = findOptionIndex(this.books, 'id', book.id);

	if (index === notFound) {
		this.books.push(book);
		return this.books;
	} else {
		console.log("Book " + book.id + " already added.");
		return false;
	}
}

userSchema.methods.removeBook = function (book) {
	var index = findOptionIndex(this.books, 'id', book.id);

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

userSchema.methods.changeToggles = function (toggles) {
	this.toggles.publicInformation = (toggles.publicInformation == 'on')
	this.toggles.hideDescription = (toggles.hideDescription == 'on')

	this.markModified(toggles);
	return this;
}

userSchema.methods.getRequestedBooks = function () {
	var requested = [];

	for (var i = 0; i < this.books.length; i++) {
		if (this.books[i].requested) { //book is requested by at least one person
			requested.push(this.books[i]);
		}
	}

	return requested;
}

userSchema.methods.addRequestToBook = function (book, user) {
	for (var i = 0; i < this.books.length; i++) {
		if (this.books[i].id === book.id) {
			this.books[i].requested.push({by: user, when: new Date()});
			this.markModified('books');
			return this.books[i];
		}
	}
	return false;
}

userSchema.methods.removeRequestToBook = function (book, user) {
	for (var i = 0; i < this.books.length; i++) {
		if (this.books[i].id === book.id) {
			for (var j = 0; j < array.length; j++) {
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
