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
			cover: String
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
