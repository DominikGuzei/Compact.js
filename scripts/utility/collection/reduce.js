/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define(['utility/collection/forEach', 
			  'utility/function/bind'], 

function(forEach, bind) {
	
	var nativeReduce = Array.prototype.reduce;

	/** 
	 * reduce
	 * 
	 * Also known as inject and foldl, reduce boils down a list of values 
	 * into a single value. Memo is the initial state of the reduction, 
	 * and each successive step of it should be returned by iterator.
	 * 
	 * @param {Object/Array} obj The object or array that is reduced into the result
	 * @param {Function} iterator The function that gets called for each property/index
	 * @param {*} memo The value that gets passed to each iteration, the "memory"
	 * @param {Object} context The context the iterator is bound to
	 */
	return function(obj, iterator, memo, context) {
	  var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }

    forEach(obj, function(value, index, list) {
      if (!initial && index === 0) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });

    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
	};
});