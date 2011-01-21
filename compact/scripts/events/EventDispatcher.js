define(['compact/Mixin'], function(Mixin) {
	
	Mixin("EventDispatcher") 

	.properties ({
		eventListeners: {
			filter: {},
			validate: {},
			on: {},
			after: {}
		}
	})	

	.methods ({
		
		filter: function(eventName, filter) {
			return this._addListener("filter", eventName, filter);
		},
		
		validate: function(eventName, validator) {
			return this._addListener("validate", eventName, validator);
		},
		
		on: function(eventName, listener) {
			return this._addListener("on", eventName, listener);
		},
		
		after: function(eventName, listener) {
			return this._addListener("after", eventName, listener);
		},
		
		detach: function(id) {
			this.eventListeners[id.type][id.eventName].splice(id.index, 1);
		},
		
		filterEvent: function(eventName, args) {
			var filters = this.eventListeners["filter"][eventName];
			if(filters) {
				for(var i=0; i<filters.length; i++) {
					args = filters[i].call(this, args);
				}
			}
			return args;
		},
		
		validateEvent: function(eventName, args) {
			var validators = this.eventListeners["validate"][eventName];
			var validated = true;
			if(validators) {
				for(var i=0; i<validators.length; i++) {
					validated = validators[i].call(this, args);
				}
			}
			return validated;
		},
		
		onEvent: function() {
			this._dispatch("on", arguments[0], arguments[1]);
		},
		
		afterEvent: function() {
			this._dispatch("after", arguments[0], arguments[1]);
		},
		
		_dispatch: function(type, eventName, args) {
			var listeners = this.eventListeners[type][eventName];
			if(listeners) {
				for(var i=0; i<listeners.length; i++) {
					listeners[i].call(this, args);
				}
			}
		},
		
		_addListener: function(type, eventName, listener) {
			var eventListeners = this.eventListeners;
			
			if(!eventListeners[type][eventName]) {
				eventListeners[type][eventName] = [];
			}
			eventListeners[type][eventName].push(listener);
			return {
				type: type,
				eventName: eventName,
				index: eventListeners[type][eventName].length -1
			};
		}
	})

	.end(this);
	
	return this.EventDispatcher;
});
