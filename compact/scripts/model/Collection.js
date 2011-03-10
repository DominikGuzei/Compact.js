
  define(['compact/Class', 
          'compact/collection/Enumerable',
          'compact/event/Observable'],
  
  function(Class, Enumerable) {
    
    Class("Collection") .mixin( Enumerable, Observable )
    
    .properties({
      models: []
    })
    
    .methods({
      
      get: function(id) {
        return this.find(function(model) {
          return model.id == id ? true : false;
        });
      },
      
      add: function(model) {
        this.models.push(model);
        this.dispatchEvent("add", model);
      },
      
      remove: function(model) {
        var removedModel = this.find(function(currentModel, index) {
          return model == currentModel ? this.models.splice(index, 1) : false;
        }, this);
        if(removedModel) this.dispatchEvent("remove", removedModel);
        return removedModel;
      },
      
      _enumerableCollection: function() {
        return this.models;
      }
      
    })
    
    .end(this);
    
    return this.Collection;
    
  });
