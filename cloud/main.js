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
		user.unset("timeout");
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
		}else if(req.original("timeout") !== user.get("timeout")){
			res.error("User may not modify their own timeout.");
		}else{
			res.success();
		}
	}
});

Parse.Cloud.beforeSave("Algorithm", function(req, res){
	if(req.object.get("name")){
		if(!req.original || (req.original && req.original.get("name") != req.object.get("name"))){
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
			res.success();
		}
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

				for(var elmt in currSchemaFields){
					if(currSchemaFields.hasOwnProperty(elmt)){
						if(elmt != "objectId" && elmt != "createdAt" && elmt != "updatedAt" && elmt != "ACL" &&
						   elmt != "bashCommand"){
							availableFields.push(elmt);
						}
					}
				}
				req.query.select(availableFields);
				return req.query;
			})
	}
});

Parse.Cloud.beforeFind("Job", function(req){
	if(!req.master){
		if(req.user){//users can only see their own jobs
			req.query.equalTo("user", req.user);
		}else{//if there is no authenticated user, show none
			req.query.limit(0);
		}
	}
	return req.query;
});

Parse.Cloud.beforeSave("Job", function(req, res){
	if(req.master){
		res.success();
	}
	else if(req.user){
		//TO-D0: later may validate parameters...
		req.object.unset("startTime");
		req.object.unset("stdOutput");
		req.object.unset("errorCode");
		req.object.unset("stdError");
		req.object.unset("timeout");
		req.object.set("user", req.user);
		res.success();
	}else{
		res.error("Only authenticated users may submit jobs");
	}
});

Parse.Cloud.define("GetNextJobToRun", function(req, res){
	if(req.master){
		var jobQuery = new Parse.Query("Job");
		jobQuery.ascending("createdAt");
		jobQuery.equalTo("startTime", null);
		jobQuery.limit(1);
		jobQuery.include("algorithm");
		jobQuery.include("user");
		jobQuery.find({useMasterKey: true})
			.then(function(results){
				if(results.length > 0){
					var theJob = results[0];
					theJob.set("startTime", new Date());
					return theJob.save(null, {useMasterKey: true})
				}
			})
			.then(function(job){
				res.success({
					result: job
				});
			})
			.catch(res.error);
	}else{
		res.error("Denied for non-master requests");
	}
});

Parse.Cloud.define("SaveFinishedJob", function(req, res){
	if(req.master){
		var jobId = req.params.jobId;
		if(jobId){
			var jobQuery = new Parse.Query("Job");
			jobQuery.get(jobId)
				.then(function(theJob){
					if(theJob){
						theJob.set("stdOutput", req.params.stdOutput);
						theJob.set("errorCode", req.params.errorCode);
						theJob.set("stdError", req.params.stdError);
						theJob.set("endTime", new Date());
						return theJob.save(null, {useMasterKey: true})
					}else{
						throw new Error("Given jobId does not exist");
					}
				})
				.then(function(){
					res.success(" ");
				})
				.catch(res.error);
		}else{
			res.error("No jobId parameter was posted");
		}
	}else{
		res.error("Denied for non-master requests");
	}
});
