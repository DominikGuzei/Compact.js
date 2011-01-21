define(['Class', 'events/EventDispatcher'], function(Class, EventDispatcher) {
	
	var namespace = this;
	
	Class("Store") .mixin(EventDispatcher)
	.methods({
		
		/**
		 * Dispatches an event with basic CRUD
		 * operation and a subject model or collection
		 * 
		 * @param {String} method The CRUD method name
		 * @param {Model/Collection} subject The model or collection to
		 * apply the CRUD method on
		 */
		synchronize: function(method, subject) {
			switch(method) {
				case "create":
					this.onEvent("create", subject);
					break;
				case "read":
					this.onEvent("read", subject);
					break;
				case "update":
					this.onEvent("update", subject);
					break;
				case "destroy":
					this.onEvent("destroy", subject);
					break;
			}
		}
	})
	.statics({
		instance: undefined,
		getInstance: function() {
			if(!namespace.Store.instance) {
				namespace.Store.instance = new namespace.Store();
			}
			return namespace.Store.instance;
		}
	})
	.end(namespace);
	
	return namespace.Store;
	
});