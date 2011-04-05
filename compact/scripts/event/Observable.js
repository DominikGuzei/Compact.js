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
				  if(!listeners[i].callback) {
				    throw "Observable: Callback is not a function for event '" + eventName + "' with arguments " + args.slice(1).join(" ");
				  }
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
        callback: callback
      };
			
			if(context) {
        var contexts = collection.__contexts__ || [];
        var foundContext = this._findEventContext(contexts, context).contextInfo;
        
        foundContext = foundContext || { 
          context: context,
          callbacks: []
        };
        
        contexts.push(foundContext);
        foundContext.callbacks.push(callbackInfo);
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
		  var args = arguments;
		  var collection = this[ args[0] ]();
		  var callbackInfo = args.length < 3 ? args[1] : null; 
		  var eventName = callbackInfo ? callbackInfo.eventName : args[1];
		  var callback = callbackInfo ? callbackInfo.callback : args[2];
		  
		  var index = -1;
		  each(collection[eventName], function(value, i) {
        if(callback === value) { 
          index = i; 
        }
      });
		  
		  if(collection[eventName]) {
		    collection[eventName].splice(index, 1);
		    if(!collection[eventName].length) {
		      delete collection[eventName];
		    }
		  }
		},
		
		_findEventContext: function(contexts, searchedContext) {
		  var searchedContextInfo = null;
		  var index = -1;
		  
		  each(contexts, function(contextInfo, i) {
		    if(contextInfo.context === searchedContext) {
		      searchedContextInfo = contextInfo;
		      index = i;
		    }
		  });
		  
		  return {
		    contextInfo: searchedContextInfo,
		    index: index
		  }
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
		  var foundContext = this._findEventContext(contexts, context);
		  
		  if(foundContext.contextInfo) {
		    each(foundContext.contextInfo.callbacks, function(callbackInfo, index) {
		      this._removeCallbackFromCollection(collectionName, callbackInfo);
		    }, this);
		    contexts.splice(foundContext.index, 1);
		  }
		}
	})

	.end();
});
