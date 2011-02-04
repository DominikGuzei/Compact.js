/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define(['compact/collection/map'], function(map) {

	/**
	 * getValues()
	 * Retrieve the values of an object's properties.
	 * 
	 * @param {Object} subject The subject to return the values from
	 */ 
	return function(subject) {
	  return map(subject, function(value) {
			return value;
		});
	};
});