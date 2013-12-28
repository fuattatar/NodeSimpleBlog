exports.initialize=function(){
	require("fs").readdirSync(__dirname + "/schemas").forEach(function(file){
		require('./schemas/' +file)();
	});
};