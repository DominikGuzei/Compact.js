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
      this.dispatchEvent("add", model, this.models.length-1, this);
    },

    remove: function(model) {
      var removedIndex = null;
      var removedModel = this.find( function(currentModel, index) {
        if(model == currentModel) {
          removedIndex = index;
          return this.models.splice(index, 1);
        }
      }, this);

      if(removedModel) {
        this.dispatchEvent("remove", removedModel, removedIndex, this);
      }
      return removedModel;
    },
    
    refresh: function(newModels) {
      if(this.models === newModels) { return; }
      this.models = newModels;
      this.dispatchEvent("refresh");
    },
    
    pop: function() {
      var removedModel = this.models.pop();
      
      if(removedModel) {
        this.dispatchEvent("pop", removedModel);
        this.dispatchEvent("remove", removedModel);
      }
      return removedModel;
    },
    
    all: function() {
      return this.models;
    },
    
    first: function() {
      return this.models[0];
    },

    _enumerableCollection: function() {
      return this.models;
    }

  })

  .end();

});
