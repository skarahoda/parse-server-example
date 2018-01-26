var validator = require('validator');

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.beforeSave(Parse.User, function(req, res){
	// check if new signup or update
	var user = req.object;
	if(req.master){
		res.success();
	}
	else if(!req.original){
		if(user.get("email") === ""){
			res.error("Cannot sign up user with an empty email.")
		} else if(!validator.isEmail(user.get("email"))){
			res.error("Cannot sign up user with an invalid email.")
		} else{
			res.success();
		}
	}else{
		if(req.original.get("email") !== user.get("email")){
			res.error("Email cannot be changed after signup");
		} else {
			res.success();
		}
	}
});
