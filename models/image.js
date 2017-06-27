var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var ImageSchema = new Schema({
	name: {type: String},
	namewithtimestamp: {type: String},
	path: {type: String},
	createdat: {type: Date, default: Date.now()},
	album: {type: ObjectId, index: true},
	albumname: {type: String, index: true},
	metadata: {type: Object},
});

module.exports = mongoose.model('Image', ImageSchema);