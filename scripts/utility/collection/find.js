/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define(['utility/collection/some'], function(some) {

	/** 
	* 
	 * find
	 * 
	 * Looks through each value in the list, returning the first one that passes a truth 
	 * test (iterator). The function returns as soon as it finds an acceptable element, 
	 * and doesn't traverse the entire list.
	 * 
	 * @param {Object/Array} subject The object or array that is searched
	 * @param {Function} iterator The function that gets called for each property/index
	 * @param {Object} context The context the iterator is bound to
	 */
	return function(subject, iterator, context) {
    var result;
    some(subject, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };
});