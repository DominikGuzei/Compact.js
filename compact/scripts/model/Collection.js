
  define(['compact/Class', 'compact/collection/Enumerable'],
  
  function(Class, Enumerable) {
    
    Class("Collection") .mixin(Enumerable)
    
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
      },
      
      remove: function(model) {
        return this.find(function(currentModel, index) {
          return model == currentModel ? this.models.splice(index, 1) : false;
        }, this);
      },
      
      _enumerableCollection: function() {
        return this.models;
      }
      
    })
    
    .end(this);
    
    return this.Collection;
    
  });
