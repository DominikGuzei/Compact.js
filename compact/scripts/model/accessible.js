define(['compact/Mixin', 
        'compact/event/Observable',
        'compact/event/Validatable'], 

function(Mixin, Observable, Validatable) {
	
	/**
	 * Accessible
	 *  
	 * Mixes in observable and validatable to
	 * implement watchable/validatable property. This allows 
	 * to add listeners that watch for specific property changes
	 * and to (in)validate those changes externally
	 */
	
	Mixin("Accessible") .mixin( Observable, Validatable )
	
	.methods({
		
		/**
		 * Returns the value for the key in the collection
		 * @param {String} key 
		 */
		get: function(key) {
			return this._accessibleCollection()[key];
		},
		
		/**
		 * Sets values for keys on the collection.
		 * Can be used to set multiple values at once
		 * with an object literal with key-value mapping
		 * to the accessible collection.
		 * 
		 * @param {String/Object} key A string key to set a single
		 * value, or an object with key/values that should all be set at once
		 * @param {*} value If a single change -> the value for the key
		 */
		set: function(key, value) {
			
			if(typeof(key) == 'object') {
			  var changedValues = key;
			  var validateResults = this.validateEvent("change", changedValues);
				
				if(validateResults.isValid) {
				  for(property in key) {
  					if(key.hasOwnProperty(property)) {
  						this.set(property, key[property]);
  					}
  				}
				  this.dispatchEvent("changed", changedValues);
				  
				} else {
				  this.dispatchEvent("invalid:change", {
			      errors: validateResults.errors
			    });
				}
			}
			
			if(typeof(key) == 'string') {
			  this.change(key, value);
			}
		},
		
		/**
		 * Used by the set method to change each value
		 * separately and dispatch corresponding events.
		 * 
		 * @param {String} key
		 * @param {*} value 
		 */
		change: function(key, value) {
      
		  var specificResult = this.validateEvent("change:" + key, value);
      
			if (specificResult.isValid) {			  
				this._accessibleCollection()[key] = value;
				this.dispatchEvent("changed:" + key, value);	
			} else {
			  this.dispatchEvent("invalid:change:" + key, {
			    key: key,
			    value: value,
		      errors: specificResult.errors
		    });
			}
			
			return specificResult;
		},
		
		/**
		 * Returns the collection object/array that
		 * should be used to be accessible.
		 * Override this method to inject your custom
		 * collection that is used instead. 
		 */
		_accessibleCollection: function() {
		  return this;
		},
		
	})
	
	.end(this);

	return this.Accessible;
});