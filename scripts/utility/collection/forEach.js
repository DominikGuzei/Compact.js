/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define(['utility/typeof'], function(type) {
	
	var nativeforEach = Array.prototype.forEach;

	/** 
	 * forEach
	 * 
	 * Iterates over a list of elements, yielding each in turn to an 
	 * iterator function. The iterator is bound to the context object, 
	 * if one is passed. Each invocation of iterator is called with 
	 * three arguments: (element, index, list). If list is a JavaScript 
	 * object, iterator's arguments will be (value, key, list). 
	 * Delegates to the native forEach function if it exists.
	 * 
	 * Handles objects implementing `forEach`, arrays, and raw objects.
	 * Delegates to **ECMAScript 5**'s native `forEach` if available.
	 * 
	 * @param {Object/Array} obj The object or array to iterate over
	 * @param {Function} iterator The function that gets called for each property/index
	 * @param {Object} context The context the iterator is bound to
	 */
	return function(obj, iterator, context) {
	  var value;
    if (obj == null) return;
    if (nativeforEach && obj.forEach === nativeforEach) {
      obj.forEach(iterator, context);
    } else if (type.isNumber(obj.length)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) == false) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) == false) return;
        }
      }
    }
  };
	
});