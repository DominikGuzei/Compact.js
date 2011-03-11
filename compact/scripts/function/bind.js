/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define( function() {

  var slice = Array.prototype.slice;
  /**
   * bind
   *
   * Bind a function to an object, meaning that whenever the function is called, the
   * value of this will be the object. Optionally, bind arguments to the function to
   * pre-fill them, also known as currying.
   *
   * @param {Function} func The function that is bound to an object
   * @param {Object} object The object the function is bound to
   */
  return function(func, object) {
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(object || {}, args.concat(slice.call(arguments)));
    };

  };

});