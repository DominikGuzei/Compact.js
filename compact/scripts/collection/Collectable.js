define([
  'compact/Module',
  'compact/collection/find',
  'compact/collection/map',
  'compact/collection/reduce',
  'compact/collection/select',
  'compact/collection/each',
  'compact/collection/some',
  'compact/collection/reject',
  'compact/collection/every',
  'compact/collection/contains',
  'compact/collection/invoke'
], 

function(Module, find, map, reduce, select, 
         each, some, reject, every, contains,
         invoke) {
	
	/**
	 * Collectable
	 * 
	 * Provides a set of useful methods to work with
	 * collections of values (like Arrays, Models). 
	 * 
	 * To use it with your own Module you have to add
	 * it as mixin and define a '_collectableCollection' method
	 * that returns the object or array of your class
	 * that represents your enumerable data. All other
	 * methods defined by enumerable work with your
	 * this method and require no further customization.
	 */
	
	return Module("Collectable")	

	.methods ({
		
    /**
    * Override this method in your mixed Module
    * to return your custom collection.
    * 
    * @return the enumerable object
    */
    _collectableCollection: function() {
      return this;
    },

    /**
    * Wrapper around compact/collection/each
    */
    each: function(iterator, context) {
      return each(this._collectableCollection(), iterator, context);
    },

    /**
    * Wrapper around compact/collection/find
    */
    find: function(iterator, context) {
      return find(this._collectableCollection(), iterator, context);
    },

    /**
    * Wrapper around compact/collection/map
    */
    map: function(iterator, context) {
      return map(this._collectableCollection(), iterator, context);
    },

    /**
    * Wrapper around compact/collection/reduce
    */
    reduce: function(iterator, context) {
      return reduce(this._collectableCollection(), iterator, context);
    },

    /**
    * Wrapper around compact/collection/select
    */
    select: function(iterator, context) {
      return select(this._collectableCollection(), iterator, context);
    },
 		 
 		/**
    * Wrapper around compact/collection/some 
    */
    any: function(iterator, context) {
      return some(this._collectableCollection(), iterator, context);
    },
    
    reject: function(iterator, context) {
      return reject(this._collectableCollection(), iterator, context);
    },
    
    every: function(iterator, context) {
      return every(this._collectableCollection(), iterator, context);
    },
    
    contains: function(value) {
      return contains(this._collectableCollection(), value);
    },
    
    invoke: function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this._collectableCollection());
      invoke.apply(this, args);
    }
	})

	.end();
});
