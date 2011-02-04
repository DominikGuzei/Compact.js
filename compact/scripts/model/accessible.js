define(['compact/Mixin', 
        'compact/events/Observable',
        'compact/events/Validatable'], 

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
		
		get: function(key) {
			return this.getter(key);
		},
		
		getter: function(key) {
		  return this[key];
		},
		
		set: function(key, value) {
			
			if(typeof(key) == 'object') {
				for(property in key) {
					if(key.hasOwnProperty(property)) {
						this.set(property, key[property]);
					}
				}
			}
			
			if(typeof(key) == 'string') {
			  this.change(key, value);
			}
		},
		
		change: function(key, value) {
		  
		  var generalResult = this.validateEvent("change", {
        key: key,
        value: value
      });
      
		  var specificResult = this.validateEvent("change:" + key, value);
      
			if (generalResult.isValid && specificResult.isValid) {
			  
				this.setter(key, value);
				
				this.dispatchEvent("changed", {
				  key: key,
				  value: value
				});
				this.dispatchEvent("changed:" + key, value);
				
			} else {
			  
			  this.dispatchEvent("invalid:change", { 
			    key: key, 
			    value: value, 
			    errors: generalResult.errors.concat(specificResult.errors)
			  });
			  
			}
		},
		
		setter: function(key, value) {
		  this[key] = value;
		}
		
	})
	
	.end(this);

	return this.Accessible;
});