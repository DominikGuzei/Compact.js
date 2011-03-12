/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define([
'compact/collection/some'
], function(some) {

  var nativeIndexOf  = Array.prototype.indexOf;
  /**
   *
   * contains
   *
   * Returns true if the value is present in the list, using === to test equality.
   * Uses indexOf internally, if list is an Array.
   *
   * @param {Object/Array} obj The object or array that is searched
   * @param {*} target The target that is searched in the collection
   */
  return function(obj, target) {
    var found = false;
    if (obj == null)
      return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf)
      return obj.indexOf(target) != -1;
    some(obj, function(value) {
      if (found = value === target)
        return true;
    });

    return found;
  };

});