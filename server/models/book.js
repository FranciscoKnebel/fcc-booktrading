var mongoose = require('mongoose');

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
	bookURL: String
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
	volume.volumeInfo.industryIdentifiers.forEach(elem => {
		var obj = {
			idType: elem.type,
			identifier: elem.identifier
		};
		this.industryIdentifiers.push(obj);
	});
	this.bookURL = volume.volumeInfo.infoLink;

	return this;
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Book', bookSchema);
