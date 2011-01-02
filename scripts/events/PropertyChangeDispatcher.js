define(['events/EventDispatcher'], function(EventDispatcher) {
	
	Class("Class.events.PropertyChangeDispatcher")
	
	.mixin(EventDispatcher)
	
	.methods({
		_filterChange: function(prop, value) {
			var eventName = prop + "Change"
			var args = {};
			args[prop] = value;
			return this.filterEvent(eventName, args)[prop];
		},
		
		_beforeChange: function(prop, value) {
			var eventName = prop + "Change"
			var args = {};
			args[prop] = value;
			var validated = this.validateEvent(eventName, args);
			validated && this._dispatch("on", eventName, args);
			return validated;
		},
		
		_afterChange: function(prop, value) {
			var args = {};
			args[prop] = value;
			this._dispatch("after", prop + "Change", args);
		}
	})
	
	.end();

	return Class.events.PropertyChangeDispatcher;
}