/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define(['utility/collection/forEach'], function(forEach) {
	
	var nativeSome = Array.prototype.some;

	/** 
	 * some
	 * 
	 * Returns true if any of the values in the list pass the iterator truth test. 
	 * Short-circuits and stops traversing the list if a true element is found. 
	 * Delegates to the native method some, if present.
	 * 
	 * @param {Object/Array} obj The object or array that is searched for any right value
	 * @param {Function} iterator The function that gets called for each property/index
	 * @param {Object} context The context the iterator is bound to
	 */
	return function(obj, iterator, context) {
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    forEach(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) return false;
    });
    return result;
  };
});