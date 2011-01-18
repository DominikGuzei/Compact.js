define(['Mixin', 'events/EventDispatcher'], function(Mixin, EventDispatcher) {
	
	/**
	 * PropertyChangeDispatcher mixes in EventDispatcher and
	 * implements watchable property change callback methods 
	 * provided by Class.js. This allows to add event listeners
	 * that watch specific properties for changes and react. 
	 * This includes the full capability of the standard 
	 * event listeners like filtering, validation and notificiations
	 * on and after property changes.
	 */
	
	Mixin("PropertyChangeDispatcher") .mixin(EventDispatcher)
	
	.methods({
		/**
		 * Is called before a property changes and provides
		 * the possibility to filter the value and change it
		 * before it gets applied.
		 * 
		 * @param {string} propertyName Name of property that is about to change 
		 * @param {*} value Value the property changes to
		 */
		_filterChange: function(propertyName, value) {
			var eventName = propertyName + "Change";
			var eventData = {};
			eventData[propertyName] = value;
			return this.filterEvent(eventName, eventData)[propertyName];
		}
	})
	
	.end(this);

	return this.PropertyChangeDispatcher;
});