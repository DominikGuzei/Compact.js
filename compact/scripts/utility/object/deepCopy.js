define(function() {

	/**
	 * deepCopy
	 * Makes a deep copy of any object or array
	 * @param {object} obj the object to make a deep copy from 
	 */
	
	var deepCopy = function(obj) {
		if (typeof obj !== 'object' || obj === null) {
			return obj;
		}
		if(obj instanceof Date) {
			return new Date(obj);
		}
		var c = obj instanceof Array ? [] : {};

		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				c[i] = deepCopy(obj[i]);
			}
		}

		return c;
	}
	
	return deepCopy;
	
});