define( function() {

  /**
   * clone
   * Makes a deep copy of any object or array
   * @param {object} obj the object to make a deep copy from
   */

  var clone = function(obj) {
    
    if(obj && obj.jquery) {
      return obj.clone();
    }
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    if(obj instanceof Date) {
      return new Date(obj);
    }
    var copy = obj instanceof Array ? [] : {};

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        copy[i] = clone(obj[i]);
      }
    }

    return copy;

  }

  return clone;

});