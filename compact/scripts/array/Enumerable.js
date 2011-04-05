define([
  'compact/Module',
  'compact/array/indexOf'
], 

function(Module, indexOf) {
  
  /**
   * Enumerable
   * 
   * Provides a set of useful methods to work with arrays
   * 
   * To use it with your own Module you have to add
   * it as mixin and define a '_enumerableCollection' method
   * that returns the array of your module that represents 
   * your enumerable data. All other methods defined by 
   * enumerable work with your this method and require 
   * no further customization.
   */
  
  return Module("Enumerable")  

  .methods ({
    
    /**
    * Override this method in your mixed Module
    * to return your custom array.
    * 
    * @return the enumerable array
    */
    _enumerableCollection: function() {
      return this;
    },

    /**
    * @see compact/array/indexOf
    */
    indexOf: function(item, isSorted) {
      return indexOf(this._enumerableCollection(), item, isSorted);
    },
    
    at: function(index) {
      return this._enumerableCollection()[index];
    },
    
    length: function() { 
      return this._enumerableCollection().length;
    },
    
    size: function() { return this.length(); }
    
  })

  .end();
});
