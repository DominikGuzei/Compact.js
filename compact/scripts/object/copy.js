define(['compact/object/clone'], function(clone) {

	/**
	 * copy
	 * Copies all properties of one object to another
	 * 
	 * @param {Object} destination The object the properties are added to
	 * @param {Object} source The object which properties are copied
	 * @param {Boolean} overwrite Should existing properties be overwritten
	 * on the destination object?
	 * @param {Boolean} byReference Should object values be copied by reference?
	 */

	return function(source, destination, overwrite, byReference) {
		for (var propertyName in source) {
			if (source.hasOwnProperty(propertyName)) {
				var sourceProperty = byReference ? source[propertyName] : clone(source[propertyName]);
				if (overwrite) {
					destination[propertyName] = sourceProperty;
				} else {
					destination[propertyName] = destination[propertyName] || sourceProperty;
				}
			}
		}
	}
	
});