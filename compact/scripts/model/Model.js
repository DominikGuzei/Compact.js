define([
  'compact/Class',
  'compact/format/json',
  'compact/collection/Accessible',
  'compact/model/Store',
  'compact/object/clone'
], 

function(Class, JSON, Accessible, Store, clone) {

  return Class("Model") .mixin(Accessible)

  .properties ({
    id: null,
    attributes: {}
  })

  .methods ({

    _accessibleCollection: function() {
      return this.attributes;
    },

    save: function() {
      var method = this.isNew() ? "create" : "update";
      Store.getInstance().synchronize(method, this);
    },

    destroy: function() {
      Store.getInstance().synchronize("destroy", this);
    },

    isNew: function() {
      return this.id ? false : true;
    },

    toJSON: function() {
      return JSON.stringify(this.attributes);
    },
    
    clone: function() {
      return new this.Class({
        attributes: clone(this.attributes),
        eventListeners: clone(this.eventListeners),
        eventValidators: clone(this.eventValidators)
      });
    }

  })
  .end();

});