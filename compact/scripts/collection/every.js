/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define([
'compact/collection/each'
], function(each) {

  var nativeEvery = Array.prototype.every;

  /**
   * every
   *
   * Returns true if any of the values in the list pass the iterator truth test.
   * Short-circuits and stops traversing the list if a true element is found.
   * Delegates to the native method some, if present.
   *
   * @param {Object/Array} subject The object or array that is searched for any right value
   * @param {Function} iterator The function that gets called for each property/index
   * @param {Object} context The context the iterator is bound to
   */
  return function(obj, iterator, context) {
    iterator = iterator || _.identity;
    var result = true;
    if (obj == null)
      return result;
    if (nativeEvery && obj.every === nativeEvery)
      return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list)))
        return breaker;
    });

    return result;
  };

});