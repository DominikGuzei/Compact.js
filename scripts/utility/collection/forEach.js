define(function() {
	
	var nativeforEach = Array.prototype.forEach,
			breaker = {};

	/** 
	 * Handles objects implementing `forEach`, arrays, and raw objects.
	 * Delegates to **ECMAScript 5**'s native `forEach` if available.
	 */
	return function(obj, iterator, context) {
	  var value;
    if (obj == null) return;
    if (nativeforEach && obj.forEach === nativeforEach) {
      obj.forEach(iterator, context);
    } else if (_.isNumber(obj.length)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };
	
});