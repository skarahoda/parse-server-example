var validator = require('validator');

Parse.Cloud.define('hello', function(req, res){
	res.success('Hi');
});

Parse.Cloud.beforeSave(Parse.User, function(req, res){
	// check if new signup or update
	var user = req.object;

	var acl = new Parse.ACL(user);
	acl.setReadAccess(user, true);
	acl.setWriteAccess(user, true);
	acl.setPublicReadAccess(false);
	acl.setPublicWriteAccess(false);
	user.setACL(acl);

	if(req.master){
		res.success();
	}
	else if(!req.original){
		if(user.get("email") === ""){
			res.error("Cannot sign up user with an empty email.")
		}else if(!validator.isEmail(user.get("email"))){
			res.error("Cannot sign up user with an invalid email.")
		}else{
			res.success();
		}
	}else{
		if(req.original.get("email") !== user.get("email")){
			res.error("Email cannot be changed after signup");
		}else{
			res.success();
		}
	}
});

Parse.Cloud.beforeSave("Algorithm", function(req, res){
	if(req.object.exists("name")){
		req.object.set("nameUrlEncoded", encodeURI(req.object.get("name")));
	}else{
		req.object.unset("nameUrlEncoded");
	}
	res.success();
});

Parse.Cloud.beforeFind("Algorithm", function(req, res){
	if(req.master){
		res.success();
	}else{
		var schema = new Parse.Schema("Algorithm");
		schema.get()
			.then(function(currSchema){
				var availableFields = [];
				var currSchemaFields = currSchema.fields;
				var lengthOfCurrSchema = currSchemaFields.length;
				for(var i = 0; i < lengthOfCurrSchema; i++){
					var elmt = currSchemaFields[i];
					//bash command is not available to the other users
					if(elmt != "objectId" && elmt != "createdAt" && elmt != "updatedAt" && elmt != "ACL" &&
					   elmt != "bashCommand"){
						availableFields.push(elmt);
					}
				}
				req.object.select(availableFields);
				res.success();
			})
			.catch(console.error)
	}
});
