const notFound = -1;

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	email: String,
	password: String,
	books: [
		{
			title: String,
			cover: String,
			requested: [
				{
					by: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'User'
					},
					when: Date
				}
			],
			pictures: [String]
		}
	],
	link: String,
	picture: String,
	city: String,
	phone: String
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
	console.log("Swapping property '" + property + "' for '" + value + "'.");
	this[property] = value;

	this.markModified(property);

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
