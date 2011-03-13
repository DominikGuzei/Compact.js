define([
  'compact/Mixin'
], 

function(Mixin) {
	
	/**
	 * Observable 
	 * 
	 * Implements the basic Observer Pattern and turns 
	 * the host class into a observable subject that 
	 * allows other objects to register themselves to 
	 * get notified of specific events dispatched by it.
	 */
	
	return Mixin("Observable") 

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
		addEventListener: function(eventName, listener, context) {
			return this._addCallbackToCollection("eventListeners", eventName, listener, context);
		},
		
		/**
		 * Unregisters a callback from a specific event
		 * with the help of a register information object
		 * returned by the addEventListener method.
		 * 
		 * @param {Object} callbackInfo Holds the information
		 * of the previously registered callback/event.
		 */
		removeEventListener: function(callbackInfo) {
			this._removeCallbackFromCollection(callbackInfo.collection, callbackInfo.eventName, callbackInfo.index);
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
					listeners[i].callback.call(listeners[i].context, eventData);
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
		 * 
		 * @returns {Object} Holds the information
 		 * of the registered callback/event.
		 */
		_addCallbackToCollection: function(collection, eventName, callback, context) {
			
			if(!this[collection][eventName]) {
				this[collection][eventName] = [];
			}
			this[collection][eventName].push({
			  callback: callback,
			  context: context || this
			});
			return {
				collection: collection,
				eventName: eventName,
				index: this[collection][eventName].length -1
			};
		},
		
		/**
		 * A generic way to remove callbacks from specific
		 * callback collections.
		 * 
		 * @param {String} collection Name of the collection
		 * @param {String} eventName
		 * @param {Integer} index The index of the callback in the event array
		 */
		_removeCallbackFromCollection: function(collection, eventName, index) {
		  this[collection][eventName].splice(index, 1);
		}
		
	})

	.end();
});
