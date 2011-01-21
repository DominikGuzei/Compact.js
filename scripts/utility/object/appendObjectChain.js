define(function() {

	/**
	 * appendObjectChain
	 * 
	 * Takes a object and appends an object chain 
	 * with the objects included in the chainArray
	 * 
	 * @param {Object} object The context the namespace is applied to
	 * @param {Array} chain The complete classpath split up as array 
	 * 
	 * @returns {Object} The last object in the chain
	 * 
	 */
	
	return function(object, chain) {
		var next = object[chain[0]] || (object[chain[0]] = {});
		for (var i = 1; i < chain.length; i++) {
			next[chain[i]] || (next[chain[i]] = {});
			object = next;
			next = next[chain[i]];
		}
		return object;
	}
	
});


	

	