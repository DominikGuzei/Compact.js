/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define([
'compact/collection/map'
], function(map) {
  /**
   * invoke
   *
   * Calls the method named by methodName on each value in the list. 
   * Any extra arguments passed to invoke will be forwarded on to the method invocation.
   *
   * @param {Object/Array} obj The object or array the function should be invoked on
   * @param {Function} method The function that is called on each item
   */
  return function(obj, method) {
    var args = Array.prototype.slice.call(arguments, 2);
    return map(obj, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });

  };

});