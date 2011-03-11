define([
  'compact/Class',
  'compact/event/Observable'
], 

function(Class, Observable) {

  return Class("Store") .mixin(Observable)

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
          this.dispatchEvent("create", subject);
          break;
        case "read":
          this.dispatchEvent("read", subject);
          break;
        case "update":
          this.dispatchEvent("update", subject);
          break;
        case "destroy":
          this.dispatchEvent("destroy", subject);
          break;
      }
    }

  })

  .statics({
    instance: undefined,
    getInstance: function() {
      if(!this.instance) {
        this.instance = new this();
      }
      return this.instance;
    }

  })

  .end();

});