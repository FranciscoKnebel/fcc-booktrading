var mongoose = require('mongoose');
var sha1 = require('sha1');
var shortid = require('shortid');
var random = require('mongoose-random');

// define the schema for our user model
var bookSchema = mongoose.Schema({
	bookID: String,
	etag: String,
	title: String,
	authors: [String],
	publisher: String,
	publishedDate: String,
	description: String,
	snippet: String,
	pageCount: Number,
	categories: [String],
	industryIdentifiers: [
		{
			_id: false,
			idType: String,
			identifier: String
		}
	],
	thumbnail: String,
	bookURL: String,
	custom: Boolean,
	hash: String,
	link: {
		type: String,
		'default': shortid.generate
	},
	pictures: [String],
	isFree: Boolean,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

bookSchema.methods.changeInformation = function (property, value) {
	if (this[property] !== value) {
		this[property] = value;
	} else {
		return false;
	}

	this.custom = true;
	this.markModified(property);
	return this;
}

bookSchema.methods.create = function (volume, creator) {
	this.bookID = volume.id;
	this.etag = volume.etag;
	this.title = volume.volumeInfo.title;
	this.authors = volume.volumeInfo.authors;
	this.publisher = volume.volumeInfo.publisher;
	this.publishedDate = volume.volumeInfo.publishedDate;
	this.description = volume.volumeInfo.description;
	if (volume.searchInfo) {
		this.snippet = volume.searchInfo.textSnippet;
	}
	if (volume.volumeInfo.imageLinks) {
		this.thumbnail = volume.volumeInfo.imageLinks.thumbnail;
	}
	this.pageCount = volume.volumeInfo.pageCount;
	this.categories = volume.volumeInfo.categories;
	if (volume.volumeInfo.industryIdentifiers) {
		volume.volumeInfo.industryIdentifiers.forEach(elem => {
			var obj = {
				idType: elem.type,
				identifier: elem.identifier
			};
			this.industryIdentifiers.push(obj);
		});
	}
	this.bookURL = volume.volumeInfo.infoLink;
	this.custom = false;
	this.hash = sha1(this.title);
	this.isFree = true;
	this.owner = creator;

	return this;
}

bookSchema.methods.createCustom = function (volume, creator) {
	this.title = volume.title;
	this.authors.push(volume.author);
	this.description = volume.description;
	this.pageCount = volume.pageCount;
	this.thumbnail = volume.thumbnail;
	this.custom = true;
	this.hash = sha1(this.title);
	this.bookURL = '/book/' + this.id;
	this.isFree = true;
	this.owner = creator;

	return this;
}

bookSchema.methods.update = function (book, creator) {
	this.bookID = book.bookID;
	this.etag = book.etag;
	this.title = book.title;
	this.authors = book.authors;
	this.publisher = book.publisher;
	this.publishedDate = book.publishedDate;
	this.description = book.description;
	this.snippet = book.snippet;
	this.thumbnail = book.thumbnail;
	this.pageCount = book.pageCount;
	this.categories = book.categories;
	if (book.industryIdentifiers) {
		book.industryIdentifiers.forEach(elem => {
			this.industryIdentifiers.push(elem);
		});
	}
	this.bookURL = book.bookURL;
	this.custom = book.custom;
	this.hash = book.hash;
	this.isFree = book.isFree;
	this.owner = creator;
}

bookSchema.plugin(random, {path: 'r'});
// create the model for users and expose it to our app
module.exports = mongoose.model('Book', bookSchema);
