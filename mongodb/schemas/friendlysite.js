var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = function(){
	var FriendlySite = new mongoose.Schema({
		name:String,
		description:String,
		url:String,
		followtype:String,
		createddate:String
	});
	mongoose.model("FriendlySite",FriendlySite);
};