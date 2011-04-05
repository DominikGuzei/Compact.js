/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 * 
 * Uses a binary search to determine the index at which the value should be 
 * inserted into the list in order to maintain the list's sorted order. 
 * If an iterator is passed, it will be used to compute the sort ranking of each value.
 * 
 */

define(function() {

  /**
   * sortedIndex
   *
   * Use a comparator function to figure out at what index an object should
   * be inserted so as to maintain order. Uses binary search.
   *
   * @param {Object/Array} array The object or array that is searched
   * @param {*} target The target that is searched in the collection
   */
  return function(array, obj, iterator) {
    iterator = iterator || function(mid) { return mid; };
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

});
