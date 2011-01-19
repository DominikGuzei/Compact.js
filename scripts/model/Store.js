define(['Class', 'events/EventDispatcher'], function(Class, EventDispatcher) {
	
	var namespace = this;
	
	Class("Storage") .mixin(EventDispatcher)
	
	.statics({
		instance: undefined,
		get: function() {
			if(!namespace.Storage.instance) {
				namespace.Storage.instance = new namespace.Storage();
			}
			return namespace.Storage.instance;
		}
	})
	.end(namespace);
	
	return namespace.Storage;
	
});