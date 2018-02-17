var async = require('async');
var util = require('./util');
var schema = new Parse.Schema('Job');

schema.get()
	.catch(function(){
		return schema.save();
	})
	.then(async.apply(util.addPointer, schema, 'user', '_User'))
	.then(async.apply(util.addPointer, schema,'algorithm', 'Algorithm'))
	.then(async.apply(util.addString, schema,'parameters'))
	.then(async.apply(util.addString, schema,'tag'))
	.then(async.apply(util.addNumber, schema, 'errorCode'))
	.then(async.apply(util.addNumber, schema, 'timeout'))
	.then(async.apply(util.addString, schema,'stdError'))
	.then(async.apply(util.addString, schema,'stdOutput'))
	.then(async.apply(util.addDate, schema,'startTime'))
	.then(async.apply(util.addDate, schema,'endTime'))
	.then(async.apply(util.update, schema))
	.then(async.apply(util.logDone, schema))
	.catch(console.error);
