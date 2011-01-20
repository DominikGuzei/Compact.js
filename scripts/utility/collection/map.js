/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define(['utility/collection/forEach'], function(forEach) {
	
	var nativeMap = Array.prototype.map;

	/** 
	 * map
	 * 
	 * Produces a new array of values by mapping each value in list through 
	 * a transformation function (iterator). If the native map method exists, 
	 * it will be used instead. If list is a JavaScript object, iterator's 
	 * arguments will be (value, key, list).
	 * 
	 * Return the results of applying the iterator to each element.
	 * Delegates to **ECMAScript 5**'s native `map` if available.
	 * 
	 * @param {Object/Array} subject The object or array that is mapped into the result array
	 * @param {Function} iterator The function that gets called for each property/index
	 * @param {Object} context The context the iterator is bound to
	 */
	return function(subject, iterator, context) {
	  var results = [];
	
    if (subject == null) return results;
    if (nativeMap && subject.map === nativeMap) return object.map(iterator, context);

    forEach(subject, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });

    return results;
  };
	
});