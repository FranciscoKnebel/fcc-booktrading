var mongoose = require('mongoose');
var sha1 = require('sha1');
var shortid = require('shortid');

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
	_id: {
		type: String,
		'default': shortid.generate
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

	this.markModified(property);
	return this;
}

bookSchema.methods.create = function (volume) {
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

	return this;
}

bookSchema.methods.createCustom = function (volume) {
	this.title = volume.title;
	this.authors.push(volume.author);
	this.description = volume.description;
	this.pageCount = volume.pageCount;
	this.thumbnail = volume.thumbnail;
	this.custom = true;
	this.hash = sha1(this.title);

	this.bookURL = '/book/' + this.id;

	return this;
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Book', bookSchema);
