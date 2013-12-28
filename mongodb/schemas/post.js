var mongoose= require('mongoose');
var Schema= mongoose.Schema;

module.exports = function(){
	var PostSchema = new mongoose.Schema({
		title:String,
		seotitle:String,
		body:String,
		categories:String,
		keywords:String,
		createddate:Date,
	});

	mongoose.model("Post",PostSchema);
};