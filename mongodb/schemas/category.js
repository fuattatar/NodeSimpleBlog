var mongoose= require('mongoose');
var Schema= mongoose.Schema;

module.exports = function(){
	var CategorySchema = new mongoose.Schema({
		name:String,
		seoname:String,
		createddate:{ type: Date, default: Date.now }
	});

	mongoose.model("Category",CategorySchema);
};