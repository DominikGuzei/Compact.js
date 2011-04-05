define([
  'compact/Module'
], 

function(Module) {
  
  var statics = this;
  
  return Module("BindingsManager")

  .initialize(function() {
    this.bindings = {};
  })

  .methods({
    
    registerBinding: function(name, config) {
      this.bindings[name] = config;
    },
    
    bind: function(bindingName, model, property, element) {
      
      var binding = this.bindings[bindingName];
      
      if(binding) {
        return {
          binding: binding,
          model: model,
          element: element,
          property: property,
          setup: function() {
            this.model.addEventListener(this.model.afterChange(property), function(value) {
              this.binding.update(this.element, value, this.model, this.property);
            }, this);
            
            this.binding.setup(this.element, this.model.get(property), this.model, this.property);
            return this;
          },
          cancle: function() {
            
            this.binding.destroy && this.binding.destroy();
            this.model.removeEventListenersWithContext(this);
          }
        }.setup();
        
      } else {
        throw "no binding with name " + bindingName + " was found. Did you require it?";
      }
    }
    
  })

  .statics({
    instance: undefined,
    getInstance: function() {
      if(!statics.BindingsManager.instance) {
        statics.BindingsManager.instance = new statics.BindingsManager();
      }
      return statics.BindingsManager.instance;
    }
  })

  .end(statics);

});