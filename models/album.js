var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;
var Image = require('./image.js');

var AlbumSchema = new Schema({
	name: {type: String, required: true, index: true, unique: true},
	createdAt: {type: Date, default: Date.now()},
	images: [{type: ObjectId, ref: 'Image'}],
});

module.exports = mongoose.model('Album', AlbumSchema);