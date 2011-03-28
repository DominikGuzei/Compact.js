define([
  'compact/Module',
  'compact/collection/Enumerable',
  'compact/event/Observable'
], 

function(Module, Enumerable, Observable) {

  return Module("Collection") .mixin( Enumerable, Observable )

  .initialize(function(models) {
    this.models = models || [];
  })

  .methods({

    get: function(id) {
      return this.find( function(model) {
        return model.id == id ? true : false;
      });

    },

    add: function(model) {
      this.models.push(model);
      this.dispatchEvent("add", model);
    },

    remove: function(model) {
      var removedModel = this.find( function(currentModel, index) {
        return model == currentModel ? this.models.splice(index, 1) : false;
      }, this);

      if(removedModel) {
        this.dispatchEvent("remove", removedModel);
      }
      return removedModel;
    },
    
    pop: function() {
      var removedModel = this.models.pop();
      
      if(removedModel) {
        this.dispatchEvent("pop", removedModel);
        this.dispatchEvent("remove", removedModel);
      }
      return removedModel;
    },

    _enumerableCollection: function() {
      return this.models;
    }

  })

  .end();

});
