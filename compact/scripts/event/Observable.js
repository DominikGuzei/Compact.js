define([
  'compact/Module',
  'compact/collection/each'
], 

function(Module, each) {
	
	/**
	 * Observable 
	 * 
	 * Implements the basic Observer Pattern and turns 
	 * the host class into a observable subject that 
	 * allows other objects to register themselves to 
	 * get notified of specific events dispatched by it.
	 */
	
	return Module("Observable") 

	.initialize (function(){
	  
	  /**
	   * The associative collection holding
	   * the callback functions for named events.
	   * @type: {Object} 
	   */
	  this.eventListeners = {};
	  
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
		  var args = Array.prototype.slice.call(arguments);
      args.unshift("eventListeners");
			this._removeCallbackFromCollection.apply(this, args);
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
		_removeCallbackFromCollection: function() {
		  var collection = arguments[0];
		  var index = null;
		  var eventName = "";
		  
		  if(arguments.length == 3) {
		    eventName = arguments[1];
		    var fn = arguments[2];
		    
		    each(this[collection][eventName], function(value, i) {
		      if(fn == value) index = i;
		    });
		  } else {
		    index = arguments[1].index;
		    eventName = arguments[1].eventName;
		  }
		  
		  if(this[collection][eventName]) this[collection][eventName].splice(index, 1);
		}
		
	})

	.end();
});
