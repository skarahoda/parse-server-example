/**
 * Created by tolgaatam on 17.02.2018.
 */

var async = require('async');
var util = require('./util');
var schema = new Parse.Schema('_User');

schema.get()
	.catch(function(){
		return schema.save();
	})
	.then(async.apply(util.addNumber, schema, 'timeout'))
	.then(async.apply(util.logDone, schema))
	.catch(console.error);
