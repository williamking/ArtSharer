var mongoose = require('mongoose');
var artWorkSchema = mongoose.Schema({
	'workTitle' : String,
	'author' : String,
	'isFork' : Boolean,
	'forkFrom' : String,
	'url' : String,
	'createTime' : Date,
	'lastModified' : Date,
	'tags' : Array
});
mongoose.model('ArtWork', artWorkSchema);