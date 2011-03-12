/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define([
  'compact/collection/each'
], 

function(each) {
  /**
   * select
   *
   * Returns the values in list without the elements that the truth test (iterator) passes. 
   * The opposite of select.
   *
   * @param {Object/Array} subject The object or array from which the values are rejected
   * @param {Function} iterator The function that gets called for each property/index
   * @param {Object} context The context the iterator is bound to
   */
  return function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
    
  };

});