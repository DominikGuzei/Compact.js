define([
  'compact/Module'
], 

function(Module) {

  /**
   * Filterable
   *
   * Enables listeners to filter/modify event data before
   * it is used. Depends on the compact/events/observable
   * to add callbacks to its collection.
   */

  return Module("Filterable")

  .methods ({

    /**
     * Returns the associative collection holding
     * the callback functions for named filters.
     * @returns {Object} The event filters
     */
    eventFilters: function() {
      if(!this._eventFilters) { this._eventFilters = {}; }
      return this._eventFilters;
    },
    
    /**
     * Register a callback function to filter
     * a specific event.
     *
     * @param {String} eventName
     * @param {Function} filter The callback function
     * @returns {Object} register information, used to
     * remove the registered callback later on.
     */
    addEventFilter: function(eventName, filter, context) {
      return this._addCallbackToCollection("eventFilters", eventName, filter, context);
    },

    /**
     * Removes a registered callback from the
     * eventFilters collection
     *
     * @param {Object} filterInfo Holds the information
     * to easily remove the filter.
     */

    removeEventFilter: function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift("eventFilters");
      this._removeCallbackFromCollection.apply(this, args);
    },
    
    /**
     * Unregisters all listeners that were registered
     * with a specific context
     * 
     * @param {Object} context
     */
     removeEventFiltersWithContext: function(context) {
       this._removeCallbacksFromCollectionWithContext("eventFilters", context);
     },

    /**
     * Calls all registered filter callbacks
     * for the given event with the event data.
     * Overwrites the event data of the event with
     * the return value of each filter callback.
     *
     * @param {String} eventName
     * @param {Object} eventData
     * @returns {Object} The modified eventData object
     */
    filterEvent: function(eventName, eventData) {
      var filters = this.eventFilters()[eventName];
      if(filters) {
        for(var i=0; i<filters.length; i++) {
          filters[i].callback.call(filters[i].context, eventData);
        }
      }
      return eventData;
    }

  })

  .end();
});
