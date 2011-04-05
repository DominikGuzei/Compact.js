
(function() {
  
  var modules = {};
  var slice = Array.prototype.slice;
  
  window.define = function() {
    var args = arguments,
        moduleName = args[0],
        module = null;      
    
    args = slice.call(args, 1);
    
    if(args.length > 1) {
      var dependencies = args[0];
      var requiredModules = [];
      
      for(var i=0; i < dependencies.length; i++) {
        requiredModules[i] = modules[dependencies[i]];
      }
      
      module = args[1].apply(this, requiredModules);
    } else {
      module = args[0]();
    }
    
    modules[moduleName] = module;
    
  };
  
  window.require = function() {
    var args = arguments,
        dependencies = [],
        callback = null;
    
    if(args.length > 2) {
      args = slice.call(args, 1);
    }
    
    dependencies = args[0];
    callback = args[1];
    
    var requiredModules = [];
    
    for(var i=0; i < dependencies.length; i++) {
      requiredModules[i] = modules[dependencies[i]];
    }
    
    callback.apply(this, requiredModules);
    
  };
  
})();
