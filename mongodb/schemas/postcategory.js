var mongoose= require('mongoose');
var Schema= mongoose.Schema;

module.exports = function(){
	var PostCategorySchema = new mongoose.Schema({
		postid:String,
		categoryid:String,
		createddate:{ type: Date, default: Date.now }
	});

	mongoose.model("PostCategory",PostCategorySchema);
};