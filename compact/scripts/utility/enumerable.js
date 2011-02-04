define(['compact/Mixin',
        'compact/utility/collection/find',
        'compact/utility/collection/map',
        'compact/utility/collection/reduce',
        'compact/utility/collection/select',
        'compact/utility/collection/forEach',
        'compact/utility/collection/some',
        ], 

function(Mixin, find, map, reduce, select, forEach, some) {
	
	/**
	 * enumerable
	 * 
	 * Provides a set of useful methods to work with
	 * collections of values (like Arrays, Models). 
	 * 
	 * To use it with your own Class you have to add
	 * it as mixin and define a '_getCollection' method
	 * that returns the object or array of your class
	 * that represents your collection data. All other
	 * methods defined by enumerable work with your
	 * this method and require no further customization.
	 */
	
	Mixin("enumerable")	

	.methods ({
		
    /**
    * Override this method in your mixed Class
    * to return your custom collection.
    */
    _enumerableCollection: function() {
      return this;
    },

    /**
    * Wrapper around compact/utility/forEach
    */
    each: function(iterator, context) {
      return forEach(this._enumerableCollection(), iterator, context);
    },

    /**
    * Wrapper around compact/utility/find
    */
    find: function(iterator, context) {
      return find(this._enumerableCollection(), iterator, context);
    },

    /**
    * Wrapper around compact/utility/map
    */
    map: function(iterator, context) {
      return map(this._enumerableCollection(), iterator, context);
    },

    /**
    * Wrapper around compact/utility/reduce
    */
    reduce: function(iterator, context) {
      return reduce(this._enumerableCollection(), iterator, context);
    },

    /**
    * Wrapper around compact/utility/select
    */
    select: function(iterator, context) {
      return select(this._enumerableCollection(), iterator, context);
    },
 		 
 		/**
    * Wrapper around compact/utility/some 
    */
    any: function(iterator, context) {
      return some(this._enumerableCollection(), iterator, context);
    }
	})

	.end(this);
	
	return this.enumerable;
});
