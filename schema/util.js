exports.addString = function(schema, fieldName, currentSchema){
	if(!currentSchema.fields.hasOwnProperty(fieldName))
		schema.addString(fieldName);
	return currentSchema;
};

exports.addNumber = function(schema, fieldName, currentSchema){
	if(!currentSchema.fields.hasOwnProperty(fieldName))
		schema.addNumber(fieldName);
	return currentSchema;
};

exports.addDate = function(schema, fieldName, currentSchema){
	if(!currentSchema.fields.hasOwnProperty(fieldName))
		schema.addDate(fieldName);
	return currentSchema;
};

exports.addPointer = function(schema, fieldName, targetClass, currentSchema){
	if(!currentSchema.fields.hasOwnProperty(fieldName))
		schema.addPointer(fieldName, targetClass);
	return currentSchema;
};

exports.update = function(schema){
	return schema.update();
};

exports.logDone = function(schema){
	console.log(schema.className, 'schema is done');
};