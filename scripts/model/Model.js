define(['Class', 'events/EventDispatcher', 'model/Store'], function(Class, EventDispatcher, Store) {
	
	Class("Model") .mixin(EventDispatcher)
	
	.properties ({
		id: null,
		attributes: {}
	})
	
	.methods ({
		get: function(key) {
			if(!this.attributes[key]) {
				throw new Error("No property '" + key + "' defined on this model");
			}
			return this.attributes[key];
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
				var validated = true;
				var eventName = "change:" + key;
				
				validated = this.validateEvent(eventName, value);
				validated && this._dispatch("on", eventName, value);

				if (validated) {
					this.attributes[key] = value;
				}
			}
		},
		
		save: function() {
			var method = this.isNew() ? "create" : "update";
			Store.getInstance().synchronize(method, this);
		},
		
		destroy: function() {
			Store.getInstance().synchronize("destroy", this);
		},
		
		isNew: function() {
			return this.id ? false : true;
		},
		
		toJSON: function() {
			return JSON.stringify(this.attributes);
		}
	})
	.end(this);
	
	return this.Model;
	
});