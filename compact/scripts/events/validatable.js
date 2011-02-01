define(['compact/Mixin'], function(Mixin) {
	
	/**
	 * validatable
	 * 
	 * Enables listeners to tell the Observable if it is
	 * valid to dispatch an event. It is the Observables 
	 * responsibility to use this information appropriately.
	 * Depends on compact/events/observable to register
	 * callbacks to its validators collection.
	 */
	
	Mixin("validatable") 

	.properties ({
	  
	  /**
	   * The collection of validators
	   * @type: {Object} 
	   */
		eventValidators: {}
		
	})	

	.methods ({
		
		/**
		 * Register a callback function to validate
		 * a specific event. 
		 * 
		 * @param {String} eventName
		 * @param {Function} validator
		 * @returns {Object} register information, used to
 		 * remove the registered callback later on.
		 */
		addEventValidator: function(eventName, validator) {
			return this._addCallbackToCollection("eventValidators", eventName, validator);
		},
		
		/**
		 * Removes a registered validator from the collection
		 * 
		 * @param {Object} validatorInfo Holds the information of the validator
		 */
		 
		 removeEventValidator: function(validatorInfo) {
		   this._removeCallbackFromCollection(validatorInfo.collection, validatorInfo.eventName, validatorInfo.index);
		 },
		
		/**
		 * Calls all validators for a specific event
		 * and collects error messages that can be
		 * used by the host class to take appropriate action.
		 * 
		 * @param {String} eventName
		 * @param {Object} eventData
		 * @returns {Object} An object literal with validator
		 * information: { isValid: bool, errors: ['..','..'] } 
		 */
		validateEvent: function(eventName, eventData) {
			var validators = this.eventValidators[eventName];
			var errors = [];
			
			if(validators) {
				for(var i=0; i<validators.length; i++) {
					validators[i].call(this, eventData, errors);
				}
			}
			
			return {
			  isValid: (errors.length == 0),
			  errors: errors
			};
		}
		
	})

	.end(this);
	
	return this.validatable;
});
