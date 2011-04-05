/**
 * This gracefully taken from the Underscore.js library
 * http: documentcloud.github.com/underscore/
 * 
 * indexOf
 * 
 * Returns the index at which value can be found in the array, 
 * or -1 if value is not present in the array. Uses the native 
 * indexOf function unless it's missing. If you're working with 
 * a large array, and you know that the array is already sorted, 
 * pass true for isSorted to use a faster binary search.
 */
 
define([
'compact/collection/sortedIndex'
], function(sortedIndex) {

  var nativeIndexOf  = Array.prototype.indexOf;
  /**
   * If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
   * we need this function. Return the position of the first occurrence of an
   * item in an array, or -1 if the item is not included in the array.
   * Delegates to **ECMAScript 5**'s native `indexOf` if available.
   * If the array is large and already in sort order, pass `true`
   * for **isSorted** to use binary search.
   *
   * @param {Array} array
   * @param {*} item The target whos index is searched in the array
   * @param {Boolean} isSorted Flag for faster search if the array is sorted.
   */
  return function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

});