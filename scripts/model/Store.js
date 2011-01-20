define(['Class', 'events/EventDispatcher'], function(Class, EventDispatcher) {
	
	var namespace = this;
	
	Class("Store") .mixin(EventDispatcher)
	.methods({
		synchronize: function(method, model) {
			switch(method) {
				case "create":
					this.onEvent("create", model);
					break;
				case "read":
					this.onEvent("read", model);
					break;
				case "update":
					this.onEvent("update", model);
					break;
				case "delete":
					this.onEvent("delete", model);
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