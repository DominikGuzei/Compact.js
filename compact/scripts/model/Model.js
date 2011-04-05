define([
  'compact/Module',
  'compact/format/json',
  'compact/collection/Accessible',
  'compact/model/Store',
  'compact/object/clone'
], 

function(Module, JSON, Accessible, Store, clone) {

  return Module("Model") .mixin(Accessible)

  .initialize (function(data, id){
    this.id = id || null;
    this.data = data || {};
  })
  
  .methods ({

    _accessibleCollection: function() {
      return this.data;
    },

    save: function() {
      var method = this.isNew() ? "create" : "update";
      Store.getInstance().synchronize(method, this);
    },

    destroy: function() {
      this.dispatchEvent("destroy", this);
      Store.getInstance().synchronize("destroy", this);
    },

    isNew: function() {
      return this.id ? false : true;
    },

    toJSON: function() {
      return JSON.stringify(this.data);
    },
    
    clone: function() {
      var cloned = new this.Module( clone(this.data) );
      cloned.eventListeners = clone(this.eventListeners);
      cloned.eventValidators = clone(this.eventValidators);
      return cloned;
    }

  })
  .end();

});