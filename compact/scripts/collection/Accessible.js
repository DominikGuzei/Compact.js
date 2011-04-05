define([
  'compact/Module',
  'compact/event/Observable',
  'compact/event/Validatable'
], 

function(Module, Observable, Validatable) {

  /**
   * Accessible
   *
   * Mixes in observable and validatable to
   * implement watchable/validatable property. This allows
   * to add listeners that watch for specific property changes
   * and to (in)validate those changes externally
   */

  return Module("Accessible") .mixin( Observable, Validatable )

  .methods({

    /**
     * Returns the value for the key in the collection
     * @param {String} key
     */
    get: function(key) {
      return this._accessibleCollection()[key];
    },

    /**
     * Sets values for keys on the collection.
     * Can be used to set multiple values at once
     * with an object literal with key-value mapping
     * to the accessible collection.
     *
     * @param {String/Object} key A string key to set a single
     * value, or an object with key/values that should all be set at once
     * @param {*} value If a single change -> the value for the key
     */
    set: function(key, value, silent) {
      
      silent = silent || false;
      var changed = false;
      
      if(typeof(key) == 'object') {
        var changedValues = key;
        var validateResults = this.validateEvent(this.beforeChange(), changedValues);
        
        if(validateResults.isValid) {
          for(var property in key) {
            if(key.hasOwnProperty(property)) {
              if(this.set(property, key[property], true)) { changed = true; }
            }
          }
          if(changed) { 
            this.dispatchEvent(this.afterChange(), changedValues); 
          }

        }
        else {
          this.dispatchEvent(this.invalidChange(), {
            errors: validateResults.errors
          });
        }
      }

      if(typeof(key) == 'string') {
        changed = this.change(key, value);
        if(changed && !silent) { 
          this.dispatchEvent(this.afterChange(), this._accessibleCollection());
        }
        return changed;
      }
    },

    /**
     * Used for adding listeners to the accessible
     * that should be called before a change happens.
     * This function just provides a safer way to add
     * the correct event name, it could also be added
     * manually as simple string, which would be more
     * error prone in case the implementation changes.
     *
     * @param {String} key The property name that should be observed
     * @returns {String} The fully scoped event name
     */

    beforeChange: function(key) {
      return key ? "accessible:change:" + key : "accessible:change";
    },

    /**
     * Used for adding listeners to the accessible
     * that should be called after a change happens.
     * For details see beforeChange
     *
     * @param {String} key The property name that should be observed
     * @returns {String} The fully scoped event name
     */

    afterChange: function(key) {
      return key ? "accessible:changed:" + key : "accessible:changed";
    },

    /**
     * Used for adding listeners to the accessible
     * that should be called after a change was invalidated.
     * For details see beforeChange
     *
     * @param {String} key The property name that should be observed
     * @returns {String} The fully scoped event name
     */

    invalidChange: function(key) {
      return key ? "accessible:invalid:" + key : "accessible:invalid";
    },

    /**
     * Used by the set method to change each value
     * separately and dispatch corresponding events.
     *
     * @param {String} key
     * @param {*} value
     */
    change: function(key, value) {
      if(this._accessibleCollection()[key] !== value) {
        var specificResult = this.validateEvent(this.beforeChange(key), value);
  
        if (specificResult.isValid) {
          this._accessibleCollection()[key] = value;
          this.dispatchEvent(this.afterChange(key), value);
        }
        else {
          this.dispatchEvent(this.invalidChange(key), {
            key: key,
            value: value,
            errors: specificResult.errors
          });
        }
  
        return true;
      } else {
        return false;
      }
    },

    /**
     * Returns the collection object/array that
     * should be used to be accessible.
     * Override this method to inject your custom
     * collection that is used instead.
     */
    _accessibleCollection: function() {
      return this;
    }

  })

  .end();
});