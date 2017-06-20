var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var ImageSchema = new Schema({
	name: {type: String},
	namewithTimeStamp: {type: String},
	path: {type: String},
	createdAt: {type: Date, default: Date.now()},
	album: {type: ObjectId},
	albumName: {type: String},
	metadata: {type: Object},
});

module.exports = mongoose.model('Image', ImageSchema);