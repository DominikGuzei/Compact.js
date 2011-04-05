define([
  'compact/collection/each',
  'compact/object/copy',
  'compact/object/chain',
  'compact/function/bind'
], 

function(each, copy, chain, bind) {

  var Module = function(modulePackagePath) {
    
    var defaultInitializer = function() {
      if(this.superMethod && this.superMethod !== defaultInitializer) {
        this.superMethod.apply(this, arguments);
      }
    }
    
    return {
      
      /**
       * The specification of methods to add
       * @type {Object}
       */
      methodsDefinition: {
        initializer: defaultInitializer
      },
      
      /**
       * Sets the methods for the module on the specification builder
       *
       * @param {Object} methods
       * @returns {Object} The module-builder object
       */
       
      methods: function(methodsDefinition) {
        copy(methodsDefinition, this.methodsDefinition, true, true);
        return this;
      },
      
      /**
       * Sets the initializer function for the module
       * on the specification builder
       *
       * @param {Function} initializer
       * @returns {Object} The module-builder object
       */
      initialize: function(initializer) {
        this.methodsDefinition.initializer = initializer;
        return this;
      },
      
      /**
       * Sets the static methods/properties for the module
       * on the specification builder
       *
       * @param {Object} statics The static methods/properties
       * @returns {Object} The module-builder object
       */
      statics: function(staticsDefinition) {
        this.staticsDefinition = staticsDefinition;
        return this;
      },
      
      /**
       * Takes an abitrary number of modules which properties
       * and methods are added to this module and whose initializer
       * gets called when this module is initialized.
       * 
       * @param {Object} arguments Arbitrary number of modules
       * @return {Object} The module-builder object
       */
      mixin: function() {
        this.mixins = arguments;
        return this;
      },
      
      /**
       * Sets the superModule for the module to create on the
       * specification builder
       *
       * @param {Function} superModule
       * @return {Object} The module-builder object
       */
      extend: function(superModule) {
        this.superModule = superModule;
        return this;
      },
      
      /**
       * Constructs the module with all given information
       * of the specification-builder object. The module path
       * is appended to the baseNamespace object.
       *
       * @param {object} baseNamespace The object the module path is appended to
       */
      end: function(baseNamespace) {
        
        var moduleSpecification = this;
        var modulePackage = buildModulePackage(baseNamespace, modulePackagePath);
        var moduleConstructor = buildModuleConstructor(moduleSpecification, modulePackage);
        
        this.superModule && extendSuperModule(moduleSpecification, moduleConstructor);
        this.mixins && addMixinMethods(moduleSpecification);
        this.staticsDefinition && addStatics(this.staticsDefinition, moduleConstructor);
        
        addPrototypeMethods(moduleConstructor.prototype, this.methodsDefinition, this.superModule);
        
        return moduleConstructor;
      }
      
    };    
  };
  
  /**
   * Builds an object chain on top of the given base object
   * that can be used to define the module constructor.
   *
   * @param {Object} baseNamespace The base object the chain should be built on
   * @param {String} modulePathString A dot separated package path for the Module
   * 
   * @return {Object} The package information with namespace and name properties.
   */
  
  function buildModulePackage(baseNamespace, modulePathString) {
    
    var modulePathArray = modulePathString.split("."); // the full module path as array of strings
    var moduleName = modulePathArray[modulePathArray.length - 1]; // name of the module as string
    var namespace = chain(baseNamespace || {}, modulePathArray);

    return {
      namespace: namespace,
      name: moduleName
    };
  }
  
  /**
   * Adds all prototype methods of the given mixed in modules
   * to the methodsDefinition of the module being constructed.
   *
   * @param {Object} moduleSpecification The specification of the module being constructed
   */
  
  function addMixinMethods(moduleSpecification) {
    if(moduleSpecification.mixins) {
      
      each(moduleSpecification.mixins, function(mixin) {
        copy( mixin.prototype, 
              moduleSpecification.methodsDefinition, 
              false, true
        );
      });
      
    }
  }
  
  /**
   * Creates a constructor function for the module that first
   * calls all initializers of its mixins and its super module,
   * then its own to establish a well known state.
   * 
   * @param {Object} moduleSpecification All collected information about the module
   * @param {Object} modulePackage The namespace and name of the module
   * 
   * @return {Function} The constructor
   */
  
  function buildModuleConstructor(moduleSpecification, modulePackage) {
    var moduleConstructor = function() {
      this.Module = moduleConstructor;
      this.initializer.apply(this, arguments);
    };
    modulePackage.namespace[modulePackage.name] = moduleConstructor;
    moduleConstructor.name = modulePackage.name;
    
    return moduleConstructor;
  }
  
  /**
   * Applies the correct prototype chain to implement
   * prototypal inheritance in javascript
   * 
   * @param {Object} moduleSpecification All collected information about the module
   * @param {Function} moduleConstructor
   */
  
  function extendSuperModule(moduleSpecification, moduleConstructor) {
    
    // copy the superModule prototype to the module prototype
    if(moduleSpecification.superModule) {
      function temporarySupermodule() {};
      temporarySupermodule.prototype = moduleSpecification.superModule.prototype;
      moduleConstructor.prototype = new temporarySupermodule();
    }
    
    // let the module prototype's constructor point to its true constructor
    moduleConstructor.prototype.constructor = moduleConstructor;
  }
  
  /**
   * Assigns all methods declared in the methods definition object
   * to the given obj. On sub modules it saves
   * a reference to the overwritten super method in each method.
   *
   * @param {Object} destination The Object all methods are added to
   * @param {function} superModule The base module to extend from
   * @param {object} methods The method definition object
   */

  function addPrototypeMethods(destination, methods, superModule) {

    for (var methodName in methods) {
      if (methods.hasOwnProperty(methodName)) {
        destination[methodName] = (superModule && superModule.prototype[methodName]) ?

        (function(methodName, methodOfThisModule) {

          return function() {
            var tempSuper = this.superMethod;
            
            // add a reference to the same method on the super module
            this.superMethod = superModule.prototype[methodName];
            
            // apply the current context with arguments and superMethod reference
            var returnValue = methodOfThisModule.apply(this, arguments);
            
            // we dont need the reference anymore, so delete it.
            tempSuper ? this.superMethod = tempSuper : delete this["superMethod"];
            
            // return the result of the applied method
            return returnValue;
          };

        })(methodName, methods[methodName])

        : methods[methodName];
      }
    }
  }
  
  function addStatics(staticsDefinition, constructor) {
    copy(staticsDefinition, constructor, true, true, constructor);
  }

  return Module;

});

