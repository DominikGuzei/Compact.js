/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define(['compact/language/typeof'], function(type) {
	
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
	 * @param {Object/Array} subject The object or array to iterate over
	 * @param {Function} iterator The function that gets called for each property/index
	 * @param {Object} context The context the iterator is bound to
	 */
	return function(subject, iterator, context) {
	  var value;
    if (subject == null) return;

    if (nativeforEach && subject.forEach === nativeforEach) {
      subject.forEach(iterator, context);

    } else if (type.isNumber(subject.length)) {
      for (var i = 0, l = subject.length; i < l; i++) {
        if (iterator.call(context, subject[i], i, subject) == false) return;
      }

    } else {
      for (var key in subject) {
        if (Object.hasOwnProperty.call(subject, key)) {
          if (iterator.call(context, subject[key], key, subject) == false) return;
        }
      }
    }
  };
	
});