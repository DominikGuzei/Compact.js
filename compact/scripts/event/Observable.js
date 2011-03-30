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

	.methods ({
		
		/**
     * Returns the associative collection holding
     * the callback functions for named events.
     * @returns {Object} The event listeners
     */
		eventListeners: function() {
		  if(!this._eventListeners) { this._eventListeners = {}; }
		  return this._eventListeners;
		},
		
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
		 * Unregisters all listeners that were registered
		 * with a specific context
		 * 
		 * @param {Object} context
		 */
		 removeEventListenersWithContext: function(context) {
		   this._removeCallbacksFromCollectionWithContext("eventListeners", context);
		 },
	  
	  /**
	   * Dispatch an event and automatically notify
	   * all registered callbacks for the event.
	   * 
	   * @param {String} eventName
	   * @param {Object} eventData
	   */
		dispatchEvent: function() {
		  var args = Array.prototype.slice.call(arguments);
		  var eventName = args[0];
			var listeners = this.eventListeners()[eventName];
			
			if(listeners) {
				for(var i=0; i<listeners.length; i++) {
					listeners[i].callback.apply(listeners[i].context, args.slice(1));
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
		_addCallbackToCollection: function(collectionName, eventName, callback, context) {
			var collection = this[collectionName]();
			
			if(!collection[eventName]) {
				collection[eventName] = [];
			}
			
			collection[eventName].push({
			  callback: callback,
			  context: context || this
			});
			
			var callbackInfo = {
        collection: collectionName,
        eventName: eventName,
        index: collection[eventName].length -1
      };
			
			if(context) {
        var contexts = collection.__contexts__ || {};
        contexts[context] = contexts[context] || [];
        contexts[context].push(callbackInfo);
        collection.__contexts__ = contexts;
      }
      
			return callbackInfo;
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
		  var collection = this[arguments[0]]();
		  var index = null;
		  var eventName = "";
		  
		  if(arguments.length == 3) {
		    eventName = arguments[1];
		    var fn = arguments[2];
		    
		    each(collection[eventName], function(value, i) {
		      if(fn == value) index = i;
		    });
		  } else {
		    index = arguments[1].index;
		    eventName = arguments[1].eventName;
		  }
		  
		  if(collection[eventName]) collection[eventName].splice(index, 1);
		},
		
		/**
		 * A generic way to remove all listeners from a collection
		 * that were registered with a specific context
		 * 
		 * @param {String} collectionName,
		 * @param {Object} context
		 */
		_removeCallbacksFromCollectionWithContext: function(collectionName, context) {
		  var collection = this[collectionName]();
		  var contexts = collection.__contexts__;
		  if(contexts && contexts[context]) {
		    each(contexts[context], function(callbackInfo) {
		      this._removeCallbackFromCollection(collectionName, callbackInfo);
		    }, this);
		  }
		}
	})

	.end();
});
