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
		},

		/**
		 * Is called before a property changes and provides
		 * the possibility to validate (e.g: cancle) the property
		 * change. If the validation returns true this function
		 * also dispatches an on event for the property change
		 * 
		 * @param {string} propertyName Name of property that is about to change 
		 * @param {*} value Value the property changes to
		 */
		_beforeChange: function(propertyName, value) {
			var eventName = propertyName + "Change";
			var eventData = {};
			eventData[propertyName] = value;
			var validated = this.validateEvent(eventName, eventData);
			validated && this._dispatch("on", eventName, eventData);
			return validated;
		},
		
		/**
		 * Is called after a property has changed and dispatches
		 * an 'after' event for the property change
		 * 
		 * @param {string} paramName Name of property that has changed 
		 * @param {*} value Value the property has changed to
		 */
		
		_afterChange: function(propertyName, value) {
			var eventData = {};
			eventData[propertyName] = value;
			this._dispatch("after", propertyName + "Change", eventData);
		}
		
	})
	
	.end(this);

	return this.PropertyChangeDispatcher;
});