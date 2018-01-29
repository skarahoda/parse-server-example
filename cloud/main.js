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
	if(req.object.get("name")){
		var algoQuery = new Parse.Query("Algorithm");
		algoQuery.equalTo("name", req.object.get("name"));
		algoQuery.count({useMasterKey: true})
			.then(function(count){
				if(count > 0){
					res.error("Algorithm names should be unique");
				}else{
					res.success();
				}
			})
			.catch(function(err){
				res.error(err.message);
			})
	}else{
		res.error("Name field is compulsory for algorithms");
	}
});

Parse.Cloud.beforeFind("Algorithm", function(req){
	if(req.master){
		return req.query;
	}else{
		var schema = new Parse.Schema("Algorithm");
		return schema.get()
			.then(function(currSchema){
				var availableFields = [];
				var currSchemaFields = currSchema.fields;

				for (var elmt in currSchemaFields) {
					if (currSchemaFields.hasOwnProperty(elmt)) {
						if(elmt != "objectId" && elmt != "createdAt" && elmt != "updatedAt" && elmt != "ACL" &&
						   elmt != "bashCommand" ){
							availableFields.push(elmt);
						}
					}
				}
				req.query.select(availableFields);
				return req.query;
			})
	}
});
