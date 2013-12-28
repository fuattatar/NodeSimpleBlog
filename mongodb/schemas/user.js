var mongoose= require('mongoose');
var Schema= mongoose.Schema;

module.exports = function(){
	var UserSchema = new mongoose.Schema({
		name:String,
		email:String,
		password:String,
		age:Number
	});

	mongoose.model("User",UserSchema);
};