/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define(['compact/collection/forEach'], function(forEach) {

	var nativeFilter = Array.prototype.filter;

	/** 
	 * select
	 * 
	 * Looks through each value in the list, returning an array of all 
	 * the values that pass a truth test (iterator). 
	 * Delegates to the native filter method, if it exists.
	 * 
	 * @param {Object/Array} subject The object or array from which the values are selected
	 * @param {Function} iterator The function that gets called for each property/index
	 * @param {Object} context The context the iterator is bound to
	 */
	return function(subject, iterator, context) {
    var results = [];
    
		if (subject == null) return results;
		if (nativeFilter && subject.filter === nativeFilter) return subject.filter(iterator, context);

    forEach(subject, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });

    return results;
  };
});