define([
  'compact/Module',
  'compact/collection/Collectable',
  'compact/array/Enumerable',
  'compact/event/Observable'
], 

function(Module, Collectable, Enumerable, Observable) {

  return Module("Collection") .mixin( Collectable, Enumerable, Observable )

  .initialize(function(models) {
    this.models = models || [];
    this._addAllModelListeners();
  })

  .methods({

    get: function(id) {
      return this.find( function(model) {
        return model.id == id ? true : false;
      });

    },

    add: function(model) {
      this.models.push(model);
      this._addModelListeners(model);
      this.dispatchEvent("add", model, this.models.length-1, this);
      return model;
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
        this._removeModelListeners(removedModel);
        this.dispatchEvent("remove", removedModel, removedIndex, this);
      }
      return removedModel;
    },
    
    removeAt: function(index) {
      var model = this.models[index];
      if(model) {
        this.models.splice(index, 1);
        this._removeModelListeners(model);
        this.dispatchEvent("remove", model, index, this);
      }
    },
    
    refresh: function(newModels) {
      if(this.models === newModels) { return; }
      this._removeAllModelListeners();
      this.models = newModels;
      this._addAllModelListeners();
      this.dispatchEvent("refresh");
    },
    
    pop: function() {
      var removedModel = this.models.pop();
      
      if(removedModel) {
        this._removeModelListeners(removedModel);
        this.dispatchEvent("pop", removedModel);
        this.dispatchEvent("remove", removedModel);
      }
      return removedModel;
    },
    
    _addModelListeners: function(model) {
      model.addEventListener("destroy", this.remove, this);
    },
    
    _addAllModelListeners: function() {
      this.each(function(model) {
        this._addModelListeners(model);
      }, this);
    },
    
    _removeModelListeners: function(model) {
      model.removeEventListenersWithContext(this);
    },
    
    _removeAllModelListeners: function() {
      this.each(function(model) {
        this._removeModelListeners(model);
      }, this);
    },
    
    all: function() {
      return this.models;
    },
    
    first: function() {
      return this.models[0];
    },
    
    isEmpty: function() {
      return this.models.length === 0;
    },
    
    clear: function() {
      this.models = [];
      this.dispatchEvent("clear", this);
    },

    _collectableCollection: function() {
      return this.models;
    },
    
    _enumerableCollection: function() {
      return this.models;
    }

  })

  .end();

});
