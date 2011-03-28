define([
  'compact/Module'
], 

function(Module) {

  /**
   * Validatable
   *
   * Enables listeners to tell the Observable if it is
   * valid to dispatch an event. It is the Observables
   * responsibility to use this information appropriately.
   * Depends on compact/events/observable to register
   * callbacks to its validators collection.
   */

  return Module("Validatable")

  .initialize (function(){
    /**
     * The collection of validators
     * @type: {Object}
     */
    this.eventValidators = {};

  })

  .methods ({

    /**
     * Register a callback function to validate
     * a specific event.
     *
     * @param {String} eventName
     * @param {Function} validator
     * @returns {Object} register information, used to
     * remove the registered callback later on.
     */
    addEventValidator: function(eventName, validator, context) {
      return this._addCallbackToCollection("eventValidators", eventName, validator, context);
    },

    /**
     * Removes a registered validator from the collection
     *
     * @param {Object} validatorInfo Holds the information of the validator
     */

    removeEventValidator: function(validatorInfo) {
      var args = Array.prototype.slice.call(arguments);
      args.unshift("eventValidators");
      this._removeCallbackFromCollection.apply(this, args);
    },

    /**
     * Calls all validators for a specific event
     * and collects error messages that can be
     * used by the host class to take appropriate action.
     *
     * @param {String} eventName
     * @param {Object} eventData
     * @returns {Object} An object literal with validator
     * information: { isValid: bool, errors: ['..','..'] }
     */
    validateEvent: function(eventName, eventData) {
      var validators = this.eventValidators[eventName];
      var errors = [];

      if(validators) {
        for(var i=0; i<validators.length; i++) {
          validators[i].callback.call(validators[i].context, eventData, errors);
        }
      }

      return {
        isValid: (errors.length == 0),
        errors: errors
      };
    }

  })

  .end();

});
