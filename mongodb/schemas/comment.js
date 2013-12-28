var mongoose= require('mongoose');
var Schema= mongoose.Schema;

module.exports = function(){
	var CommentSchema = new mongoose.Schema({
		email:String,
		website:String,
		content:String,
		postid:String,
		status:Number,
		createddate:Date
	});

	mongoose.model("Comment",CommentSchema);
};