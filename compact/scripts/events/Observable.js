define(['compact/Mixin'], function(Mixin) {
	
	/**
	 * The Observable Mixin implements the basic
	 * Observer Pattern and turns the host class into
	 * a observable subject that allows other objects
	 * to register themselves to get notified of specific
	 * events dispatched by it.
	 */
	
	Mixin("Observable") 

	.properties ({
	  
	  /**
	   * The associative collection holding
	   * the callback functions for named events.
	   * @type: {Object} 
	   */
	  eventListeners: {}
	  
	})	

	.methods ({
		
		/**
		 * Registers a callback function for a specific event
		 * 
		 * @param {String} eventName
		 * @param {Function} listener The callback function
		 * @returns {Object} register information, used to
		 * remove the registered callback later on.
		 * 
		 */
		addEventListener: function(eventName, listener) {
			return this._addListener("eventListeners", eventName, listener);
		},
		
		/**
		 * Unregisters a callback from a specific event
		 * with the help of a register information object
		 * returned by the addEventListener method.
		 * 
		 * @param {Object} registerInfo Holds the information
		 * of the previously registered callback/event.
		 */
		removeEventListener: function(registerInfo) {
			this[registerInfo.collection][registerInfo.eventName].splice(registerInfo.index, 1);
		},
	  
	  /**
	   * Dispatch an event and automatically notify
	   * all registered callbacks for the event.
	   * 
	   * @param {String} eventName
	   * @param {Object} eventData
	   */
		dispatchEvent: function(eventName, eventData) {
			var listeners = this.eventListeners[eventName];
			if(listeners) {
				for(var i=0; i<listeners.length; i++) {
					listeners[i].call(this, eventData);
				}
			}
		},
		
		/**
		 * A generic way to add callbacks to specific 
		 * associative listener collections.
		 * 
		 * @param {String} collection Name of the collection
		 * @param {String} eventName
		 * @param {Function} listener The callback
		 */
		_addListener: function(collection, eventName, listener) {
			
			if(!this[collection][eventName]) {
				this[collection][eventName] = [];
			}
			this[collection][eventName].push(listener);
			return {
				collection: collection,
				eventName: eventName,
				index: this[collection][eventName].length -1
			};
		}
	})

	.end(this);
	
	return this.Observable;
});
