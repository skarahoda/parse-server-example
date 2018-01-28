var async = require('async');
var util = require('./util');
var schema = new Parse.Schema('Algorithm');

schema.get()
	.catch(function(){
		return schema.save();
	})
	.then(function(currentSchema){
		console.log(currentSchema);
		return currentSchema;
	})
	.then(async.apply(util.addString, schema, 'name'))
	.then(async.apply(util.addString, schema,'description'))
	.then(async.apply(util.addString, schema,'bashCommand'))
	.then(async.apply(util.addString, schema, 'synopsis'))
	.then(async.apply(util.addString, schema, 'nameUrlEncoded'))
	.then(async.apply(util.update, schema))
	.then(async.apply(util.logDone, schema))
	.catch(console.error);
